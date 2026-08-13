import {
  useEffect,
  useState,
} from "react";

import { Link } from "../router";

import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";

import {
  formatPrice,
} from "../data/products";

import {
  getAdminDashboard,
  getAdminOrders,
} from "../api/adminApi";

const AdminDashboard = () => {
  const [dashboard, setDashboard] =
    useState({
      userCount: 0,
      productCount: 0,
      orderCount: 0,
      salesTotal: 0,
    });

  const [
    recentOrders,
    setRecentOrders,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            dashboardData,
            ordersData,
          ] = await Promise.all([
            getAdminDashboard(),
            getAdminOrders(),
          ]);

          setDashboard(
            dashboardData
          );

          setRecentOrders(
            ordersData.slice(0, 3)
          );
        } catch (error) {
          console.error(
            "관리자 대시보드 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "대시보드 정보를 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);

  const formatDate = (
    value
  ) => {
    if (!value) return "";

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date
      .toLocaleDateString(
        "ko-KR"
      )
      .replaceAll(" ", "");
  };

  return (
    <div className="admin-dashboard-page admin-page">
      <div className="container">
        <AdminHeader title="대시보드" />

        <main className="admin-dashboard">
          <section className="admin-dashboard__welcome">
            <p>
              {new Date().toLocaleDateString(
                "ko-KR"
              )}
            </p>

            <h2>
              안녕하세요, 관리자님
            </h2>

            <span>
              오늘의 쇼핑몰 현황을
              확인하세요.
            </span>
          </section>

          {loading ? (
            <section className="empty-state">
              <strong>
                대시보드를 불러오는
                중...
              </strong>
            </section>
          ) : error ? (
            <section className="empty-state">
              <span>!</span>
              <strong>{error}</strong>
            </section>
          ) : (
            <>
              <section className="admin-dashboard__stats">
                {[
                  {
                    label:
                      "전체 주문",
                    value: `${dashboard.orderCount}건`,
                    tone: "mint",
                  },
                  {
                    label:
                      "결제 매출",
                    value:
                      formatPrice(
                        dashboard.salesTotal
                      ),
                    tone: "yellow",
                  },
                  {
                    label:
                      "전체 상품",
                    value: `${dashboard.productCount}개`,
                    tone: "blue",
                  },
                  {
                    label:
                      "전체 회원",
                    value: `${dashboard.userCount}명`,
                    tone: "pink",
                  },
                ].map((stat) => (
                  <div
                    className={`is-${stat.tone}`}
                    key={stat.label}
                  >
                    <span>
                      {stat.label}
                    </span>

                    <strong>
                      {stat.value}
                    </strong>
                  </div>
                ))}
              </section>

              <section className="admin-panel">
                <div className="admin-panel__title">
                  <h2>
                    빠른 관리
                  </h2>
                </div>

                <div className="admin-dashboard__quick">
                  <Link to="/admin/products">
                    상품 관리
                    <span>›</span>
                  </Link>

                  <Link to="/admin/orders">
                    주문 관리
                    <span>›</span>
                  </Link>

                  <Link to="/admin/users">
                    회원 관리
                    <span>›</span>
                  </Link>

                  <Link to="/admin/reviews">
                    리뷰 관리
                    <span>›</span>
                  </Link>
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel__title">
                  <h2>
                    최근 주문
                  </h2>

                  <Link to="/admin/orders">
                    전체 보기
                  </Link>
                </div>

                {recentOrders.map(
                  (order) => (
                    <div
                      className="admin-dashboard__order"
                      key={order.id}
                    >
                      <div>
                        <strong>
                          {order.number}
                        </strong>

                        <span>
                          {order.customer ||
                            order.recipient}
                          {" · "}
                          {formatDate(
                            order.createdAt
                          )}
                        </span>
                      </div>

                      <div>
                        <b>
                          {formatPrice(
                            order.total
                          )}
                        </b>

                        <em>
                          {
                            order.statusLabel
                          }
                        </em>
                      </div>
                    </div>
                  )
                )}

                {recentOrders.length ===
                  0 && (
                  <div className="empty-state">
                    <strong>
                      아직 주문이
                      없어요.
                    </strong>
                  </div>
                )}
              </section>
            </>
          )}
        </main>

        <AdminBottomNavigation />
      </div>
    </div>
  );
};

export default AdminDashboard;