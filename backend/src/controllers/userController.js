const db = require('../config/db');
const bcrypt = require('bcrypt');

function getProfile(req, res) {
  const user = db
    .prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?')
    .get(req.user.id);

  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
  res.json(user);
}

async function updateProfile(req, res) {
  const { name, password } = req.body;
  const updates = [];
  const values = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (password) {
    if (password.length < 4) {
      return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    updates.push('password = ?');
    values.push(hashed);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: '수정할 내용이 없습니다.' });
  }

  values.push(req.user.id);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  res.json({ message: '정보가 수정되었습니다.' });
}

module.exports = { getProfile, updateProfile };
