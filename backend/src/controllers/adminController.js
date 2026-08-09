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

module.exports = { listOrders, updateOrderStatus, listUsers, dashboard };
