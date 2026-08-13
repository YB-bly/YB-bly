const db = require('../config/db');

// "20260806-00001" 형식의 사람이 읽는 주문번호 생성 (당일 순번 기준)
function generateOrderNumber() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const todayCount = db
    .prepare(`SELECT COUNT(*) AS count FROM orders WHERE order_number LIKE ?`)
    .get(`${datePart}-%`).count;
  const seq = String(todayCount + 1).padStart(5, '0');
  return `${datePart}-${seq}`;
}

// 주문 생성 (장바구니 → 주문 전환, 모의 결제까지 한 번에 처리)
// SR-09: 가격은 서버가 DB에서 다시 조회해서 계산 (클라이언트 값 신뢰하지 않음)
// SR-10: idempotencyKey로 중복 주문 방지
function createOrder(req, res) {
  const { couponCode, idempotencyKey, recipientName, recipientPhone, address } = req.body;
  const userId = req.user.id;

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'idempotencyKey가 필요합니다.' });
  }
  if (!recipientName || !recipientPhone || !address) {
    return res.status(400).json({ error: '배송지 정보(수령인, 연락처, 주소)를 입력해주세요.' });
  }

  const already = db.prepare('SELECT id FROM orders WHERE idempotency_key = ?').get(idempotencyKey);
  if (already) {
    return res.status(200).json({ orderId: already.id, message: '이미 처리된 주문입니다.' });
  }

  const cartItems = db
    .prepare(
      `SELECT c.product_id, c.option_label, c.quantity, p.price, p.stock, p.name
       FROM cart_items c JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?`
    )
    .all(userId);

  if (cartItems.length === 0) {
    return res.status(400).json({ error: '장바구니가 비어있습니다.' });
  }

  // 재고 확인 (서버 기준)
  for (const item of cartItems) {
    if (item.quantity > item.stock) {
      return res.status(409).json({ error: `${item.name}의 재고가 부족합니다.` });
    }
  }

  // 총액은 DB에 저장된 가격 기준으로만 계산 (클라이언트가 가격을 보내도 무시함)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let totalPrice = subtotal;

  let couponId = null;
  if (couponCode) {
    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ?').get(couponCode);
    if (!coupon) {
      return res.status(400).json({ error: '유효하지 않은 쿠폰입니다.' });
    }

    const used = db
      .prepare('SELECT id FROM coupon_usage WHERE user_id = ? AND coupon_id = ?')
      .get(userId, coupon.id);
    if (used) {
      return res.status(409).json({ error: '이미 사용한 쿠폰입니다.' });
    }

    // 최소 주문 금액 조건 (예: ONCE20은 10만원 이상 구매 시에만 적용 가능)
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return res.status(400).json({
        error: `${coupon.min_order_amount.toLocaleString('ko-KR')}원 이상 구매 시 사용할 수 있는 쿠폰입니다.`,
      });
    }

    couponId = coupon.id;
    totalPrice = Math.round(totalPrice * (1 - coupon.discount_percent / 100));
  }

  const orderNumber = generateOrderNumber();

  const runTransaction = db.transaction(() => {
    const orderResult = db
      .prepare(
        `INSERT INTO orders (order_number, user_id, total_price, status, coupon_id, recipient_name, recipient_phone, address, idempotency_key)
         VALUES (?, ?, ?, 'paid', ?, ?, ?, ?, ?)`
      )
      .run(orderNumber, userId, totalPrice, couponId, recipientName, recipientPhone, address, idempotencyKey);

    const orderId = orderResult.lastInsertRowid;

    const insertOrderItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, option_label, quantity, price_at_order) VALUES (?, ?, ?, ?, ?)`
    );
    const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const item of cartItems) {
      insertOrderItem.run(orderId, item.product_id, item.option_label, item.quantity, item.price);
      decrementStock.run(item.quantity, item.product_id);
    }

    if (couponId) {
      db.prepare('INSERT INTO coupon_usage (user_id, coupon_id, order_id) VALUES (?, ?, ?)').run(
        userId,
        couponId,
        orderId
      );
    }

    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

    return orderId;
  });

  try {
    const orderId = runTransaction();
    res.status(201).json({ orderId, orderNumber, totalPrice, status: 'paid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '주문 처리 중 오류가 발생했습니다.' });
  }
}

// 내 주문 목록 (Orders.jsx가 상품 썸네일까지 바로 보여줄 수 있게 대표 상품 정보도 같이 반환)
function myOrders(req, res) {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);

  const getItemsStmt = db.prepare(
    `SELECT oi.*, p.name, p.brand, p.image_url FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`
  );

  const withItems = orders.map((order) => ({ ...order, items: getItemsStmt.all(order.id) }));
  res.json(withItems);
}

// 주문 상세 (SR-08: 본인 주문만 조회 가능 - 소유자 검증)
function orderDetail(req, res) {
  const { id } = req.params;

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });

  // 본인 주문이 아니면 관리자가 아닌 이상 접근 불가
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: '접근 권한이 없습니다.' });
  }

  const items = db
    .prepare(
      `SELECT oi.*, p.name, p.brand, p.image_url FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`
    )
    .all(id);

  res.json({ ...order, items });
}

module.exports = { createOrder, myOrders, orderDetail, generateOrderNumber };