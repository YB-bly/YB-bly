const jwt = require('jsonwebtoken');
require('dotenv').config();

// 로그인이 필요한 API에 붙이는 미들웨어
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>" 형식

  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    // 서명까지 검증하는 verify 사용 (decode만 쓰면 위조 토큰도 통과됨)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } 등
    next();
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
}

// 관리자만 접근 가능한 API에 authMiddleware 다음으로 붙이는 미들웨어
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '관리자만 접근할 수 있습니다.' });
  }
  next();
}

module.exports = { authMiddleware, adminOnly };
