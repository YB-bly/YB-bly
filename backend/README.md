# 쇼핑몰 백엔드 (Node.js + Express + SQLite)

## 폴더 구조
```
backend/
├── src/
│   ├── config/
│   │   ├── db.js         # SQLite 연결 (최초 실행 시 자동으로 파일/테이블 생성)
│   │   ├── schema.sql    # 테이블 정의
│   │   └── seed.js       # 테스트용 초기 데이터 (관리자/일반 계정, 상품, 쿠폰)
│   ├── controllers/       # 정상(보안 적용) 버전 로직
│   ├── middleware/authMiddleware.js
│   ├── routes/
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## 실행 방법

1. 의존성 설치
```bash
npm install
```

2. `.env` 생성
```bash
cp .env.example .env
```
`JWT_SECRET`은 아무 긴 랜덤 문자열로 채워 주세요.

3. 테스트 데이터 넣기 (최초 1회, DB 파일은 자동 생성됨)
```bash
npm run seed
```
- 관리자: `admin@ybbly.com` / `admin1234`
- 일반 사용자: `user@ybbly.com` / `user1234`
- 쿠폰 코드: `WELCOME10` (10% 할인)

4. 서버 실행
```bash
npm run dev
```
`http://localhost:3000` 접속해서 메시지가 뜨면 성공.

## API 목록 (정상 버전 기준)

| 기능 | Method | 경로 | 인증 |
|---|---|---|---|
| 회원가입 | POST | /api/auth/register | - |
| 로그인 | POST | /api/auth/login | - |
| 로그아웃 | POST | /api/auth/logout | 로그인 |
| 상품 목록 (?category=상의 등 필터 가능) | GET | /api/products | - |
| 상품 검색 (이름/브랜드) | GET | /api/products/search?q= | - |
| 상품 상세 (평점/리뷰수 자동 계산 포함) | GET | /api/products/:id | - |
| 상품 등록/수정/삭제 | POST/PUT/DELETE | /api/products(/:id) | 관리자 |
| 재고 수정 | PATCH | /api/products/:id/stock | 관리자 |
| 장바구니 조회/담기(옵션 포함)/수정/삭제 | GET/POST/PATCH/DELETE | /api/cart(/:id) | 로그인 |
| 찜 목록 조회/추가/삭제 | GET/POST/DELETE | /api/wishlist(/:productId) | 로그인 |
| 주문 생성(배송지 입력, 모의결제 포함) | POST | /api/orders | 로그인 |
| 내 주문 목록 (상품 정보 포함) | GET | /api/orders | 로그인 |
| 주문 상세 | GET | /api/orders/:id | 로그인(본인) |
| 리뷰 목록 | GET | /api/reviews/product/:productId | - |
| 리뷰 작성 | POST | /api/reviews | 로그인(구매자) |
| 리뷰 삭제 | DELETE | /api/reviews/:id | 본인/관리자 |
| 내 정보 조회/수정 | GET/PATCH | /api/users/me | 로그인 |
| 전체 주문 목록 | GET | /api/admin/orders | 관리자 |
| 주문 상태 변경 (pending/paid/preparing/shipping/delivered/cancelled) | PATCH | /api/admin/orders/:id/status | 관리자 |
| 회원 목록 | GET | /api/admin/users | 관리자 |
| 대시보드 요약 | GET | /api/admin/dashboard | 관리자 |

## 상품(product) 응답 필드
```json
{
  "id": 1, "name": "...", "brand": "...", "price": 42000,
  "original_price": 56000, "discount_percent": 25, "badge": "BEST",
  "category": "상의", "description": "...", "image_url": "...", "stock": 48,
  "rating": 4.8, "reviewCount": 12
}
```
`rating`/`reviewCount`는 저장된 값이 아니라 `reviews` 테이블에서 매번 실시간 계산해서 내려줍니다 (리뷰가 늘어나도 데이터가 어긋나지 않음).

## 주문 생성 요청 예시
```json
POST /api/orders
{
  "couponCode": "WELCOME10",
  "idempotencyKey": "임의의 고유 문자열 (더블클릭 방지용, 프론트에서 uuid로 생성)",
  "recipientName": "홍길동",
  "recipientPhone": "010-0000-0000",
  "address": "서울특별시 ..."
}
```
장바구니에 담긴 항목(옵션 포함)을 기준으로 서버가 가격/재고를 다시 계산해서 처리하고, 사람이 읽는 주문번호(`orderNumber`, 예: `20260806-00001`)를 같이 발급합니다.

## 장바구니 담기 요청 예시
```json
POST /api/cart
{ "productId": 1, "quantity": 2, "optionLabel": "화이트 / M" }
```
`optionLabel`은 프론트에서 선택한 사이즈/색상 등을 그대로 문자열로 보내면 됩니다 (같은 상품이라도 옵션이 다르면 별도 장바구니 항목으로 취급).

## 인증 방식
Authorization 헤더가 아니라 **httpOnly 쿠키**로 JWT를 주고받습니다. 프론트에서 API 호출 시 `credentials: 'include'` (fetch) 또는 `withCredentials: true` (axios)를 꼭 설정해야 쿠키가 같이 전송됩니다.

## Git에 올리기
```bash
git add backend
git commit -m "feat: 백엔드 SQLite 전환 및 전체 API 구현"
git push origin dev
```
`.env`는 `.gitignore`에 포함되어 있어 자동으로 제외됩니다. `data/*.db`(실제 DB 파일)도 제외되니, 각자 로컬에서 `npm run seed`로 만들어야 합니다.