// 초기 테스트 데이터를 넣는 스크립트. npm run seed 로 실행하세요.
const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const userPassword = await bcrypt.hash('user1234', 10);

  db.prepare(
    `INSERT OR IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`
  ).run('admin@ybbly.com', adminPassword, '관리자', 'admin');

  db.prepare(
    `INSERT OR IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`
  ).run('user@ybbly.com', userPassword, '테스트유저', 'user');

  const products = [
    ['플라워 마르디 반팔 티셔츠', 'Mardi Mercredi', 42000, 56000, 25, 'BEST', '상의', '부드러운 촉감과 여유로운 실루엣의 반팔 티셔츠입니다.', '', 50],
    ['클래식 린넨 오버 셔츠', 'YOUTH', 67900, 97000, 30, '무료배송', '상의', '시원한 린넨 소재의 오버핏 셔츠입니다.', '', 30],
    ['핀턱 와이드 데님 팬츠', 'LOEIL', 49200, 61500, 20, '오늘출발', '하의', '핀턱 디테일이 돋보이는 와이드 데님 팬츠입니다.', '', 20],
    ['라이트 썸머 니트 카디건', 'AMOMENTO', 76800, 96000, 20, 'NEW', '상의', '가볍게 걸치기 좋은 여름용 니트 카디건입니다.', '', 15],
    ['시그니처 미니 숄더백', 'SIENNE', 89100, 99000, 10, '한정수량', '가방', '데일리로 매치하기 좋은 미니 숄더백입니다.', '', 10],
    ['메리제인 스니커즈', 'ROCKFISH', 59000, 69000, 14, '무료배송', '신발', '편안한 착화감의 메리제인 스니커즈입니다.', '', 25],
  ];
  const insertProduct = db.prepare(
    `INSERT INTO products (name, brand, price, original_price, discount_percent, badge, category, description, image_url, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const p of products) insertProduct.run(...p);

  db.prepare(
    `INSERT OR IGNORE INTO coupons (code, discount_percent) VALUES (?, ?)`
  ).run('WELCOME10', 10);

  console.log('시드 데이터 생성 완료');
  console.log('관리자 계정: admin@ybbly.com / admin1234');
  console.log('일반 계정: user@ybbly.com / user1234');
  console.log('쿠폰 코드: WELCOME10 (10% 할인)');
}

seed();
