import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "../router";
import { useNavigate } from "../router-hooks";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

import {
  getMyProfile,
} from "../api/userApi";

import {
  logout,
} from "../api/authApi";

import {
  getOrders,
} from "../api/orderApi";

import {
  getWishlist,
} from "../api/wishlistApi";

import {
  getMyCoupons,
} from "../api/couponApi";

const MyPage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState(null);

  const [orders, setOrders] =
    useState([]);

  const [wishlistCount, setWishlistCount] =
    useState(0);

  const [couponCount, setCouponCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchMyPage = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          profileData,
          ordersData,
          wishlistData,
          couponsData,
        ] = await Promise.all([
          getMyProfile(),
          getOrders(),
          getWishlist(),
          getMyCoupons(),
        ]);

        setProfile(profileData);
        setOrders(ordersData);
        setWishlistCount(wishlistData.length);
        setCouponCount(couponsData.length);
      } catch (error) {
        console.error(
          "마이페이지 조회 실패:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        setError(
          error.response?.data?.error ||
            "마이페이지 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyPage();
  }, [navigate]);

  const orderCounts = useMemo(() => {
    return orders.reduce(
      (counts, order) => {
        switch (order.status) {
          case "paid":
            counts.paid += 1;
            break;

          case "preparing":
            counts.preparing += 1;
            break;

          case "shipping":
            counts.shipping += 1;
            break;

          case "delivered":
            counts.delivered += 1;
            break;

          default:
            break;
        }

        return counts;
      },
      {
        paid: 0,
        preparing: 0,
        shipping: 0,
        delivered: 0,
      }
    );
  }, [orders]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "로그아웃 실패:",
        error
      );
    } finally {
      /*
       * 서버 로그아웃 성공 여부와 관계없이
       * 로그인 화면으로 이동
       */
      navigate("/login", {
        replace: true,
      });
    }
  };

  const avatarText =
    profile?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "Y";

  return (
    <div className="mypage-page">
      <div className="container">
        <AppHeader title="마이페이지" />

        <main className="mypage">
          {loading ? (
            <section className="empty-state">
              <strong>
                마이페이지 정보를
                불러오는 중...
              </strong>
            </section>
          ) : error ? (
            <section className="empty-state">
              <span>!</span>

              <strong>
                정보를 불러오지
                못했어요
              </strong>

              <p>{error}</p>
            </section>
          ) : (
            <>
              <section className="mypage__profile">
                <div className="mypage__avatar">
                  {avatarText}
                </div>

                <div>
                  <p>
                    안녕하세요,
                  </p>

                  <h1>
                    {profile?.name ||
                      "사용자"}{" "}
                    님
                  </h1>

                  <span>
                    {profile?.role ===
                    "admin"
                      ? "Admin Member"
                      : "Silver Member"}
                  </span>
                </div>
              </section>

              <section className="mypage__wallet">
                <div>
                  <span>
                    쿠폰
                  </span>

                  <strong>
                    {couponCount}장
                  </strong>
                </div>

                <div>
                  <span>
                    포인트
                  </span>

                  <strong>
                    0P
                  </strong>
                </div>

                <div>
                  <span>
                    찜
                  </span>

                  <strong>
                    {wishlistCount}개
                  </strong>
                </div>
              </section>

              <section className="mypage__orders">
                <div className="section-heading">
                  <h2>
                    나의 주문
                  </h2>

                  <Link to="/orders">
                    전체 보기 ›
                  </Link>
                </div>

                <div className="mypage__order-steps">
                  {[
                    {
                      value:
                        orderCounts.paid,
                      label:
                        "결제완료",
                    },
                    {
                      value:
                        orderCounts.preparing,
                      label:
                        "배송준비",
                    },
                    {
                      value:
                        orderCounts.shipping,
                      label:
                        "배송중",
                    },
                    {
                      value:
                        orderCounts.delivered,
                      label:
                        "배송완료",
                    },
                  ].map((step) => (
                    <div
                      key={
                        step.label
                      }
                    >
                      <strong>
                        {
                          step.value
                        }
                      </strong>

                      <span>
                        {
                          step.label
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mypage__menu">
                <h2>
                  쇼핑 활동
                </h2>

                <Link to="/orders">
                  <span>▣</span>
                  주문 내역
                  <strong>
                    ›
                  </strong>
                </Link>

                <Link to="/reviews">
                  <span>☆</span>
                  나의 리뷰
                  <strong>
                    ›
                  </strong>
                </Link>

                <Link to="/wishlist">
                  <span>♡</span>
                  찜한 상품
                  <strong>
                    ›
                  </strong>
                </Link>

                <Link to="/recent">
                  <span>◎</span>
                  최근 본 상품
                  <strong>
                    ›
                  </strong>
                </Link>
              </section>

              <section className="mypage__menu">
                <h2>
                  고객 지원
                </h2>

                <Link to="/inquiries">
                  <span>?</span>
                  문의 내역
                  <strong>
                    ›
                  </strong>
                </Link>

                <Link to="/notices">
                  <span>ⓘ</span>
                  공지사항
                  <strong>
                    ›
                  </strong>
                </Link>
              </section>

              <button
                className="mypage__logout"
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

        <BottomNavigation />
      </div>
    </div>
  );
};

export default MyPage;