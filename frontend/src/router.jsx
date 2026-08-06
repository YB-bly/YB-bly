import { useEffect, useMemo, useState } from "react";
import RouterContext from "./router-context";
import { useNavigate, useRouter } from "./router-hooks";

export const RouterProvider = ({ children }) => {
  const [location, setLocation] = useState(() => ({
    pathname: window.location.pathname,
    search: window.location.search,
  }));

  useEffect(() => {
    const handlePopState = () => setLocation({
      pathname: window.location.pathname,
      search: window.location.search,
    });

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to, options = {}) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }

    window.history[options.replace ? "replaceState" : "pushState"]({}, "", to);
    setLocation({ pathname: window.location.pathname, search: window.location.search });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const value = useMemo(() => ({ ...location, navigate }), [location]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export const Link = ({ to, onClick, children, ...props }) => {
  const navigate = useNavigate();
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };

  return <a href={to} onClick={handleClick} {...props}>{children}</a>;
};

export const NavLink = ({ to, end = false, className, children, ...props }) => {
  const { pathname } = useRouter();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;
  return <Link to={to} className={resolvedClassName} {...props}>{children}</Link>;
};
