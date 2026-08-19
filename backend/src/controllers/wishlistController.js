const db = require('../config/db');

const RATING_SUBQUERY = `
  COALESCE(
    (SELECT ROUND(AVG(rating), 1)
     FROM reviews
     WHERE product_id = p.id),
    0
  ) AS rating,

  (SELECT COUNT(*)
   FROM reviews
   WHERE product_id = p.id) AS reviewCount
`;

function getWishlist(req, res) {
  const items = db
    .prepare(
      `SELECT w.id AS wishlistId, p.*, ${RATING_SUBQUERY}
       FROM wishlists w JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ?
       ORDER BY w.id DESC`
    )
    .all(req.user.id);

  res.json(items);
}

function addWishlist(req, res) {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: '상품을 선택해주세요.' });

  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
  if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

  db.prepare('INSERT OR IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)').run(
    req.user.id,
    productId
  );

  res.status(201).json({ message: '찜 목록에 추가되었습니다.' });
}

function removeWishlist(req, res) {
  const { productId } = req.params;

  db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);
  res.json({ message: '찜 목록에서 삭제되었습니다.' });
}

module.exports = { getWishlist, addWishlist, removeWishlist };
