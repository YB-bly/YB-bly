const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { blacklistToken } = require('../middleware/authMiddleware');
require('dotenv').config();

const SALT_ROUNDS = 10;
const MAX_FAILED_LOGIN = 5;
const LOCKOUT_DURATION_MS = 60 * 60 * 1000;

function issueToken(res, user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');
  }

  const token = jwt.sign(
    {
      email: user.email,
      role: String(user.role).toUpperCase(),
    },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: String(user.id),
      issuer: 'shopping-auth',
      audience: 'shopping-api',
      expiresIn: process.env.JWT_EXPIRES_IN || '30m',
    }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000,
  });

  return token;
}

async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: '이메일, 비밀번호, 이름을 모두 입력해주세요.',
      });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: '이미 가입된 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    db.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    ).run(email, hashedPassword, name, 'user');

    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    const invalidMsg = { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };

    if (!user) {
      return res.status(401).json(invalidMsg);
    }

    const now = Date.now();
    const lockedUntil = user.locked_until
      ? new Date(user.locked_until).getTime()
      : null;

    if (lockedUntil && lockedUntil > now) {
      const remainingMinutes = Math.ceil((lockedUntil - now) / 60000);
      return res.status(429).json({
        error: `로그인 시도 횟수를 초과했습니다. ${remainingMinutes}분 후 다시 시도해주세요.`,
      });
    }

    if (lockedUntil && lockedUntil <= now) {
      db.prepare(
        'UPDATE users SET failed_login_count = 0, locked_until = NULL WHERE id = ?'
      ).run(user.id);
      user.failed_login_count = 0;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const nextCount = user.failed_login_count + 1;

      if (nextCount >= MAX_FAILED_LOGIN) {
        const unlockAt = new Date(now + LOCKOUT_DURATION_MS).toISOString();
        db.prepare(
          'UPDATE users SET failed_login_count = ?, locked_until = ? WHERE id = ?'
        ).run(nextCount, unlockAt, user.id);

        return res.status(429).json({
          error: '로그인 시도 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.',
        });
      }

      db.prepare(
        'UPDATE users SET failed_login_count = ? WHERE id = ?'
      ).run(nextCount, user.id);
      return res.status(401).json(invalidMsg);
    }

    db.prepare(
      'UPDATE users SET failed_login_count = 0, locked_until = NULL WHERE id = ?'
    ).run(user.id);

    const accessToken = issueToken(res, user);

    return res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

function logout(req, res) {
  if (req.token) {
    blacklistToken(req.token);
  }
  res.clearCookie('token');
  return res.json({ message: '로그아웃되었습니다.' });
}

module.exports = { register, login, logout };