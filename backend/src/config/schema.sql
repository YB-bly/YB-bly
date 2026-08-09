-- SQLite 스키마. 서버 최초 실행 시 db.js가 자동으로 이 내용을 적용합니다.

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,          -- bcrypt 해시값 (평문 저장 금지, SR-01/SR-18)
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  failed_login_count INTEGER NOT NULL DEFAULT 0,  -- SR-02 로그인 실패 횟수 제한용
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL,
  original_price INTEGER,             -- 할인 전 가격 (없으면 price와 동일하게 취급)
  discount_percent INTEGER NOT NULL DEFAULT 0,
  badge TEXT,                         -- 'BEST', 'NEW', '무료배송' 등 상품 카드에 표시되는 뱃지
  category TEXT NOT NULL DEFAULT '',  -- 상의/하의/원피스/가방/신발 등
  description TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  option_label TEXT NOT NULL DEFAULT '',  -- 선택한 옵션 스냅샷 (예: "화이트 / M")
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, product_id, option_label),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS coupon_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  coupon_id INTEGER NOT NULL,
  order_id INTEGER,
  UNIQUE(user_id, coupon_id),   -- 정상 로직에서는 1인당 1회만 사용 가능하도록 강제
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE,           -- 화면에 보여줄 사람이 읽는 주문번호 (예: 20260806-00001)
  user_id INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'preparing', 'shipping', 'delivered', 'cancelled')),
  coupon_id INTEGER,
  recipient_name TEXT,
  recipient_phone TEXT,
  address TEXT,
  idempotency_key TEXT UNIQUE,   -- SR-10: 같은 주문이 중복 생성되는 것을 방지 (더블클릭 등)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  option_label TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL,
  price_at_order INTEGER NOT NULL,   -- 주문 시점 가격 (상품 가격이 나중에 바뀌어도 주문 내역은 유지)
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  order_id INTEGER,             -- "구매 인증" 리뷰용 (실제 주문에서만 리뷰 작성 가능)
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS wishlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  UNIQUE(user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);