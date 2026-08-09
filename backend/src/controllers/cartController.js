const db = require('../config/db');

// 내 장바구니 조회 (상품 정보 join)
function getCart(req, res) {
  const items = db
    .prepare(
      `SELECT c.id AS cartItemId, c.quantity, c.option_label AS optionLabel,
              p.id AS productId, p.name, p.brand, p.price, p.image_url, p.stock
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?`
    )
    .all(req.user.id);

  res.json(items);
}

// 장바구니에 담기 (같은 상품+같은 옵션이 이미 있으면 수량 증가)
function addItem(req, res) {
  const { productId, quantity, optionLabel } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: '상품과 올바른 수량을 입력해주세요.' });
  }

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

  const label = optionLabel || '';

  const existing = db
    .prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND option_label = ?')
    .get(req.user.id, productId, label);

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
  } else {
    db.prepare(
      'INSERT INTO cart_items (user_id, product_id, option_label, quantity) VALUES (?, ?, ?, ?)'
    ).run(req.user.id, productId, label, quantity);
  }

  res.status(201).json({ message: '장바구니에 담았습니다.' });
}

// 수량 변경
function updateItem(req, res) {
  const { id } = req.params; // cart_items.id
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: '수량은 1 이상이어야 합니다.' });
  }

  // 본인 장바구니 항목인지 확인 (IDOR 방지)
  const item = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(id);
  if (!item || item.user_id !== req.user.id) {
    return res.status(404).json({ error: '장바구니 항목을 찾을 수 없습니다.' });
  }

  db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, id);
  res.json({ message: '수량이 변경되었습니다.' });
}

// 삭제
function removeItem(req, res) {
  const { id } = req.params;

  const item = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(id);
  if (!item || item.user_id !== req.user.id) {
    return res.status(404).json({ error: '장바구니 항목을 찾을 수 없습니다.' });
  }

  db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);
  res.json({ message: '삭제되었습니다.' });
}

module.exports = { getCart, addItem, updateItem, removeItem };

