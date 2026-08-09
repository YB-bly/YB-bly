const db = require('../config/db');

// 상품 목록에 평점/리뷰수를 항상 같이 계산해서 붙여주는 서브쿼리 (reviews 테이블 기준으로 실시간 계산 - 데이터 안 어긋남)
const RATING_SUBQUERY = `
  COALESCE((SELECT ROUND(AVG(rating), 1) FROM reviews WHERE product_id = p.id), 0) AS rating,
  (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) AS reviewCount
`;

// 상품 목록 (카테고리 필터 지원)
function list(req, res) {
  const { category } = req.query;

  const products = category
    ? db
        .prepare(`SELECT p.*, ${RATING_SUBQUERY} FROM products p WHERE p.category = ? ORDER BY p.created_at DESC`)
        .all(category)
    : db.prepare(`SELECT p.*, ${RATING_SUBQUERY} FROM products p ORDER BY p.created_at DESC`).all();

  res.json(products);
}

// 상품 상세
function detail(req, res) {
  const product = db
    .prepare(`SELECT p.*, ${RATING_SUBQUERY} FROM products p WHERE p.id = ?`)
    .get(req.params.id);
  if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
  res.json(product);
}

// 상품 검색 (SR-13: Prepared Statement로 SQL 인젝션 방지)
function search(req, res) {
  const { q } = req.query;
  if (!q) return res.json([]);

  const products = db
    .prepare(`SELECT p.*, ${RATING_SUBQUERY} FROM products p WHERE p.name LIKE ? OR p.brand LIKE ? ORDER BY p.created_at DESC`)
    .all(`%${q}%`, `%${q}%`);

  res.json(products);
}

// ---- 관리자 전용 ----

function create(req, res) {
  const { name, brand, price, originalPrice, discountPercent, badge, category, description, image_url, stock } = req.body;

  if (!name || price == null || stock == null) {
    return res.status(400).json({ error: '상품명, 가격, 재고는 필수입니다.' });
  }
  if (price < 0 || stock < 0) {
    return res.status(400).json({ error: '가격과 재고는 0 이상이어야 합니다.' });
  }

  const result = db
    .prepare(
      `INSERT INTO products (name, brand, price, original_price, discount_percent, badge, category, description, image_url, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      name,
      brand || '',
      price,
      originalPrice ?? price,
      discountPercent || 0,
      badge || null,
      category || '',
      description || '',
      image_url || '',
      stock
    );

  res.status(201).json({ id: result.lastInsertRowid });
}

function update(req, res) {
  const { id } = req.params;
  const { name, brand, price, originalPrice, discountPercent, badge, category, description, image_url, stock } = req.body;

  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

  db.prepare(
    `UPDATE products SET name = ?, brand = ?, price = ?, original_price = ?, discount_percent = ?,
     badge = ?, category = ?, description = ?, image_url = ?, stock = ? WHERE id = ?`
  ).run(name, brand, price, originalPrice, discountPercent, badge, category, description, image_url, stock, id);

  res.json({ message: '상품이 수정되었습니다.' });
}

function remove(req, res) {
  const { id } = req.params;
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  res.json({ message: '상품이 삭제되었습니다.' });
}

function updateStock(req, res) {
  const { id } = req.params;
  const { stock } = req.body;

  if (stock == null || stock < 0) {
    return res.status(400).json({ error: '재고는 0 이상의 숫자여야 합니다.' });
  }

  db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(stock, id);
  res.json({ message: '재고가 수정되었습니다.' });
}

module.exports = { list, detail, search, create, update, remove, updateStock };

