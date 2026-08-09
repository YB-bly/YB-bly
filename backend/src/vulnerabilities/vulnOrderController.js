const db = require('../config/db');

// 🚩 취약 포인트 (비즈니스 로직): 클라이언트가 보낸 items 배열을 그대로 신뢰해서
//    같은 상품을 여러 줄로 쪼개 보내면, 쿠폰 할인이 "누적된 총액"에 매 줄마다 다시 적용되어
//    (복리처럼 할인이 겹쳐 계산됨) 줄을 많이 쪼갤수록 최종 금액이 점점 더 낮아짐
function vulnCreateOrder(req, res) {
  const { items, couponCode, idempotencyKey } = req.body;
  const userId = req.user.id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '상품을 선택해주세요.' });
  }
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'idempotencyKey가 필요합니다.' });
  }

  const already = db.prepare('SELECT id FROM orders WHERE idempotency_key = ?').get(idempotencyKey);
  if (already) {
    return res.status(200).json({ orderId: already.id, message: '이미 처리된 주문입니다.' });
  }

  let coupon = null;
  if (couponCode) {
    coupon = db.prepare('SELECT * FROM coupons WHERE code = ?').get(couponCode);
    if (!coupon) return res.status(400).json({ error: '유효하지 않은 쿠폰입니다.' });

    const used = db
      .prepare('SELECT id FROM coupon_usage WHERE user_id = ? AND coupon_id = ?')
      .get(userId, coupon.id);
    if (used) return res.status(409).json({ error: '이미 사용한 쿠폰입니다.' });
  }

  const resolvedItems = [];
  let runningTotal = 0; // 🚩 여기가 문제의 누적 변수

  for (const it of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(it.productId);
    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    if (it.quantity > product.stock) {
      return res.status(409).json({ error: `${product.name}의 재고가 부족합니다.` });
    }

    runningTotal += product.price * it.quantity;

    // 🚩 여기가 취약 포인트: 할인을 "한 번"이 아니라 "매 항목을 더할 때마다" 누적 총액 전체에 다시 적용
    //    항목을 여러 줄로 쪼갤수록 할인이 여러 번 겹쳐 적용되는 효과가 생김
    if (coupon) {
      runningTotal = Math.round(runningTotal * (1 - coupon.discount_percent / 100));
    }

    resolvedItems.push({ productId: product.id, quantity: it.quantity, price: product.price });
  }

  const totalPrice = runningTotal;

  const runTx = db.transaction(() => {
    const orderResult = db
      .prepare(
        `INSERT INTO orders (user_id, total_price, status, coupon_id, idempotency_key)
         VALUES (?, ?, 'paid', ?, ?)`
      )
      .run(userId, totalPrice, coupon ? coupon.id : null, idempotencyKey);

    const orderId = orderResult.lastInsertRowid;

    const insertOrderItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, quantity, price_at_order) VALUES (?, ?, ?, ?)`
    );
    const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const item of resolvedItems) {
      insertOrderItem.run(orderId, item.productId, item.quantity, item.price);
      decrementStock.run(item.quantity, item.productId);
    }

    if (coupon) {
      db.prepare('INSERT INTO coupon_usage (user_id, coupon_id, order_id) VALUES (?, ?, ?)').run(
        userId,
        coupon.id,
        orderId
      );
    }

    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

    return orderId;
  });

  try {
    const orderId = runTx();
    res.status(201).json({ orderId, totalPrice, status: 'paid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '주문 처리 중 오류가 발생했습니다.' });
  }
}

function myOrders(req, res) {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json(orders);
}

// 🚩 취약 포인트 (IDOR): 로그인 여부만 확인하고, 주문의 소유자가 본인인지는 확인하지 않음
function vulnOrderDetail(req, res) {
  const { id } = req.params;

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });

  // 소유자 검증이 빠져있음 - 로그인만 되어 있으면 누구 주문이든 조회 가능
  const items = db
    .prepare(
      `SELECT oi.*, p.name FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`
    )
    .all(id);

  res.json({ ...order, items });
}

module.exports = { vulnCreateOrder, myOrders, vulnOrderDetail };
