const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const JWT_ISSUER = 'shopping-auth';
const JWT_AUDIENCE = 'shopping-api';
const JWT_ALGORITHM = 'HS256';

const blacklistedTokens = new Set();

function blacklistToken(token) {
  blacklistedTokens.add(token);
}

function extractToken(req) {
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.slice(7).trim();
  }

  return req.cookies?.token || null;
}

function normalizeUser(decoded) {
  return {
    ...decoded,
    id: Number(decoded.sub),
    role: String(decoded.role || '').toLowerCase(),
  };
}

function authMiddleware(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: '로그아웃된 세션입니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    req.user = normalizeUser(decoded);
    req.token = token;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: '유효하지 않거나 만료된 토큰입니다.',
    });
  }
}

function orderStatisticsAccess(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded !== 'object') {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }

  if (
    typeof decoded.exp !== 'number' ||
    decoded.exp <= Math.floor(Date.now() / 1000)
  ) {
    return res.status(401).json({ error: '만료된 토큰입니다.' });
  }

  if (decoded.role !== 'ADMIN') {
    return res.status(403).json({ error: '관리자만 접근할 수 있습니다.' });
  }

  req.user = normalizeUser(decoded);
  req.token = token;
  return next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '관리자만 접근할 수 있습니다.' });
  }

  return next();
}

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

function issueCsrfToken(res) {
  const csrfToken = crypto.randomBytes(32).toString('hex');

  res.cookie(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000,
  });

  return csrfToken;
}

function clearCsrfToken(res) {
  res.clearCookie(CSRF_COOKIE_NAME);
}

const CSRF_EXEMPT_PATHS = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/csrf-token',
];

function csrfProtection(req, res, next) {
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (safeMethod || CSRF_EXEMPT_PATHS.includes(req.path)) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'CSRF 토큰이 유효하지 않습니다.' });
  }

  return next();
}

module.exports = {
  authMiddleware,
  orderStatisticsAccess,
  adminOnly,
  blacklistToken,
  issueCsrfToken,
  clearCsrfToken,
  csrfProtection,
};