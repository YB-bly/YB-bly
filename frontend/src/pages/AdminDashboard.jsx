import { Link } from "../router";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { formatPrice } from "../data/products";
import { adminOrders } from "../data/adminData";
import { getMockOrders } from "../data/shopStorage";

const AdminDashboard = () => {
  const orders = [...getMockOrders(), ...adminOrders];
  const sales = orders.reduce((sum, order) => sum + (order.total ?? order.amount ?? order.product.price), 0);
  return <div className="admin-dashboard-page admin-page"><div className="container"><AdminHeader title="대시보드" /><main className="admin-dashboard"><section className="admin-dashboard__welcome"><p>2026년 8월 6일</p><h2>안녕하세요, 관리자님</h2><span>오늘의 쇼핑몰 현황을 확인하세요.</span></section><section className="admin-dashboard__stats">{[{ label: "오늘 주문", value: `${orders.length}건`, tone: "mint" }, { label: "오늘 매출", value: formatPrice(sales), tone: "yellow" }, { label: "배송 준비", value: "3건", tone: "blue" }, { label: "신규 회원", value: "7명", tone: "pink" }].map((stat) => <div className={`is-${stat.tone}`} key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</section><section className="admin-panel"><div className="admin-panel__title"><h2>빠른 관리</h2></div><div className="admin-dashboard__quick"><Link to="/admin/products">상품 관리<span>›</span></Link><Link to="/admin/orders">주문 관리<span>›</span></Link><Link to="/admin/users">회원 관리<span>›</span></Link><Link to="/admin/reviews">리뷰 관리<span>›</span></Link></div></section><section className="admin-panel"><div className="admin-panel__title"><h2>최근 주문</h2><Link to="/admin/orders">전체 보기</Link></div>{orders.slice(0, 3).map((order) => <div className="admin-dashboard__order" key={order.id}><div><strong>{order.number}</strong><span>{order.customer ?? order.recipient}</span></div><div><b>{formatPrice(order.total ?? order.amount ?? order.product.price)}</b><em>{order.status}</em></div></div>)}</section></main><AdminBottomNavigation /></div></div>;
};

export default AdminDashboard;
