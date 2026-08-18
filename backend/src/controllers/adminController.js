const db = require('../config/db');

function listOrders(req, res) {
  const orders = db.prepare(
    `SELECT o.*, u.email, u.name AS userName
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`
  ).all();

  return res.json(orders);
}

function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = [
    'pending',
    'paid',
    'preparing',
    'shipping',
    'delivered',
    'cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: '올바르지 않은 상태값입니다.' });
  }

  const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
  if (!order) {
    return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  return res.json({ message: '주문 상태가 변경되었습니다.' });
}

function listUsers(req, res) {
  const users = db.prepare(
    'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
  ).all();

  return res.json(users);
}

function dashboard(req, res) {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  const orderCount = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
  const salesTotal = db.prepare(
    `SELECT COALESCE(SUM(total_price), 0) AS sum
     FROM orders
     WHERE status = 'paid'`
  ).get().sum;

  return res.json({ userCount, productCount, orderCount, salesTotal });
}

function maskName(name) {
  if (!name) return '';
  if (name.length === 1) return '*';
  if (name.length === 2) return `${name[0]}*`;
  return `${name[0]}${'*'.repeat(name.length - 2)}${name.at(-1)}`;
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
}

function orderStatistics(req, res) {
  const from = req.query.from || '1970-01-01';
  const to = req.query.to || '2999-12-31';

  const summary = db.prepare(
    `SELECT
       COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_price ELSE 0 END), 0)
         AS totalSales,
       COUNT(*) AS totalOrders,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)
         AS cancelledOrRefundedOrders
     FROM orders
     WHERE date(created_at) BETWEEN date(?) AND date(?)`
  ).get(from, to);

  const popularProducts = db.prepare(
    `SELECT
       p.id,
       p.name,
       SUM(oi.quantity) AS quantitySold,
       SUM(oi.quantity * oi.price_at_order) AS salesAmount
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     JOIN products p ON p.id = oi.product_id
     WHERE o.status != 'cancelled'
       AND date(o.created_at) BETWEEN date(?) AND date(?)
     GROUP BY p.id, p.name
     ORDER BY quantitySold DESC, salesAmount DESC
     LIMIT 5`
  ).all(from, to);

  const recentOrders = db.prepare(
    `SELECT
       o.order_number AS orderNumber,
       o.total_price AS totalPrice,
       o.status,
       o.created_at AS createdAt,
       u.name,
       u.email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC
     LIMIT 10`
  ).all().map((order) => ({
    orderNumber: order.orderNumber,
    customerName: maskName(order.name),
    customerEmail: maskEmail(order.email),
    totalPrice: Number(order.totalPrice),
    status: order.status,
    createdAt: order.createdAt,
  }));

  return res.json({
    period: { from, to },
    totalSales: Number(summary.totalSales),
    totalOrders: Number(summary.totalOrders),
    cancelledOrRefundedOrders: Number(summary.cancelledOrRefundedOrders),
    popularProducts: popularProducts.map((product) => ({
      ...product,
      id: Number(product.id),
      quantitySold: Number(product.quantitySold),
      salesAmount: Number(product.salesAmount),
    })),
    recentOrders,
  });
}

function listReviews(req, res) {
  const reviews = db.prepare(
    `SELECT
       r.*,
       u.name AS userName,
       p.name AS productName,
       p.image_url AS productImage
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN products p ON p.id = r.product_id
     ORDER BY r.created_at DESC`
  ).all();

  return res.json(reviews);
}

function toggleReviewHidden(req, res) {
  const { id } = req.params;
  const { hidden } = req.body;
  const review = db.prepare('SELECT id FROM reviews WHERE id = ?').get(id);

  if (!review) {
    return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
  }

  db.prepare('UPDATE reviews SET hidden = ? WHERE id = ?').run(hidden ? 1 : 0, id);
  return res.json({
    message: hidden ? '리뷰가 숨김 처리되었습니다.' : '리뷰가 다시 공개되었습니다.',
  });
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