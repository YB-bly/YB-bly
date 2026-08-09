const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || './data/shop.db';

// data 폴더가 없으면 자동 생성
const dataDir = path.dirname(dbFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbFile);
db.pragma('journal_mode = WAL'); // 동시 읽기/쓰기 안정성 향상
db.pragma('foreign_keys = ON');

// 서버 시작 시 schema.sql을 항상 적용 (CREATE TABLE IF NOT EXISTS라 여러 번 실행돼도 안전)
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

module.exports = db;