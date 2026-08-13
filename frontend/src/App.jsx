import {
  useEffect,
  useState,
} from "react";

import {
  RouterProvider,
} from "./router";

import {
  useRouter,
} from "./router-hooks";

import {
  getMyProfile,
} from "./api/userApi";

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
import AdminSecurity from "./pages/AdminSecurity";
import AdminOrderDetail from "./pages/AdminOrderDetail";

import MainHome from "./pages/MainHome";
import RecentProducts from "./pages/RecentProducts";
import Inquiries from "./pages/Inquiries";
import Notices from "./pages/Notices";
import BrandHome from "./pages/BrandHome";

import "./assets/sass/style.scss";

function App() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}

const AppRoutes = () => {
  const {
    pathname,
  } = useRouter();

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  /*
   * URL이 변경될 때마다
   * 서버에 현재 로그인 상태 확인.
   *
   * httpOnly 쿠키이므로
   * 프론트에서 토큰을 직접 읽지 않는다.
   */
  useEffect(() => {
    let cancelled = false;

    const checkAuth =
      async () => {
        try {
          setAuthLoading(true);

          const user =
            await getMyProfile();

          if (!cancelled) {
            setCurrentUser(
              user
            );
          }
        } catch (error) {
          if (!cancelled) {
            setCurrentUser(
              null
            );
          }

          /*
           * 로그아웃 상태의 401은
           * 정상적인 상황이므로
           * 콘솔 오류로 출력하지 않는다.
           */
          if (
            error.response?.status !==
            401
          ) {
            console.error(
              "로그인 상태 확인 실패:",
              error
            );
          }
        } finally {
          if (!cancelled) {
            setAuthLoading(
              false
            );
          }
        }
      };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const isLoggedIn =
    Boolean(currentUser);

  const isAdmin =
    currentUser?.role ===
    "admin";

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith(
      "/admin/"
    );

  const isProtectedUserRoute =
    [
      "/wishlist",
      "/mypage",
      "/cart",
      "/checkout",
      "/payment/complete",
      "/recent",
      "/inquiries",
    ].includes(pathname) ||
    pathname.startsWith(
      "/orders"
    ) ||
    pathname.startsWith(
      "/reviews"
    );

  /*
   * 인증 확인 중에는
   * 로그인 페이지를 먼저 띄우지 않는다.
   *
   * 안 그러면 새로고침 시 로그인 화면이
   * 순간적으로 보일 수 있음.
   */
  if (authLoading) {
    return (
      <div className="container">
        <main className="empty-state">
          <strong>
            로그인 정보를
            확인하는 중...
          </strong>
        </main>
      </div>
    );
  }

  /*
   * 관리자 페이지
   */
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return (
        <Login
          redirectTo={
            pathname
          }
          adminMode
        />
      );
    }

    if (!isAdmin) {
      return (
        <div className="container">
          <main className="empty-state">
            <span>!</span>

            <strong>
              관리자 권한이
              필요합니다.
            </strong>

            <p>
              관리자 계정으로
              로그인해 주세요.
            </p>
          </main>
        </div>
      );
    }
  }

  /*
   * 일반 로그인 필요 페이지
   */
  if (
    isProtectedUserRoute &&
    !isLoggedIn
  ) {
    return (
      <Login
        redirectTo={
          pathname
        }
      />
    );
  }

  /*
   * 일반 페이지
   */
  if (pathname === "/") {
    return <MainHome />;
  }

  if (pathname === "/login") {
    /*
     * 이미 관리자 로그인 상태에서
     * /login에 접근하면 관리자 화면으로
     * 보내도 되지만 커스텀 라우터 특성상
     * 여기서는 단순 Login 렌더링 유지.
     */
    return <Login />;
  }

  if (pathname === "/signup") {
    return <Signup />;
  }

  if (pathname === "/mypage") {
    return <MyPage />;
  }

  if (
    pathname ===
    "/categories"
  ) {
    return <Categories />;
  }

  if (
    pathname ===
    "/wishlist"
  ) {
    return <Wishlist />;
  }

  if (pathname === "/cart") {
    return <Cart />;
  }

  if (
    pathname ===
    "/checkout"
  ) {
    return <Checkout />;
  }

  if (
    pathname ===
    "/payment/complete"
  ) {
    return (
      <PaymentComplete />
    );
  }

  if (
    pathname ===
    "/products"
  ) {
    return <ProductList />;
  }

  if (
    /^\/products\/\d+$/.test(
      pathname
    )
  ) {
    return (
      <ProductDetail />
    );
  }

  if (
    pathname === "/search"
  ) {
    return <Search />;
  }

  if (
    pathname === "/recent"
  ) {
    return (
      <RecentProducts />
    );
  }

  if (
    pathname ===
    "/inquiries"
  ) {
    return <Inquiries />;
  }

  if (
    pathname === "/notices"
  ) {
    return <Notices />;
  }

  if (
    pathname === "/brands"
  ) {
    return <BrandHome />;
  }

  if (
    pathname === "/orders"
  ) {
    return <Orders />;
  }

  if (
    /^\/orders\/\d+$/.test(
      pathname
    )
  ) {
    return <OrderDetail />;
  }

  if (
    pathname === "/reviews"
  ) {
    return <Reviews />;
  }

  if (
    pathname ===
    "/reviews/write"
  ) {
    return <ReviewWrite />;
  }

  /*
   * 관리자
   */
  if (
    pathname === "/admin"
  ) {
    return (
      <AdminDashboard />
    );
  }

  if (
    pathname ===
    "/admin/products"
  ) {
    return <AdminProducts />;
  }

  if (
    pathname ===
    "/admin/products/upload"
  ) {
    return (
      <AdminProductUpload />
    );
  }

  if (
    /^\/admin\/products\/\d+\/edit$/.test(
      pathname
    )
  ) {
    return (
      <AdminProductUpload />
    );
  }

  if (
    pathname ===
    "/admin/orders"
  ) {
    return <AdminOrders />;
  }

  if (
    /^\/admin\/orders\/\d+$/.test(
      pathname
    )
  ) {
    return (
      <AdminOrderDetail />
    );
  }

  if (
    pathname ===
    "/admin/users"
  ) {
    return <AdminUsers />;
  }

  if (
    pathname ===
    "/admin/reviews"
  ) {
    return <AdminReviews />;
  }

  if (
    pathname ===
    "/admin/categories"
  ) {
    return (
      <AdminCategories />
    );
  }

  if (
    pathname ===
    "/admin/mypage"
  ) {
    return <AdminMyPage />;
  }

  if (
    pathname ===
    "/admin/security"
  ) {
    return (
      <AdminSecurity />
    );
  }

  return (
    <div className="container">
      <main className="empty-state">
        <span>!</span>

        <strong>
          페이지를 찾을 수
          없어요
        </strong>

        <p>
          <a href="/">
            홈으로 돌아가기
          </a>
        </p>
      </main>
    </div>
  );
};

export default App;