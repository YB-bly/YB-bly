# YB-BLY

YB-BLY는 **쇼핑몰 웹 애플리케이션**입니다.

사용자는 회원가입 및 로그인 후 상품 조회, 검색, 장바구니, 주문, 리뷰, 찜 등의 기능을 사용할 수 있습니다. 

본 프로젝트는 프론트엔드와 백엔드를 분리하여 구현하였으며, 데이터베이스로 SQLite를 사용합니다.

---

## 1. 기술 스택

### Frontend

* React
* Vite
* JavaScript
* Sass

### Backend

* Node.js
* Express
* SQLite
* better-sqlite3

### 기타

* Git / GitHub
* npm

---

## 2. 프로젝트 구조

```text
YB-bly/
├── frontend/                 # React + Vite 프론트엔드
│   ├── src/
│   │   ├── api/             # 백엔드 API 호출
│   │   ├── assets/          # 이미지 및 Sass 파일
│   │   ├── components/      # 공통 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── backend/                  # Node.js + Express 백엔드
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── data/                 # SQLite DB 파일
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 3. 실행 전 준비사항

프로젝트를 실행하기 위해 다음 프로그램이 필요합니다.

* Git
* Node.js
* npm

Node.js 설치 시 npm도 함께 설치됩니다.

설치 여부는 터미널에서 다음 명령어로 확인할 수 있습니다.

```bash
node -v
npm -v
git --version
```

각 명령어 실행 시 버전 정보가 출력되면 정상적으로 설치된 상태입니다.

---

# 4. 프로젝트 다운로드

GitHub Repository를 Clone합니다.

```bash
git clone https://github.com/YB-bly/YB-bly.git
```

Clone한 프로젝트 폴더로 이동합니다.

```bash
cd YB-bly
```

# 5. Backend 설정

먼저 백엔드를 설정합니다.

프로젝트 루트에서 다음 명령어를 실행합니다.

```bash
cd backend
```

## 5-1. Backend 의존성 설치

최초 실행 시 반드시 필요한 Node.js 패키지를 설치합니다.

```bash
npm install
```

`npm install`은 `backend/package.json`에 정의된 의존성 패키지를 자동으로 설치합니다.

설치가 완료되면 `node_modules` 폴더가 생성됩니다.

---

## 5-2. SQLite 초기 데이터 생성

본 프로젝트의 데이터베이스는 **SQLite**를 사용합니다.

최초 실행 전 다음 명령어를 이용하여 테스트에 필요한 초기 데이터를 생성합니다.

```bash
npm run seed
```

Seed 작업을 실행하면 사이트 실행 및 테스트에 필요한 상품 등의 초기 데이터가 SQLite 데이터베이스에 등록됩니다.

> 처음 프로젝트를 Clone하여 실행하는 경우 `npm run seed`를 먼저 실행해 주세요.

---

## 5-3. Backend 서버 실행

초기 데이터 생성이 완료되었다면 다음 명령어로 백엔드 서버를 실행합니다.

```bash
npm run dev
```

정상적으로 실행되면 백엔드 서버는 다음 주소에서 동작합니다.

```text
http://localhost:3000
```

백엔드 서버를 실행한 터미널은 종료하지 않고 그대로 유지합니다.

---

# 6. Frontend 설정

백엔드 서버를 실행한 상태에서 **새로운 터미널을 하나 더 실행**합니다.

프로젝트 루트의 `frontend` 폴더로 이동합니다.

프로젝트 루트에서 실행하는 경우:

```bash
cd frontend
```

현재 `backend` 폴더에 있는 경우:

```bash
cd ../frontend
```

---

## 6-1. Frontend 의존성 설치

최초 실행 시 프론트엔드에서 사용하는 패키지를 설치합니다.

```bash
npm install
```

`frontend/package.json`에 정의된 React, Vite 등의 패키지가 설치됩니다.

---

## 6-2. Frontend 서버 실행

다음 명령어로 개발 서버를 실행합니다.

```bash
npm run dev
```

정상적으로 실행되면 터미널에 접속 가능한 주소가 출력됩니다.

기본 실행 주소는 다음과 같습니다.

```text
http://localhost:5173
```

웹 브라우저에서 위 주소로 접속합니다.

---

# 7. 전체 실행 순서

처음 프로젝트를 Clone한 사용자는 아래 순서대로 실행하면 됩니다.

### ① GitHub Repository Clone

```bash
git clone https://github.com/YB-bly/YB-bly.git
cd YB-bly
```

### ② Backend 의존성 설치

```bash
cd backend
npm install
```

### ③ SQLite 초기 데이터 생성

```bash
npm run seed
```

### ④ Backend 서버 실행

```bash
npm run dev
```

Backend:

```text
http://localhost:3000
```

### ⑤ 새로운 터미널 실행

기존 백엔드 터미널을 종료하지 않고 새로운 터미널을 실행합니다.

### ⑥ Frontend 의존성 설치

```bash
cd YB-bly/frontend
npm install
```

### ⑦ Frontend 서버 실행

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### ⑧ 웹사이트 접속

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:5173
```

---

# 8. 실행 구조

프로젝트를 정상적으로 사용하려면 **Frontend와 Backend 서버를 모두 실행해야 합니다.**

```text
Browser
   │
   ▼
Frontend
React + Vite
http://localhost:5173
   │
   │ API Request
   ▼
Backend
Node.js + Express
http://localhost:3000
   │
   ▼
SQLite Database
```

따라서 터미널 두 개를 사용하여 각각 서버를 실행하는 것을 권장합니다.

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

---

# 9. 주요 기능

## 사용자 기능

* 회원가입
* 로그인 / 로그아웃
* 상품 조회
* 상품 상세 조회
* 상품 검색
* 카테고리 조회
* 찜 목록
* 장바구니
* 주문 및 결제
* 주문 내역 조회
* 리뷰 조회 및 작성
* 마이페이지
  
---

# 10. 데이터베이스

본 프로젝트는 별도의 DB 서버를 설치하지 않고 **SQLite**를 사용합니다.

초기 데이터는 다음 명령어를 통해 생성합니다.

```bash
cd backend
npm run seed
```

데이터베이스 관련 문제가 발생하거나 초기 데이터를 다시 생성해야 하는 경우에는 프로젝트의 seed 설정을 확인한 후 초기화를 진행해 주세요.

> 기존 데이터가 필요한 경우 DB 파일을 임의로 삭제하지 마세요.

---

# 11. 실행 시 주의사항

### Frontend와 Backend를 모두 실행해야 합니다.

Frontend만 실행할 경우 로그인, 상품 조회, 주문 등 API를 사용하는 기능이 정상적으로 동작하지 않을 수 있습니다.

Backend 서버를 먼저 실행한 후 Frontend 서버를 실행하는 것을 권장합니다.

---

### `npm install`은 frontend와 backend에서 각각 실행해야 합니다.

프로젝트는 프론트엔드와 백엔드가 각각 별도의 `package.json`을 가지고 있으므로 최초 실행 시 각각 의존성을 설치해야 합니다.

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

---

### 최초 실행 시 Backend에서 Seed를 실행합니다.

```bash
cd backend
npm run seed
```

Seed를 실행하지 않은 경우 상품 등 초기 데이터가 존재하지 않아 일부 기능을 정상적으로 확인할 수 없을 수 있습니다.

---

### 포트 충돌

기본적으로 다음 포트를 사용합니다.

| 구분       | 주소                      |
| -------- | ----------------------- |
| Frontend | `http://localhost:5173` |
| Backend  | `http://localhost:3000` |

이미 해당 포트를 사용하는 프로그램이 실행 중인 경우 서버 실행 과정에서 포트 충돌이 발생할 수 있습니다.

이 경우 기존에 해당 포트를 사용하고 있는 프로그램을 종료한 후 다시 실행해 주세요.

---

# 12. 문제 해결

## `npm` 명령어를 찾을 수 없는 경우

```text
npm: command not found
```

또는 Windows에서 npm을 실행할 수 없다는 메시지가 나타난다면 Node.js가 설치되어 있는지 확인합니다.

```bash
node -v
npm -v
```

Node.js가 설치되어 있지 않다면 Node.js 설치 후 다시 실행합니다.

---

## `node_modules` 관련 오류가 발생하는 경우

해당 폴더에서 다시 의존성을 설치합니다.

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

---

## 데이터가 표시되지 않는 경우

Backend에서 초기 데이터가 생성되었는지 확인합니다.

```bash
cd backend
npm run seed
```

이후 Backend 서버를 다시 실행합니다.

```bash
npm run dev
```

---

## API 요청에 실패하는 경우

다음 사항을 확인합니다.

1. Backend 서버가 실행 중인지 확인합니다.
2. Backend가 `http://localhost:3000`에서 실행되고 있는지 확인합니다.
3. Frontend 서버가 실행 중인지 확인합니다.
4. 브라우저 개발자 도구의 Console 및 Network 탭에서 오류를 확인합니다.

---

# 13. 종료 방법

Frontend 또는 Backend 서버가 실행 중인 터미널에서 다음 키를 누르면 서버가 종료됩니다.

```text
Ctrl + C
```

Frontend와 Backend를 각각 실행했으므로 두 터미널 모두 종료해야 합니다.

---

# 14. 빠른 실행 요약

처음 Clone한 경우 아래 순서대로 실행합니다.

### Backend

```bash
git clone https://github.com/YB-bly/YB-bly.git
cd YB-bly/backend
npm install
npm run seed
npm run dev
```

Backend 서버:

```text
http://localhost:3000
```

그다음 새로운 터미널을 열어 Frontend를 실행합니다.

### Frontend

```bash
cd YB-bly/frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:5173
```

---

# 14. .env 파일 설정

### backend
- backend 는 .env.example 파일이 있습니다.

### frontend
- frontend는 두 파일을 만들어 실행해주시면 됩니다.

    1. .env
     ```bash
     VITE_API_BASE_URL=http://localhost:3000/api
     ```
  2. .env.burp
     ```bash
     VITE_API_BASE_URL=http://127.0.0.1:3000/api
     ```
     
- burp suite를 켜기 위한 프론트엔드 서버 켜는 명령어는 npm run dev -- --mode burp --host 0.0.0.0 입니다.
- 해당 서버주소: http://127.0.0.1:5173

     
