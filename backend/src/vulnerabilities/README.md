# 의도한 취약점 (VULN_MODE=true일 때 활성화)

`.env`의 `VULN_MODE`를 `true`로 바꾸고 서버를 실행하면, 아래 4가지가 정상 버전 대신 적용됩니다.
`server.js`가 이 값을 읽어서 `routes/*` (정상) 대신 `vulnerabilities/vulnRoutes.js` (취약)를 마운트합니다.

## 1 IDOR — 주문 상세 조회
- **파일**: `vulnOrderController.js`의 `vulnOrderDetail`
- **결함**: 로그인 여부만 확인하고, 조회하는 주문이 본인 것인지 검증하지 않음
- **발견 경로**: `vulnReviewController.js`의 `vulnListByProduct`가 리뷰 응답에 `orderId`를 그대로 노출함
  → 공격자가 상품 리뷰를 훑어보며 다른 사용자의 주문 번호를 먼저 알아내야 함 (단순 순차 증가 추측이 아님)
- **관련 OWASP**: A01 - Broken Access Control

## 2 JWT 인증 우회
- **파일**: `vulnAuthMiddleware.js`
- **결함**:
  - 신규 관리자 주문 통계 API(`/api/admin/order-statistics`)만 `jwt.decode()`로 payload를 해석함
  - `exp`와 `role === 'ADMIN'`은 확인하지만 **서명, 허용 알고리즘, `iss`, `aud`를 검증하지 않음**
  - 일반 사용자가 자신의 JWT payload에서 `role`을 `USER`에서 `ADMIN`으로 바꾼 토큰을 사용할 수 있음
  - `/api/admin/orders` 등 기존 관리자 API는 정상 `authMiddleware`를 사용하므로 같은 변조 토큰을 거부함
- **발견 경로**: `/login` 로그인 → `/mypage`의 Local Storage/Network에서 토큰 확인 → 관리자 프런트엔드 코드에서 통계 API 확인
- **관련 OWASP**: A07 - Identification and Authentication Failures

## 3 SQL Injection — 상품 검색
- **파일**: `vulnProductController.js`의 `vulnSearch`
- **결함**: 블랙리스트로 위험 문자(`'`, `OR`, `--`)를 걸러내는 로직은 있지만, **필터링된 결과를 실제 쿼리에 반영하지 않고 원본 입력을 그대로 사용**함 (필터를 만들어놓고 실제로는 안 쓰는, 코드 리뷰 없이 급하게 짤 때 실제로 자주 나오는 실수)
- **결과**: 작은따옴표를 포함한 일반적인 SQLi 페이로드가 그대로 통과됨 (예: UNION 기반으로 다른 테이블 조회 가능)
- **관련 OWASP**: A03 - Injection

## 4 비즈니스 로직 취약점 — 쿠폰 중복(복리) 적용
- **파일**: `vulnOrderController.js`의 `vulnCreateOrder`
- **결함**: 쿠폰 할인이 "주문 총액"에 한 번만 적용되는 게 아니라, `items` 배열을 순회하며 **누적 총액에 매번 다시 적용**됨 (할인이 겹쳐서 복리처럼 계산됨)
- **공격 조건**: 같은 상품을 여러 줄로 쪼개서 `items` 배열에 담아 주문 요청 + 쿠폰 코드 함께 사용 → 줄을 많이 쪼갤수록 최종 금액이 더 크게 낮아짐
- **관련 OWASP**: A04 - Insecure Design

---

## 정상 버전과의 관계
- 정상 버전(`src/routes/`, `src/controllers/`, `src/middleware/authMiddleware.js`)은 절대 수정하지 않습니다.
- 취약점은 전부 `src/vulnerabilities/` 폴더 안에만 존재하고, `VULN_MODE` 스위치로만 켜집니다.
- RFP/보고서 작성 시 이 문서를 그대로 활용하면 됩니다.
