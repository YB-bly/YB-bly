# YB-bly 백엔드

Node.js + Express + MySQL 기반 백엔드 기본 세팅입니다.

## 폴더 구조
```
backend/
├── src/
│   ├── config/
│   │   ├── db.js         # MySQL 커넥션 풀
│   │   └── schema.sql    # 초기 테이블 생성 SQL
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   └── server.js         # 서버 진입점
├── .env.example
├── .gitignore
└── package.json
```

## 로컬 실행 방법

1. 의존성 설치
```bash
npm install
```

2. `.env` 파일 생성 (`.env.example`을 복사해서 실제 값 채우기)
```bash
cp .env.example .env
```

3. MySQL에 DB/테이블 생성
```bash
mysql -u root -p < src/config/schema.sql
```

4. 서버 실행
```bash
npm run dev
```

5. 정상 동작 확인: 브라우저에서 `http://localhost:3000` 접속 시 메시지가 뜨면 성공

## API 테스트 (Postman/Thunder Client 등)
- `POST /api/auth/register` - body: `{ "email": "test@test.com", "password": "1234", "name": "홍길동" }`
- `POST /api/auth/login` - body: `{ "email": "test@test.com", "password": "1234" }` → 응답으로 `token` 받음
- `GET /api/users/me` - header: `Authorization: Bearer <위에서 받은 token>`


⚠️ `.env` 파일은 `.gitignore`에 포함되어 있어 자동으로 제외됩니다. 실수로도 올리지 않도록 커밋 전에 `git status`로 한 번 확인하는 걸 추천합니다.
