const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 라우트 연결
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 헬스체크용 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '쇼핑몰 백엔드 서버가 정상 동작 중입니다.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
