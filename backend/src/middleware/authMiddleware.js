const jwt = require('jsonwebtoken');
require('dotenv').config();

// 로그아웃된 토큰을 잠깐 기억해두는 목록 (SR-06: 로그아웃 시 세션 무효화)
// 주의: 서버 재시작하면 초기화됩니다. 실제 서비스라면 Redis 등에 저장해야 하지만,
// 이 프로젝트 규모에서는 메모리 방식으로 충분히 개념을 보여줄 수 있습니다.
const blacklistedTokens = new Set();

function blacklistToken(token) {
  blacklistedTokens.add(token);
}

function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: '로그아웃된 세션입니다. 다시 로그인해주세요.' });
  }

  try {
    // 서명 + 만료시간(exp)까지 모두 검증 (정상 버전)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않거나 만료된 토큰입니다.' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '관리자만 접근할 수 있습니다.' });
  }
  next();
}

module.exports = { authMiddleware, adminOnly, blacklistToken };