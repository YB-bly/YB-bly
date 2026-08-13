import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "../router";

import {
  useNavigate,
} from "../router-hooks";

import AppHeader from "../components/AppHeader";

import {
  formatPrice,
} from "../data/products";

import {
  getOrders,
} from "../api/orderApi";

import {
  addCartItem,
} from "../api/cartApi";

const Orders = () => {
  const navigate =
    useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    tracking,
    setTracking,
  ] = useState(null);

  const [period, setPeriod] =
    useState("90");

  useEffect(() => {
    const fetchOrders =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getOrders();

          setOrders(data);
        } catch (error) {
          console.error(
            "주문 목록 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
            "주문 내역을 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, []);

  const visibleOrders =
    useMemo(() => {
      if (period === "all") {
        return orders;
      }

      const minimumDate =
        new Date(
          Date.now() -
          Number(period) *
          86400000
        );

      return orders.filter(
        (order) => {
          if (
            !order.createdAt
          ) {
            return true;
          }

          return (
            new Date(
              order.createdAt
            ) >= minimumDate
          );
        }
      );
    }, [orders, period]);

  const repurchase = async (
    order
  ) => {
    try {
      setError("");

      await Promise.all(
        order.items.map(
          (item) =>
            addCartItem({
              productId:
                item.productId,

              quantity:
                item.quantity,

              optionLabel:
                item.option,
            })
        )
      );

      navigate("/cart");
    } catch (error) {
      console.error(
        "재구매 장바구니 담기 실패:",
        error
      );

      setError(
        error.response?.data?.error ||
        "상품을 장바구니에 담지 못했습니다."
      );
    }
  };

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

  const getTrackingIndex = (
    status
  ) => {
    switch (status) {
      case "delivered":
        return 3;

      case "shipping":
        return 2;

      case "preparing":
        return 0;

      case "paid":
        return 0;

      default:
        return 0;
    }
  };

  return (
    <div className="orders-page">
      <div className="container">
        <AppHeader
          title="주문 내역"
          back
          actions={false}
        />

        <main className="orders">
          <div className="orders__filter">
            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target.value
                )
              }
              aria-label="주문 조회 기간"
            >
              <option value="30">
                최근 1개월
              </option>

              <option value="90">
                최근 3개월
              </option>

              <option value="365">
                최근 1년
              </option>

              <option value="all">
                전체 기간
              </option>
            </select>

            <span>
              총{" "}
              {
                visibleOrders.length
              }
              건
            </span>
          </div>

          {loading ? (
            <section className="empty-state">
              <strong>
                주문 내역을
                불러오는 중...
              </strong>
            </section>
          ) : error &&
            orders.length === 0 ? (
            <section className="empty-state">
              <span>!</span>

              <strong>
                주문 내역을
                불러오지 못했어요
              </strong>

              <p>{error}</p>
            </section>
          ) : visibleOrders.length ===
            0 ? (
            <section className="empty-state">
              <span>🛍</span>

              <strong>
                주문 내역이 없어요
              </strong>

              <p>
                마음에 드는 상품을
                주문해 보세요.
              </p>

              <Link to="/products">
                상품 보러 가기
              </Link>
            </section>
          ) : (
            <div className="orders__list">
              {error && (
                <p className="auth-form__error">
                  {error}
                </p>
              )}

              {visibleOrders.map(
                (order) => {
                  const product =
                    order.items[0];

                  if (!product) {
                    return null;
                  }

                  const totalQuantity =
                    order.items.reduce(
                      (
                        sum,
                        item
                      ) =>
                        sum +
                        item.quantity,
                      0
                    );

                  return (
                    <article
                      className="order-card"
                      key={order.id}
                    >
                      <header>
                        <div>
                          <time>
                            {formatDate(
                              order.createdAt
                            )}
                          </time>

                          <span>
                            주문번호{" "}
                            {
                              order.number
                            }
                          </span>
                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                        >
                          주문 상세 ›
                        </Link>
                      </header>

                      <strong className="order-card__status">
                        {
                          order.statusLabel
                        }
                      </strong>

                      <div className="order-card__product">
                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                          />
                        ) : (
                          <div className="order-card__image-placeholder">
                            이미지 준비
                            중
                          </div>
                        )}

                        <div>
                          <strong>
                            {
                              product.brand
                            }
                          </strong>

                          <p>
                            {
                              product.name
                            }
                          </p>

                          <span>
                            {product.option ||
                              "FREE"}{" "}
                            ·{" "}
                            {
                              totalQuantity
                            }
                            개
                            {order
                              .items
                              .length >
                              1 &&
                              ` · 외 ${order
                                .items
                                .length -
                              1
                              }개 상품`}
                          </span>

                          <b>
                            {formatPrice(
                              order.total
                            )}
                          </b>
                        </div>
                      </div>

                      <div className="order-card__actions">
                        {order.status ===
                          "delivered" ? (
                          <Link
                            to={`/reviews/write?product=${product.productId}&order=${order.id}`}
                          >
                            리뷰 작성
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setTracking(
                                order
                              )
                            }
                          >
                            배송 조회
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            repurchase(
                              order
                            )
                          }
                        >
                          재구매
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}

          {tracking && (
            <section
              className="orders__tracking"
              role="dialog"
              aria-modal="true"
            >
              <div>
                <header>
                  <div>
                    <strong>
                      배송 조회
                    </strong>

                    <span>
                      {
                        tracking.number
                      }
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setTracking(
                        null
                      )
                    }
                    aria-label="배송 조회 닫기"
                  >
                    ×
                  </button>
                </header>

                <p>
                  {
                    tracking.items[0]
                      ?.name
                  }
                </p>

                <ol>
                  {[
                    "상품 준비",
                    "집화 완료",
                    "배송 중",
                    "배송 완료",
                  ].map(
                    (
                      step,
                      index
                    ) => {
                      const activeIndex =
                        getTrackingIndex(
                          tracking.status
                        );

                      return (
                        <li
                          className={
                            index <=
                              activeIndex
                              ? "is-active"
                              : ""
                          }
                          key={step}
                        >
                          <b>
                            {index +
                              1}
                          </b>

                          <span>
                            {step}
                          </span>
                        </li>
                      );
                    }
                  )}
                </ol>

                <small>
                  모의 배송 정보이며
                  실제 택배사 조회가
                  아닙니다.
                </small>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Orders;