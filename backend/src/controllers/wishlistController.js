const db = require('../config/db');

// 내 찜 목록 (Wishlist.jsx, ProductCard의 liked 표시용)
function getWishlist(req, res) {
  const items = db
    .prepare(
      `SELECT w.id AS wishlistId, p.*
       FROM wishlists w JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ?
       ORDER BY w.id DESC`
    )
    .all(req.user.id);

  res.json(items);
}

// 찜 추가
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

// 찜 삭제 (상품 ID 기준 - 하트를 다시 누르면 토글되는 UX에 맞춤)
function removeWishlist(req, res) {
  const { productId } = req.params;

  db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);
  res.json({ message: '찜 목록에서 삭제되었습니다.' });
}

module.exports = { getWishlist, addWishlist, removeWishlist };
