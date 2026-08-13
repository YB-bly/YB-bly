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
    ['(최단일) 미엘 클라라 블라우스 원피스', '융보와요', 44650, 55813, 20, '빠른출고', '원피스/세트', '부드러운 촉감과 여유로운 실루엣의 원피스입니다.', '', 34],
    ['[여름바지/3기장선택] 와이드 밴딩 팬츠', '융로우먼트', 26520, 54122, 51, '오늘출발', '팬츠/스커트', '편안한 밴딩 처리의 와이드 팬츠입니다.', '', 12],
    ['여름 찰랑 와우 감탄사 절로나와 셔츠', '융프라와우', 49900, 77969, 36, '빠른배송', '상의', '시원한 소재의 여름 셔츠입니다.', '', 0],
    ['여름 시스루 루즈핏 체크 셔츠', '융어데이', 32800, 40000, 18, '단독상품', '아우터', '루즈핏 실루엣의 체크 셔츠입니다.', '', 8],
    ['하늘하늘 날아갈지도 몰라 블라우스', '융티랩', 39900, 57000, 30, '하루특가', '상의', '가볍게 걸치기 좋은 블라우스입니다.', '', 21],
    ['시원한 여름 청바지 이거야 이거', '융랙무드', 29900, 39867, 25, '빠른출고', '팬츠/스커트', '시원한 여름용 청바지입니다.', '', 5],
  ];
  const insertProduct = db.prepare(
    `INSERT INTO products (name, brand, price, original_price, discount_percent, badge, category, description, image_url, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const p of products) insertProduct.run(...p);

  db.prepare(
    `INSERT OR IGNORE INTO coupons (code, label, discount_percent, min_order_amount, expires_at) VALUES (?, ?, ?, ?, ?)`
  ).run('WELCOME10', '첫 구매 10% 할인', 10, 0, '2026.12.31');

  db.prepare(
    `INSERT OR IGNORE INTO coupons (code, label, discount_percent, min_order_amount, expires_at) VALUES (?, ?, ?, ?, ?)`
  ).run('ONCE20', '1회 한정 20% 할인', 20, 100000, '2026.09.30');

  db.prepare(
    `INSERT OR IGNORE INTO coupons (code, label, discount_percent, min_order_amount, expires_at) VALUES (?, ?, ?, ?, ?)`
  ).run('SUMMER15', '여름 상품 15% 할인', 15, 0, '2026.08.31');

  console.log('시드 데이터 생성 완료');
  console.log('관리자 계정: admin@ybbly.com / admin1234');
  console.log('일반 계정: user@ybbly.com / user1234');
  console.log('쿠폰 코드: WELCOME10 / ONCE20(10만원 이상) / SUMMER15');
}

seed();
