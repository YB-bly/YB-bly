const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'local-test-secret-for-jwt-statistics';
process.env.DB_FILE = ':memory:';

const { authMiddleware } = require('../src/middleware/authMiddleware');
const { unsignedAdminStatisticsOnly } = require('../src/vulnerabilities/vulnAuthMiddleware');
const { orderStatistics } = require('../src/controllers/adminController');

function requestWithBearer(token) {
  return {
    cookies: {},
    query: {},
    get(name) {
      return name.toLowerCase() === 'authorization' ? `Bearer ${token}` : undefined;
    },
  };
}

function responseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function forgeAdminRole(token) {
  const [header, payload, signature] = token.split('.');
  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  claims.role = 'ADMIN';
  const forgedPayload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return `${header}.${forgedPayload}.${signature}`;
}

test('변조 토큰은 통계 API만 통과하고 정상 인증에서는 거부된다', () => {
  const userToken = jwt.sign(
    { sub: '27', id: 27, email: 'user27@example.com', role: 'USER' },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '30m',
      issuer: 'shopping-auth',
      audience: 'shopping-api',
    }
  );
  const forgedToken = forgeAdminRole(userToken);

  let vulnerableNextCalled = false;
  unsignedAdminStatisticsOnly(
    requestWithBearer(forgedToken),
    responseRecorder(),
    () => { vulnerableNextCalled = true; }
  );
  assert.equal(vulnerableNextCalled, true);

  let secureNextCalled = false;
  const secureResponse = responseRecorder();
  authMiddleware(
    requestWithBearer(forgedToken),
    secureResponse,
    () => { secureNextCalled = true; }
  );
  assert.equal(secureNextCalled, false);
  assert.equal(secureResponse.statusCode, 401);
});

test('주문 통계 응답은 집계와 제한된 최근 주문 구조를 반환한다', () => {
  const response = responseRecorder();
  orderStatistics({ query: {} }, response);

  assert.equal(response.statusCode, 200);
  assert.ok(response.body.summary);
  assert.ok(Array.isArray(response.body.dailySales));
  assert.ok(Array.isArray(response.body.popularProducts));
  assert.ok(Array.isArray(response.body.recentOrders));
});
