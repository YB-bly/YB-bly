import { Link } from "../router";
import { useNavigate } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const MyPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("yb-bly-auth");
    localStorage.removeItem("yb-bly-role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="mypage-page">
      <div className="container">
        <AppHeader title="마이페이지" />
        <main className="mypage">
        <section className="mypage__profile">
          <div className="mypage__avatar">Y</div>
          <div><p>안녕하세요,</p><h1>테스트 사용자 님</h1><span>Silver Member</span></div>
        </section>

        <section className="mypage__wallet">
          <div><span>쿠폰</span><strong>3장</strong></div>
          <div><span>포인트</span><strong>2,400P</strong></div>
          <div><span>찜</span><strong>12개</strong></div>
        </section>

        <section className="mypage__orders">
          <div className="section-heading"><h2>나의 주문</h2><Link to="/orders">전체 보기 ›</Link></div>
          <div className="mypage__order-steps">
            {[{ value: 1, label: "결제완료" }, { value: 0, label: "배송준비" }, { value: 2, label: "배송중" }, { value: 4, label: "배송완료" }].map((step) => <div key={step.label}><strong>{step.value}</strong><span>{step.label}</span></div>)}
          </div>
        </section>

        <section className="mypage__menu">
          <h2>쇼핑 활동</h2>
          <Link to="/orders"><span>▣</span>주문 내역<strong>›</strong></Link>
          <Link to="/reviews"><span>☆</span>나의 리뷰<strong>›</strong></Link>
          <Link to="/wishlist"><span>♡</span>찜한 상품<strong>›</strong></Link>
          <Link to="/recent"><span>◎</span>최근 본 상품<strong>›</strong></Link>
        </section>
        <section className="mypage__menu">
          <h2>고객 지원</h2>
          <Link to="/inquiries"><span>?</span>문의 내역<strong>›</strong></Link>
          <Link to="/notices"><span>ⓘ</span>공지사항<strong>›</strong></Link>
        </section>
        <button className="mypage__logout" type="button" onClick={logout}>로그아웃</button>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default MyPage;
