import { NavLink } from "../router";

const navigation = [
  { to: "/", icon: "home", label: "홈" },
  { to: "/categories", icon: "category", label: "카테고리" },
  { to: "/wishlist", icon: "heart", label: "찜" },
  { to: "/mypage", icon: "user", label: "마이페이지" },
];

const NavigationIcon = ({ name }) => {
  if (name === "home") return <svg viewBox="0 0 24 24"><path d="M3.5 10.5 12 3l8.5 7.5v9.2a1.3 1.3 0 0 1-1.3 1.3H4.8a1.3 1.3 0 0 1-1.3-1.3z"/><path d="M9 21v-7h6v7"/></svg>;
  if (name === "category") return <svg viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h16"/></svg>;
  if (name === "heart") return <svg viewBox="0 0 24 24"><path d="M20.8 5.8c-2.1-2.2-5.6-1.8-7.4.6L12 8.2l-1.4-1.8c-1.8-2.4-5.3-2.8-7.4-.6-2 2.1-1.8 5.5.3 7.5L12 21l8.5-7.7c2.1-2 2.3-5.4.3-7.5z"/></svg>;
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3.2"/><path d="M5.5 21v-2.4A5.6 5.6 0 0 1 11.1 13h1.8a5.6 5.6 0 0 1 5.6 5.6V21z"/></svg>;
};

const BottomNavigation = () => (
  <nav className="bottom-navigation" aria-label="주요 메뉴">
    {navigation.map((item) => (
      <NavLink
        className={({ isActive }) =>
          `bottom-navigation__item${isActive ? " bottom-navigation__item--active" : ""}`
        }
        key={item.to}
        to={item.to}
        end={item.to === "/"}
      >
        <span className="bottom-navigation__icon" aria-hidden="true">
          <NavigationIcon name={item.icon} />
        </span>
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
);

export default BottomNavigation;
