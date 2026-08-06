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
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentComplete from "./pages/PaymentComplete";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductUpload from "./pages/AdminProductUpload";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminReviews from "./pages/AdminReviews";
import AdminCategories from "./pages/AdminCategories";
import AdminMyPage from "./pages/AdminMyPage";
import MainHome from "./pages/MainHome";
import "./assets/sass/style.scss";

function App() {
  return <RouterProvider><AppRoutes /></RouterProvider>;
}

const AppRoutes = () => {
  const { pathname } = useRouter();
  const isLoggedIn = localStorage.getItem("yb-bly-auth") === "true";
  const isAdmin = localStorage.getItem("yb-bly-role") === "admin";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isProtectedUserRoute = ["/wishlist", "/mypage", "/checkout", "/payment/complete"].includes(pathname) || pathname.startsWith("/orders") || pathname.startsWith("/reviews");

  if (isAdminRoute && (!isLoggedIn || !isAdmin)) {
    return <Login redirectTo={pathname} adminMode />;
  }

  if (isProtectedUserRoute && !isLoggedIn) {
    return <Login redirectTo={pathname} />;
  }

  if (pathname === "/") return <MainHome />;
  if (pathname === "/login") return <Login />;
  if (pathname === "/signup") return <Signup />;
  if (pathname === "/mypage") return <MyPage />;
  if (pathname === "/categories") return <Categories />;
  if (pathname === "/wishlist") return <Wishlist />;
  if (pathname === "/cart") return <Cart />;
  if (pathname === "/checkout") return <Checkout />;
  if (pathname === "/payment/complete") return <PaymentComplete />;
  if (pathname === "/products") return <ProductList />;
  if (/^\/products\/\d+$/.test(pathname)) return <ProductDetail />;
  if (pathname === "/search") return <Search />;
  if (pathname === "/orders") return <Orders />;
  if (/^\/orders\/\d+$/.test(pathname)) return <OrderDetail />;
  if (pathname === "/reviews") return <Reviews />;
  if (pathname === "/reviews/write") return <ReviewWrite />;
  if (pathname === "/admin") return <AdminDashboard />;
  if (pathname === "/admin/products") return <AdminProducts />;
  if (pathname === "/admin/products/upload") return <AdminProductUpload />;
  if (pathname === "/admin/orders") return <AdminOrders />;
  if (pathname === "/admin/users") return <AdminUsers />;
  if (pathname === "/admin/reviews") return <AdminReviews />;
  if (pathname === "/admin/categories") return <AdminCategories />;
  if (pathname === "/admin/mypage") return <AdminMyPage />;

  return (
    <div className="container">
      <main className="empty-state">
        <span>!</span><strong>페이지를 찾을 수 없어요</strong><p><a href="/">홈으로 돌아가기</a></p>
      </main>
    </div>
  );
};

export default App;
