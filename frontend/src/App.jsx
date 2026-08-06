import { RouterProvider } from "./router";
import { useRouter } from "./router-hooks";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import ReviewWrite from "./pages/ReviewWrite";
import Reviews from "./pages/Reviews";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Categories from "./pages/Categories";
import Wishlist from "./pages/Wishlist";
import Home from "./pages/MainHome";
import "./assets/sass/style.scss";

function App() {
  return <RouterProvider><AppRoutes /></RouterProvider>;
}

const AppRoutes = () => {
  const { pathname } = useRouter();
  const isLoggedIn = localStorage.getItem("yb-bly-auth") === "true";

  if (["/wishlist", "/mypage"].includes(pathname) && !isLoggedIn) {
    return <Login redirectTo={pathname} />;
  }

  if (pathname === "/") return <Home />;
  if (pathname === "/login") return <Login />;
  if (pathname === "/signup") return <Signup />;
  if (pathname === "/mypage") return <MyPage />;
  if (pathname === "/categories") return <Categories />;
  if (pathname === "/wishlist") return <Wishlist />;
  if (pathname === "/products") return <ProductList />;
  if (/^\/products\/\d+$/.test(pathname)) return <ProductDetail />;
  if (pathname === "/search") return <Search />;
  if (pathname === "/orders") return <Orders />;
  if (/^\/orders\/\d+$/.test(pathname)) return <OrderDetail />;
  if (pathname === "/reviews") return <Reviews />;
  if (pathname === "/reviews/write") return <ReviewWrite />;

  return (
    <div className="container">
      <main className="empty-state">
        <span>!</span><strong>페이지를 찾을 수 없어요</strong><p><a href="/">홈으로 돌아가기</a></p>
      </main>
    </div>
  );
};

export default App;
