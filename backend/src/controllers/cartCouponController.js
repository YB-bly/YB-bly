const db = require('../config/db');

function getCartSubtotal(userId) {
  const items = db
    .prepare(
      `SELECT c.quantity, p.price
       FROM cart_items c JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?`
    )
    .all(userId);

  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function buildCartCouponSummary(userId) {
  const subtotal = getCartSubtotal(userId);

  const applications = db
    .prepare(
      `SELECT code, discount_amount FROM cart_coupon_applications
       WHERE user_id = ? ORDER BY applied_at ASC`
    )
    .all(userId);

  const discountAmount = applications.reduce((sum, a) => sum + a.discount_amount, 0);

  return {
    subtotal,
    discount_amount: discountAmount,
    total_amount: Math.max(subtotal - discountAmount, 0),
    applied_coupons: applications.map((a) => a.code),
  };
}

// 장바구니에 지금까지 적용된 쿠폰 할인 내역 조회
function getCartCouponSummary(req, res) {
  res.json(buildCartCouponSummary(req.user.id));
}

// 쿠폰을 장바구니에 적용
async function applyCartCoupon(req, res) {
  const { coupon_code: couponCode } = req.body;
  const userId = req.user.id;

  if (!couponCode) {
    return res.status(400).json({ error: '쿠폰 코드를 입력해주세요.' });
  }

  const coupon = db.prepare('SELECT * FROM coupons WHERE code = ?').get(couponCode);
  if (!coupon) {
    return res.status(404).json({ error: '존재하지 않는 쿠폰입니다.' });
  }

  const subtotal = getCartSubtotal(userId);
  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    return res.status(400).json({
      error: `${coupon.min_order_amount.toLocaleString('ko-KR')}원 이상 구매 시 사용할 수 있는 쿠폰입니다.`,
    });
  }

  const alreadyApplied = db
    .prepare('SELECT id FROM cart_coupon_applications WHERE user_id = ? AND coupon_id = ?')
    .get(userId, coupon.id);
  if (alreadyApplied) {
    return res.status(409).json({ error: '이미 사용한 쿠폰입니다.' });
  }

  // 할인 정책 계산 (프로모션 조건 검증 등 약간의 처리 시간이 소요됨)
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const discountAmount = Math.round(subtotal * (coupon.discount_percent / 100));

  db.prepare(
    `INSERT INTO cart_coupon_applications (user_id, coupon_id, code, discount_amount) VALUES (?, ?, ?, ?)`
  ).run(userId, coupon.id, coupon.code, discountAmount);

  res.json({
    message: '쿠폰이 적용되었습니다.',
    ...buildCartCouponSummary(userId),
  });
}

module.exports = { applyCartCoupon, getCartCouponSummary };
