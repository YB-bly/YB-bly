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

  const [
    showInitialSignup,
    setShowInitialSignup,
  ] = useState(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return false;
    }

    return (
      !sessionStorage.getItem(
        "yb-bly-initial-signup"
      )
    );
  });

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

  useEffect(() => {
    if (
      pathname !== "/" &&
      showInitialSignup
    ) {
      sessionStorage.setItem(
        "yb-bly-initial-signup",
        "true"
      );

      setShowInitialSignup(false);
    }
  }, [
    pathname,
    showInitialSignup,
  ]);

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
            <span>
              !
            </span>

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

  if (pathname === "/") {
    if (showInitialSignup) {
      return (
        <Signup
          onInitialComplete={() =>
            setShowInitialSignup(
              false
            )
          }
        />
      );
    }

    return <MainHome />;
  }

  if (
    pathname === "/login"
  ) {
    return <Login />;
  }

  if (
    pathname === "/signup"
  ) {
    return <Signup />;
  }

  if (
    pathname === "/mypage"
  ) {
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

  if (
    pathname === "/cart"
  ) {
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
        <span>
          !
        </span>

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