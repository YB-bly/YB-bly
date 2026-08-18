const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

require('./config/db');

const app = express();

/*
 * 프론트 개발 서버 허용
 *
 * 일반 브라우저:
 * http://localhost:5173
 *
 * Burp Suite 내장 브라우저:
 * http://127.0.0.1:5173
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin(origin, callback) {
      // Postman, curl 등 Origin 헤더가 없는 요청도 허용
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS 정책에 의해 허용되지 않은 Origin입니다: ${origin}`)
      );
    },
    credentials: true,
  })
);

app.use(
  express.json({
    limit: '2mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '2mb',
  })
);

app.use(cookieParser());

const VULN_MODE =
  process.env.VULN_MODE === 'true';

if (VULN_MODE) {
  console.log(
    '⚠️ VULN_MODE=true : vulnRoutes를 사용하여 실행합니다.'
  );

  app.use(
    '/api',
    require('./vulnerabilities/vulnRoutes')
  );
} else {
  app.use(
    '/api/auth',
    require('./routes/authRoutes')
  );

  app.use(
    '/api/products',
    require('./routes/productRoutes')
  );

  app.use(
    '/api/cart',
    require('./routes/cartRoutes')
  );

  app.use(
    '/api/cart/coupons',
    require('./routes/cartCouponRoutes')
  );

  app.use(
    '/api/orders',
    require('./routes/orderRoutes')
  );

  app.use(
    '/api/reviews',
    require('./routes/reviewRoutes')
  );

  app.use(
    '/api/coupons',
    require('./routes/couponRoutes')
  );

  app.use(
    '/api/users',
    require('./routes/userRoutes')
  );

  app.use(
    '/api/wishlist',
    require('./routes/wishlistRoutes')
  );

  app.use(
    '/api/admin',
    require('./routes/adminRoutes')
  );
}

app.get('/', (req, res) => {
  res.json({
    message:
      '쇼핑몰 백엔드 서버가 정상 동작 중입니다.',
    vulnMode: VULN_MODE,
  });
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `서버가 http://localhost:${PORT} 에서 실행 중입니다. (VULN_MODE=${VULN_MODE})`
  );
});