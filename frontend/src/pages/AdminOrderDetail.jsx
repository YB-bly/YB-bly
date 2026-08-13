import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";

import {
  formatPrice,
} from "../data/products";

import {
  useAdminOrderParams,
} from "../router-hooks";

import {
  getOrder,
} from "../api/orderApi";

import {
  updateAdminOrderStatus,
} from "../api/adminApi";

const statuses = [
  {
    value: "pending",
    label: "주문접수",
  },
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

const AdminOrderDetail =
  () => {
    const { orderId } =
      useAdminOrderParams();

    const [order, setOrder] =
      useState(null);

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      error,
      setError,
    ] = useState("");

    const [
      changing,
      setChanging,
    ] = useState(false);

    useEffect(() => {
      const fetchOrder =
        async () => {
          try {
            setLoading(true);
            setError("");

            const data =
              await getOrder(
                orderId
              );

            setOrder(data);
          } catch (error) {
            console.error(
              "관리자 주문 상세 조회 실패:",
              error
            );

            setError(
              error.response?.data
                ?.error ||
                "주문을 불러오지 못했습니다."
            );
          } finally {
            setLoading(false);
          }
        };

      fetchOrder();
    }, [orderId]);

    const subtotal =
      useMemo(
        () =>
          order?.items?.reduce(
            (
              sum,
              item
            ) =>
              sum +
              item.price *
                item.quantity,
            0
          ) ?? 0,
        [order]
      );

    const discount =
      order
        ? Math.max(
            0,
            subtotal -
              order.total
          )
        : 0;

    const change =
      async (status) => {
        if (!order) return;

        try {
          setChanging(true);
          setError("");

          await updateAdminOrderStatus(
            order.id,
            status
          );

          const statusLabel =
            statuses.find(
              (item) =>
                item.value ===
                status
            )?.label;

          setOrder(
            (current) => ({
              ...current,
              status,
              statusLabel,
            })
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
        } finally {
          setChanging(false);
        }
      };

    if (loading) {
      return (
        <div className="admin-page">
          <div className="container">
            <AdminHeader
              title="주문 상세"
              back
            />

            <main className="empty-state">
              <strong>
                주문 정보를
                불러오는 중...
              </strong>
            </main>
          </div>
        </div>
      );
    }

    if (!order) {
      return (
        <div className="admin-page">
          <div className="container">
            <AdminHeader
              title="주문 상세"
              back
            />

            <main className="empty-state">
              <span>!</span>

              <strong>
                주문을 찾을 수
                없어요
              </strong>

              <p>{error}</p>
            </main>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-page">
        <div className="container">
          <AdminHeader
            title="주문 상세"
            back
          />

          <main className="admin-order-detail">
            {error && (
              <p className="auth-form__error">
                {error}
              </p>
            )}

            <section className="admin-order-detail__hero">
              <div>
                <span>
                  주문번호
                </span>

                <h1>
                  {order.number}
                </h1>

                <p>
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "ko-KR"
                      )
                    : ""}
                  {" · "}
                  내부 ID #
                  {order.id}
                </p>
              </div>

              <select
                value={
                  order.status
                }
                disabled={
                  changing
                }
                onChange={(
                  event
                ) =>
                  change(
                    event.target
                      .value
                  )
                }
                aria-label="주문 상태 변경"
              >
                {statuses.map(
                  (status) => (
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
            </section>

            <section>
              <h2>
                주문 상품
              </h2>

              {order.items.map(
                (item) => (
                  <div
                    className="admin-order-product"
                    key={item.id}
                  >
                    {item.image ? (
                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                      />
                    ) : (
                      <div className="admin-order-product__image-placeholder">
                        이미지 준비 중
                      </div>
                    )}

                    <div>
                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.option ||
                          "FREE"}{" "}
                        ·{" "}
                        {
                          item.quantity
                        }
                        개
                      </span>

                      <b>
                        {formatPrice(
                          item.price *
                            item.quantity
                        )}
                      </b>
                    </div>
                  </div>
                )
              )}
            </section>

            <section>
              <h2>
                주문자·배송지
              </h2>

              <dl>
                <dt>
                  주문자
                </dt>

                <dd>
                  {order.recipient}
                </dd>

                <dt>
                  연락처
                </dt>

                <dd>
                  {order.phone}
                </dd>

                <dt>
                  주소
                </dt>

                <dd>
                  {order.address}
                </dd>
              </dl>
            </section>

            <section>
              <h2>
                결제 내역
              </h2>

              <dl>
                <dt>
                  상품 금액
                </dt>

                <dd>
                  {formatPrice(
                    subtotal
                  )}
                </dd>

                <dt>
                  쿠폰 할인
                </dt>

                <dd>
                  -
                  {formatPrice(
                    discount
                  )}
                </dd>

                <dt>
                  최종 결제
                </dt>

                <dd>
                  <strong>
                    {formatPrice(
                      order.total
                    )}
                  </strong>
                </dd>
              </dl>
            </section>
          </main>

          <AdminBottomNavigation />
        </div>
      </div>
    );
  };

export default AdminOrderDetail;