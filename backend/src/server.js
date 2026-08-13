const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

require('./config/db'); // 최초 실행 시 SQLite 파일 + 테이블 자동 생성

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // 프론트(Vite) 주소, 쿠키 인증이라 credentials 필요
app.use(express.json());
app.use(cookieParser());

const VULN_MODE = process.env.VULN_MODE === 'true';

if (VULN_MODE) {
  console.log('⚠️  VULN_MODE=true : 의도한 취약점이 포함된 버전으로 실행됩니다. (모의해킹 배포용)');
  app.use('/api', require('./vulnerabilities/vulnRoutes'));
} else {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/products', require('./routes/productRoutes'));
  app.use('/api/cart', require('./routes/cartRoutes'));
  app.use('/api/orders', require('./routes/orderRoutes'));
  app.use('/api/reviews', require('./routes/reviewRoutes'));
  app.use('/api/coupons', require('./routes/couponRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/wishlist', require('./routes/wishlistRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
}

app.get('/', (req, res) => {
  res.json({ message: '쇼핑몰 백엔드 서버가 정상 동작 중입니다.', vulnMode: VULN_MODE });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다. (VULN_MODE=${VULN_MODE})`);
});