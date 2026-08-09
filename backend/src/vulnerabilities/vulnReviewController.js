const db = require('../config/db');

//    취약 포인트: "구매 인증" 표시를 위해 리뷰 응답에 orderId를 그대로 내려줌
//    → 공격자가 상품 리뷰만 훑어봐도 다른 사용자의 실제 주문 번호를 알아낼 수 있음
//    → 이 orderId를 vulnOrderController의 IDOR 취약점과 함께 사용하면 주문 상세 열람 가능
function vulnListByProduct(req, res) {
  const { productId } = req.params;

  const reviews = db
    .prepare(
      `SELECT r.id, r.content, r.rating, r.created_at, r.order_id AS orderId, u.name AS userName
       FROM reviews r JOIN users u ON u.id = r.user_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`
    )
    .all(productId);

  res.json(reviews);
}

module.exports = { vulnListByProduct };
