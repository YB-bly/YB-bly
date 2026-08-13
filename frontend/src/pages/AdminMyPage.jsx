import {
  useEffect,
  useState,
} from "react";

import { Link } from "../router";

import {
  useNavigate,
} from "../router-hooks";

import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";

import {
  getMyProfile,
} from "../api/userApi";

import {
  logout,
} from "../api/authApi";

const AdminMyPage = () => {
  const navigate =
    useNavigate();

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const data =
            await getMyProfile();

          setProfile(data);
        } catch (error) {
          console.error(
            "관리자 정보 조회 실패:",
            error
          );

          if (
            error.response?.status ===
            401
          ) {
            navigate(
              "/login",
              {
                replace: true,
              }
            );
          }
        } finally {
          setLoading(false);
        }
      };

    fetchProfile();
  }, [navigate]);

  const handleLogout =
    async () => {
      try {
        await logout();
      } catch (error) {
        console.error(
          "로그아웃 실패:",
          error
        );
      } finally {
        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }
    };

  return (
    <div className="admin-mypage-page admin-page">
      <div className="container">
        <AdminHeader
          title="관리자 정보"
          back
        />

        <main className="admin-mypage">
          {loading ? (
            <section className="empty-state">
              <strong>
                관리자 정보를
                불러오는 중...
              </strong>
            </section>
          ) : (
            <>
              <section className="admin-mypage__profile">
                <div>
                  {profile?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "A"}
                </div>

                <h2>
                  {profile?.name ||
                    "관리자"}
                </h2>

                <p>
                  {profile?.email ||
                    ""}
                </p>

                <span>
                  Admin
                </span>
              </section>

              <section className="admin-mypage__menu">
                <Link to="/admin/products">
                  상품 관리{" "}
                  <span>›</span>
                </Link>

                <Link to="/admin/orders">
                  주문 관리{" "}
                  <span>›</span>
                </Link>

                <Link to="/admin/users">
                  회원 관리{" "}
                  <span>›</span>
                </Link>

                <Link to="/admin/reviews">
                  리뷰 관리{" "}
                  <span>›</span>
                </Link>

                <Link to="/admin/security">
                  보안 설정{" "}
                  <span>›</span>
                </Link>
              </section>

              <button
                className="admin-mypage__logout"
                type="button"
                onClick={
                  handleLogout
                }
              >
                로그아웃
              </button>
            </>
          )}
        </main>

        <AdminBottomNavigation />
      </div>
    </div>
  );
};

export default AdminMyPage;