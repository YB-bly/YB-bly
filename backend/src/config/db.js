const mysql = require('mysql2/promise');
require('dotenv').config();

// 커넥션 풀: 요청마다 새로 연결하지 않고 미리 만들어둔 연결을 재사용
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
