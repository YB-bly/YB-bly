const db = require('../config/db');

// 특정 상품의 리뷰 목록 (정상 버전: order_id는 응답에 포함하지 않음)
function listByProduct(req, res) {
  const { productId } = req.params;

  const reviews = db
    .prepare(
      `SELECT r.id, r.content, r.rating, r.created_at, u.name AS userName
       FROM reviews r JOIN users u ON u.id = r.user_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`
    )
    .all(productId);

  res.json(reviews);
}

// 리뷰 작성 (실제로 구매(주문)한 상품에 대해서만 작성 가능 - 구매 인증)
function create(req, res) {
  const { productId, orderId, content, rating } = req.body;
  const userId = req.user.id;

  if (!productId || !orderId || !content) {
    return res.status(400).json({ error: '필수 값이 누락되었습니다.' });
  }

  // 해당 주문이 본인 것이고, 그 주문에 이 상품이 실제로 포함되어 있는지 확인
  const purchased = db
    .prepare(
      `SELECT oi.id FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ? AND o.status = 'paid'`
    )
    .get(orderId, userId, productId);

  if (!purchased) {
    return res.status(403).json({ error: '구매한 상품에 대해서만 리뷰를 작성할 수 있습니다.' });
  }

  db.prepare(
    `INSERT INTO reviews (user_id, product_id, order_id, content, rating) VALUES (?, ?, ?, ?, ?)`
  ).run(userId, productId, orderId, content, rating || 5);

  res.status(201).json({ message: '리뷰가 등록되었습니다.' });
}

function remove(req, res) {
  const { id } = req.params;

  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (!review) return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });

  // 본인 리뷰이거나 관리자만 삭제 가능
  if (review.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: '삭제 권한이 없습니다.' });
  }

  db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
  res.json({ message: '삭제되었습니다.' });
}

module.exports = { listByProduct, create, remove };
