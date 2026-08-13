const db = require('../config/db');

// 내가 아직 안 쓴 쿠폰만 조회 (이미 쓴 쿠폰은 목록에서 아예 제외됨)
function listMyCoupons(req, res) {
  const coupons = db
    .prepare(
      `SELECT c.* FROM coupons c
       WHERE c.id NOT IN (
         SELECT coupon_id FROM coupon_usage WHERE user_id = ?
       )
       ORDER BY c.id`
    )
    .all(req.user.id);

  res.json(coupons);
}

module.exports = { listMyCoupons };