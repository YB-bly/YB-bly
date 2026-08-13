import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "../router";

import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import Pagination from "../components/Pagination";

import {
  formatPrice,
} from "../data/products";

import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "../api/adminApi";

const PAGE_SIZE = 5;

const statuses = [
  {
    value: "paid",
    label: "결제완료",
  },
  {
    value: "preparing",
    label: "배송준비",
  },
  {
    value: "shipping",
    label: "배송중",
  },
  {
    value: "delivered",
    label: "배송완료",
  },
  {
    value: "cancelled",
    label: "취소",
  },
];

const AdminOrders = () => {
  const [orders, setOrders] =
    useState([]);

  const [filter, setFilter] =
    useState("all");

  const [query, setQuery] =
    useState("");

  const [period, setPeriod] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchOrders =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getAdminOrders();

          setOrders(data);
        } catch (error) {
          console.error(
            "관리자 주문 목록 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "주문 목록을 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, []);

  const changeStatus =
    async (
      orderId,
      status
    ) => {
      try {
        setError("");

        await updateAdminOrderStatus(
          orderId,
          status
        );

        setOrders((current) =>
          current.map(
            (order) =>
              order.id ===
              orderId
                ? {
                    ...order,
                    status,
                    statusLabel:
                      statuses.find(
                        (item) =>
                          item.value ===
                          status
                      )?.label ||
                      status,
                  }
                : order
          )
        );
      } catch (error) {
        console.error(
          "주문 상태 변경 실패:",
          error
        );

        setError(
          error.response?.data
            ?.error ||
            "주문 상태를 변경하지 못했습니다."
        );
      }
    };

  const visibleOrders =
    useMemo(() => {
      const cutoff =
        period === "all"
          ? null
          : new Date(
              Date.now() -
                Number(period) *
                  86400000
            );

      return orders.filter(
        (order) => {
          const statusMatch =
            filter === "all" ||
            order.status ===
              filter;

          const dateMatch =
            !cutoff ||
            !order.createdAt ||
            new Date(
              order.createdAt
            ) >= cutoff;

          const searchTarget =
            `${order.number} ${order.customer} ${order.recipient} ${order.email}`
              .toLowerCase();

          const queryMatch =
            searchTarget.includes(
              query
                .trim()
                .toLowerCase()
            );

          return (
            statusMatch &&
            dateMatch &&
            queryMatch
          );
        }
      );
    }, [
      orders,
      filter,
      query,
      period,
    ]);

  const changeFilters = (
    setter,
    value
  ) => {
    setter(value);
    setPage(1);
  };

  const formatDate = (
    value
  ) => {
    if (!value) return "";

    return new Date(
      value
    ).toLocaleDateString(
      "ko-KR"
    );
  };

  return (
    <div className="admin-orders-page admin-page">
      <div className="container">
        <AdminHeader
          title="주문 관리"
          back
        />

        <main className="admin-orders">
          <div className="admin-orders__search">
            <input
              value={query}
              onChange={(event) =>
                changeFilters(
                  setQuery,
                  event.target.value
                )
              }
              placeholder="주문번호, 주문자 또는 이메일 검색"
            />

            <select
              value={period}
              onChange={(event) =>
                changeFilters(
                  setPeriod,
                  event.target.value
                )
              }
              aria-label="주문 기간"
            >
              <option value="all">
                전체 기간
              </option>

              <option value="30">
                최근 30일
              </option>

              <option value="90">
                최근 90일
              </option>
            </select>
          </div>

          <div className="admin-orders__filters">
            <button
              className={
                filter === "all"
                  ? "is-active"
                  : ""
              }
              type="button"
              onClick={() =>
                changeFilters(
                  setFilter,
                  "all"
                )
              }
            >
              전체 {orders.length}
            </button>

            {statuses.map(
              (status) => (
                <button
                  className={
                    filter ===
                    status.value
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    changeFilters(
                      setFilter,
                      status.value
                    )
                  }
                  type="button"
                  key={status.value}
                >
                  {status.label}{" "}
                  {
                    orders.filter(
                      (order) =>
                        order.status ===
                        status.value
                    ).length
                  }
                </button>
              )
            )}
          </div>

          {error && (
            <p className="auth-form__error">
              {error}
            </p>
          )}

          {loading ? (
            <section className="empty-state">
              <strong>
                주문 목록을 불러오는
                중...
              </strong>
            </section>
          ) : (
            <>
              <section className="admin-orders__list">
                {visibleOrders
                  .slice(
                    (page - 1) *
                      PAGE_SIZE,
                    page * PAGE_SIZE
                  )
                  .map((order) => (
                    <article
                      key={order.id}
                    >
                      <header>
                        <div>
                          <strong>
                            {
                              order.number
                            }
                          </strong>

                          <span>
                            {formatDate(
                              order.createdAt
                            )}
                            {" · "}
                            {order.customer ||
                              order.recipient}
                          </span>
                        </div>

                        <select
                          aria-label={`${order.number} 주문 상태`}
                          value={
                            order.status
                          }
                          onChange={(
                            event
                          ) =>
                            changeStatus(
                              order.id,
                              event.target
                                .value
                            )
                          }
                        >
                          <option value="pending">
                            주문접수
                          </option>

                          {statuses.map(
                            (
                              status
                            ) => (
                              <option
                                value={
                                  status.value
                                }
                                key={
                                  status.value
                                }
                              >
                                {
                                  status.label
                                }
                              </option>
                            )
                          )}
                        </select>
                      </header>

                      <div className="admin-order-product">
                        <div>
                          <strong>
                            주문자{" "}
                            {order.customer ||
                              order.recipient}
                          </strong>

                          <span>
                            {order.email}
                          </span>

                          <b>
                            {formatPrice(
                              order.total
                            )}
                          </b>
                        </div>
                      </div>

                      <footer>
                        <span>
                          주문 내부번호 #
                          {order.id}
                        </span>

                        <Link
                          to={`/admin/orders/${order.id}`}
                        >
                          상세 조회
                        </Link>
                      </footer>
                    </article>
                  ))}
              </section>

              {visibleOrders.length ===
                0 && (
                <section className="empty-state">
                  <span>!</span>

                  <strong>
                    조건에 맞는 주문이
                    없어요
                  </strong>
                </section>
              )}

              <Pagination
                page={page}
                total={
                  visibleOrders.length
                }
                pageSize={
                  PAGE_SIZE
                }
                onChange={
                  setPage
                }
              />
            </>
          )}
        </main>

        <AdminBottomNavigation />
      </div>
    </div>
  );
};

export default AdminOrders;