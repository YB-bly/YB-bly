import { Link } from "../router";
import { useNavigate } from "../router-hooks";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";

const AdminMyPage = () => {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("yb-bly-auth"); localStorage.removeItem("yb-bly-role"); navigate("/login", { replace: true }); };
  return <div className="admin-mypage-page admin-page"><div className="container"><AdminHeader title="관리자 정보" back /><main className="admin-mypage"><section className="admin-mypage__profile"><div>A</div><h2>YB-bly 관리자</h2><p>admin@yb-bly.com</p><span>Super Admin</span></section><section className="admin-mypage__menu"><Link to="/admin/products">상품 관리 <span>›</span></Link><Link to="/admin/orders">주문 관리 <span>›</span></Link><Link to="/admin/users">회원 관리 <span>›</span></Link><Link to="/admin/reviews">리뷰 관리 <span>›</span></Link><Link to="/admin/security">보안 설정 <span>›</span></Link></section><button className="admin-mypage__logout" type="button" onClick={logout}>로그아웃</button></main><AdminBottomNavigation /></div></div>;
};

export default AdminMyPage;
