const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { blacklistToken } = require('../middleware/authMiddleware');
require('dotenv').config();

const SALT_ROUNDS = 10;
const MAX_FAILED_LOGIN = 5; // SR-02

function issueTokenCookie(res, user) {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
  );

  // SR-05: HttpOnly, Secure, SameSite 적용
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 로컬 개발(http)에서는 false여야 쿠키가 저장됨
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000, // 30분 (JWT_EXPIRES_IN과 맞춰주세요)
  });

  return token;
}

async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: '이메일, 비밀번호, 이름을 모두 입력해주세요.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: '이미 가입된 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    db.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    ).run(email, hashedPassword, name, 'user');

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' }); // SR-04: 내부 정보 미노출
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    // SR-03: 계정 존재 여부를 노출하지 않기 위해 항상 같은 에러 메시지 사용
    const invalidMsg = { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };

    if (!user) {
      return res.status(401).json(invalidMsg);
    }

    // SR-02: 로그인 실패 횟수 제한
    if (user.failed_login_count >= MAX_FAILED_LOGIN) {
      return res.status(429).json({ error: '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      db.prepare('UPDATE users SET failed_login_count = failed_login_count + 1 WHERE id = ?').run(user.id);
      return res.status(401).json(invalidMsg);
    }

    // 로그인 성공 시 실패 횟수 초기화
    db.prepare('UPDATE users SET failed_login_count = 0 WHERE id = ?').run(user.id);

    issueTokenCookie(res, user);

    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

function logout(req, res) {
  if (req.token) {
    blacklistToken(req.token); // SR-06: 서버 세션(토큰) 무효화
  }
  res.clearCookie('token');
  res.json({ message: '로그아웃되었습니다.' });
}

module.exports = { register, login, logout };