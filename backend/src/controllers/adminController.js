const db = require('../config/db');

// 전체 주문 목록 (관리자)
function listOrders(req, res) {
  const orders = db
    .prepare(
      `SELECT o.*, u.email, u.name AS userName
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    )
    .all();
  res.json(orders);
}

// 주문 상태 변경 (SR-11: 결제 상태 등 주문 상태 변경은 관리자만 가능)
function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'paid', 'preparing', 'shipping', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: '올바르지 않은 상태값입니다.' });
  }

  const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
  if (!order) return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  res.json({ message: '주문 상태가 변경되었습니다.' });
}

// 회원 목록 (최소 구현 - 상세 관리 기능은 핵심 기능 완성 후 확장 예정)
function listUsers(req, res) {
  const users = db
    .prepare('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC')
    .all();
  res.json(users);
}

// 대시보드 요약 (최소 구현)
function dashboard(req, res) {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  const orderCount = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
  const salesTotal =
    db.prepare(`SELECT COALESCE(SUM(total_price), 0) AS sum FROM orders WHERE status = 'paid'`).get().sum;

  res.json({ userCount, productCount, orderCount, salesTotal });
}

// 주문 통계 (관리자)
function orderStatistics(req, res) {
  const from = req.query.from || '1970-01-01';
  const to = req.query.to || '9999-12-31';
  const dateFilter = `date(o.created_at) BETWEEN date(?) AND date(?)`;

  const summary = db
    .prepare(
      `SELECT
         COUNT(*) AS totalOrders,
         COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_price ELSE 0 END), 0) AS totalSales,
         COALESCE(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END), 0) AS cancelledOrRefundedOrders
       FROM orders o
       WHERE ${dateFilter}`
    )
    .get(from, to);

  const dailySales = db
    .prepare(
      `SELECT
         date(o.created_at) AS date,
         COUNT(*) AS orderCount,
         COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_price ELSE 0 END), 0) AS sales
       FROM orders o
       WHERE ${dateFilter}
       GROUP BY date(o.created_at)
       ORDER BY date(o.created_at) DESC`
    )
    .all(from, to);

  const popularProducts = db
    .prepare(
      `SELECT p.id, p.name, SUM(oi.quantity) AS quantitySold
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN products p ON p.id = oi.product_id
       WHERE ${dateFilter} AND o.status != 'cancelled'
       GROUP BY p.id, p.name
       ORDER BY quantitySold DESC, p.id ASC
       LIMIT 10`
    )
    .all(from, to);

  const recentOrders = db
    .prepare(
      `SELECT o.id, o.order_number AS orderNumber, o.total_price AS totalPrice,
              o.status, o.created_at AS createdAt, u.name, u.email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       WHERE ${dateFilter}
       ORDER BY o.created_at DESC
       LIMIT 10`
    )
    .all(from, to)
    .map((order) => ({
      ...order,
      name: maskName(order.name),
      email: maskEmail(order.email),
    }));

  res.json({ period: { from, to }, summary, dailySales, popularProducts, recentOrders });
}

function maskName(name = '') {
  if (name.length <= 1) return '*';
  if (name.length === 2) return `${name[0]}*`;
  return `${name[0]}${'*'.repeat(name.length - 2)}${name.at(-1)}`;
}

function maskEmail(email = '') {
  const [localPart, domain] = email.split('@');
  if (!domain) return '***';
  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}${'*'.repeat(Math.max(1, localPart.length - visible.length))}@${domain}`;
}

// 전체 리뷰 목록 (관리자) - 상품/작성자 정보 포함, 숨김 처리된 것도 다 보임
function listReviews(req, res) {
  const reviews = db
    .prepare(
      `SELECT r.*, u.name AS userName, p.name AS productName, p.image_url AS productImage
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN products p ON p.id = r.product_id
       ORDER BY r.created_at DESC`
    )
    .all();
  res.json(reviews);
}

// 리뷰 숨김/공개 토글
function toggleReviewHidden(req, res) {
  const { id } = req.params;
  const { hidden } = req.body; // true/false

  const review = db.prepare('SELECT id FROM reviews WHERE id = ?').get(id);
  if (!review) return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });

  db.prepare('UPDATE reviews SET hidden = ? WHERE id = ?').run(hidden ? 1 : 0, id);
  res.json({ message: hidden ? '리뷰가 숨김 처리되었습니다.' : '리뷰가 다시 공개되었습니다.' });
}

module.exports = {
  listOrders,
  updateOrderStatus,
  listUsers,
  dashboard,
  orderStatistics,
  listReviews,
  toggleReviewHidden,
};
