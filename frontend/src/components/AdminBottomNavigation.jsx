import { NavLink } from "../router";

const items = [{ to: "/admin", icon: "⌂", label: "홈" }, { to: "/admin/categories", icon: "▦", label: "카테고리" }, { to: "/admin/products/upload", icon: "+", label: "상품 업로드" }, { to: "/admin/mypage", icon: "♙", label: "마이페이지" }];

const AdminBottomNavigation = () => <nav className="admin-bottom-navigation" aria-label="관리자 주요 메뉴">{items.map((item) => <NavLink to={item.to} end={item.to === "/admin"} key={item.to} className={({ isActive }) => `admin-bottom-navigation__item${isActive ? " is-active" : ""}`}><b>{item.icon}</b><span>{item.label}</span></NavLink>)}</nav>;

export default AdminBottomNavigation;
