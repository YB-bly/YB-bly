import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppHeader from "../components/AppHeader";

import {
  formatPrice,
} from "../data/products";

import {
  useOrderParams,
} from "../router-hooks";

import {
  getOrder,
} from "../api/orderApi";

const OrderDetail = () => {
  const { orderId } =
    useOrderParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

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
            "주문 상세 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "주문 정보를 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const subtotal = useMemo(
    () =>
      order?.items?.reduce(
        (sum, item) =>
          sum +
          item.price *
            item.quantity,
        0
      ) ?? 0,
    [order]
  );

  const discount = order
    ? Math.max(
        0,
        subtotal - order.total
      )
    : 0;

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "";
    }

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

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <AppHeader
            title="주문 상세"
            back
            actions={false}
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

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <AppHeader
            title="주문 상세"
            back
            actions={false}
          />

          <main className="empty-state">
            <span>!</span>

            <strong>
              주문을 찾을 수 없어요
            </strong>

            <p>
              {error ||
                "주문 번호를 다시 확인해 주세요."}
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <AppHeader
          title="주문 상세"
          back
          actions={false}
        />

        <main className="order-detail">
          <section className="order-detail__status">
            <span>
              {formatDate(
                order.createdAt
              )}{" "}
              주문
            </span>

            <h1>
              {order.statusLabel}
            </h1>

            <p>
              {order.status ===
              "delivered"
                ? "배송이 완료됐어요."
                : order.status ===
                    "cancelled"
                  ? "취소된 주문입니다."
                  : "상품이 안전하게 이동하고 있어요."}
            </p>
          </section>

          <section className="order-detail__section">
            <h2>
              주문 상품
            </h2>

            {order.items.map(
              (item) => (
                <div
                  className="order-detail__product"
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
                    <div className="order-detail__image-placeholder">
                      이미지 준비 중
                    </div>
                  )}

                  <div>
                    <strong>
                      {item.brand}
                    </strong>

                    <p>
                      {item.name}
                    </p>

                    <span>
                      {item.option ||
                        "FREE"}{" "}
                      ·{" "}
                      {item.quantity}
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

          <section className="order-detail__section">
            <h2>
              배송지 정보
            </h2>

            <dl>
              <dt>
                받는 분
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

          <section className="order-detail__section">
            <h2>
              결제 정보
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
                할인
              </dt>

              <dd>
                -
                {formatPrice(
                  discount
                )}
              </dd>

              <dt>
                배송비
              </dt>

              <dd>
                0원
              </dd>

              <dt>
                총 결제 금액
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

          <p className="order-detail__number">
            주문번호{" "}
            {order.number} · 내부 ID
            #{order.id}
          </p>
        </main>
      </div>
    </div>
  );
};

export default OrderDetail;