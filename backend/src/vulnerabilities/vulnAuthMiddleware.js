const jwt = require('jsonwebtoken');
require('dotenv').config();

//  취약 포인트 1: .env에 JWT_SECRET을 안 채워도 예측 가능한 기본값으로 동작함
//  (팀이 .env를 제대로 안 채운 채 배포하면 시크릿이 사실상 공개된 값이 됨)
const SECRET = process.env.JWT_SECRET || 'ybbly_default_secret';

function vulnAuthMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    //  취약 포인트 2: 서명은 검증하지만 만료(exp) 클레임은 검사하지 않음
    //  → 탈취되거나 만료된 토큰도 role만 유효하면 계속 재사용 가능
    const decoded = jwt.verify(token, SECRET, { ignoreExpiration: true });
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
}

//  취약 포인트 3: 관리자 페이지 중 "대시보드"는 급하게 추가되면서
//  이 미들웨어에 role 검사가 없음 (아래 vulnAdminRoutes에서 adminOnly 없이 연결됨)
function vulnAdminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '관리자만 접근할 수 있습니다.' });
  }
  next();
}

module.exports = { vulnAuthMiddleware, vulnAdminOnly };
