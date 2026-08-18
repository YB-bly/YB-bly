const db = require('../config/db');

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