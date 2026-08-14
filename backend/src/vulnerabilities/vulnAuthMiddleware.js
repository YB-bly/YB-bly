const jwt = require('jsonwebtoken');
const { getRequestToken } = require('../middleware/authMiddleware');

// 교육용 취약점: 이 미들웨어는 관리자 주문 통계 API 한 곳에서만 사용한다.
// JWT payload를 해석할 뿐, 서버 비밀키로 생성된 서명인지 확인하지 않는다.
function unsignedAdminStatisticsOnly(req, res, next) {
  const token = getRequestToken(req);

  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    // 🚩 jwt.decode()는 서명, 알고리즘, issuer, audience를 검증하지 않는다.
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded !== 'object') {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }

    if (typeof decoded.exp !== 'number' || decoded.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: '만료된 토큰입니다.' });
    }

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: '관리자만 접근할 수 있습니다.' });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
}

module.exports = { unsignedAdminStatisticsOnly };
