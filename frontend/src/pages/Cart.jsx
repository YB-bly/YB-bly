import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "../router";

import AppHeader from "../components/AppHeader";

import {
  formatPrice,
} from "../data/products";

import {
  saveCheckout,
} from "../data/shopStorage";

import {
  getCartItems,
  updateCartItem,
  removeCartItem,
} from "../api/cartApi";

import {
  getMyCoupons,
} from "../api/couponApi";

const Cart = () => {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [coupons, setCoupons] =
    useState([]);

  const [couponId, setCouponId] =
    useState("");

  const [coupon, setCoupon] =
    useState(null);

  const [
    couponMessage,
    setCouponMessage,
  ] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const [data, couponData] =
          await Promise.all([
            getCartItems(),
            getMyCoupons(),
          ]);

        setItems(data);
        setCoupons(couponData);
      } catch (error) {
        console.error(
          "장바구니 조회 실패:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          setError(
            "로그인 후 장바구니를 이용할 수 있어요."
          );
        } else {
          setError(
            error.response?.data?.error ||
              "장바구니를 불러오지 못했습니다."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      ),
    [items]
  );

  const discount = coupon
    ? Math.floor(
        subtotal * coupon.rate
      )
    : 0;

  const total = Math.max(
    0,
    subtotal - discount
  );

  const updateQuantity = async (
    cartItemId,
    nextQuantity
  ) => {
    if (
      nextQuantity < 1 ||
      nextQuantity > 20
    ) {
      return;
    }

    try {
      setError("");

      await updateCartItem(
        cartItemId,
        nextQuantity
      );

      setItems((prev) =>
        prev.map((item) =>
          item.cartItemId ===
          cartItemId
            ? {
                ...item,
                quantity:
                  nextQuantity,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "장바구니 수량 변경 실패:",
        error
      );

      setError(
        error.response?.data?.error ||
          "수량 변경에 실패했습니다."
      );
    }
  };

  const removeItem = async (
    cartItemId
  ) => {
    try {
      setError("");

      await removeCartItem(
        cartItemId
      );

      setItems((prev) =>
        prev.filter(
          (item) =>
            item.cartItemId !==
            cartItemId
        )
      );
    } catch (error) {
      console.error(
        "장바구니 삭제 실패:",
        error
      );

      setError(
        error.response?.data?.error ||
          "상품 삭제에 실패했습니다."
      );
    }
  };

  const removeAllItems =
    async () => {
      try {
        setError("");

        await Promise.all(
          items.map((item) =>
            removeCartItem(
              item.cartItemId
            )
          )
        );

        setItems([]);
      } catch (error) {
        console.error(
          "장바구니 전체 삭제 실패:",
          error
        );

        setError(
          "장바구니 전체 삭제 중 오류가 발생했습니다."
        );
      }
    };

  const applyCoupon = () => {
    const found = coupons.find(
      (item) =>
        Number(item.id) ===
        Number(couponId)
    );

    if (!found) {
      setCoupon(null);

      setCouponMessage(
        "사용할 수 없는 쿠폰이에요."
      );

      return;
    }

    if (
      found.minAmount &&
      subtotal < found.minAmount
    ) {
      setCoupon(null);

      setCouponMessage(
        `${found.minAmount.toLocaleString(
          "ko-KR"
        )}원 이상 구매 시 사용할 수 있는 쿠폰이에요.`
      );

      return;
    }

    setCoupon(found);

    setCouponMessage(
      `${found.label} 쿠폰이 적용됐어요.`
    );
  };

  const prepareCheckout = () => {
    const checkoutItems =
      items.map((item) => ({
        id: item.cartItemId,

        product: {
          id: item.productId,
          name: item.name,
          brand: item.brand,
          price: item.price,
          image:
            item.image_url,
          stock: item.stock,
        },

        option:
          item.optionLabel,

        quantity:
          item.quantity,
      }));

    saveCheckout({
      items: checkoutItems,
      coupon,
      subtotal,
      discount,
      total,
    });
  };

  return (
    <div className="cart-page">
      <div className="container">
        <AppHeader
          title="장바구니"
          back
          actions={false}
        />

        <main className="cart">
          {loading ? (
            <section className="empty-state">
              <strong>
                장바구니를 불러오는
                중...
              </strong>
            </section>
          ) : error &&
            items.length === 0 ? (
            <section className="empty-state">
              <span>!</span>

              <strong>
                장바구니를 불러오지
                못했어요
              </strong>

              <p>{error}</p>

              <Link
                className="cart__empty-link"
                to="/login"
              >
                로그인하기
              </Link>
            </section>
          ) : items.length === 0 ? (
            <section className="empty-state">
              <span>🛍</span>

              <strong>
                장바구니가 비어 있어요
              </strong>

              <p>
                마음에 드는 상품을
                담아보세요.
              </p>

              <Link
                className="cart__empty-link"
                to="/products"
              >
                상품 보러 가기
              </Link>
            </section>
          ) : (
            <>
              {error && (
                <p className="auth-form__error">
                  {error}
                </p>
              )}

              <section className="cart__items">
                <div className="cart__section-title">
                  <h2>
                    상품{" "}
                    {items.length}개
                  </h2>

                  <button
                    type="button"
                    onClick={
                      removeAllItems
                    }
                  >
                    전체 삭제
                  </button>
                </div>

                {items.map(
                  (item) => (
                    <article
                      className="cart-item"
                      key={
                        item.cartItemId
                      }
                    >
                      {item.image_url ? (
                        <img
                          src={
                            item.image_url
                          }
                          alt={
                            item.name
                          }
                        />
                      ) : (
                        <div className="cart-item__image-placeholder">
                          이미지 준비 중
                        </div>
                      )}

                      <div className="cart-item__body">
                        <button
                          className="cart-item__remove"
                          type="button"
                          aria-label={`${item.name} 삭제`}
                          onClick={() =>
                            removeItem(
                              item.cartItemId
                            )
                          }
                        >
                          ×
                        </button>

                        <strong>
                          {item.brand}
                        </strong>

                        <p>
                          {item.name}
                        </p>

                        {item.optionLabel && (
                          <span>
                            {
                              item.optionLabel
                            }
                          </span>
                        )}

                        <div className="cart-item__bottom">
                          <div className="quantity-control">
                            <button
                              type="button"
                              disabled={
                                item.quantity <=
                                1
                              }
                              onClick={() =>
                                updateQuantity(
                                  item.cartItemId,
                                  item.quantity -
                                    1
                                )
                              }
                            >
                              −
                            </button>

                            <b>
                              {
                                item.quantity
                              }
                            </b>

                            <button
                              type="button"
                              disabled={
                                item.quantity >=
                                item.stock
                              }
                              onClick={() =>
                                updateQuantity(
                                  item.cartItemId,
                                  item.quantity +
                                    1
                                )
                              }
                            >
                              ＋
                            </button>
                          </div>

                          <b>
                            {formatPrice(
                              item.price *
                                item.quantity
                            )}
                          </b>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </section>

              <section className="cart__coupon">
                <h2>보유 쿠폰</h2>

                <div>
                  <select
                    value={
                      couponId
                    }
                    onChange={(
                      event
                    ) => {
                      setCouponId(
                        event.target
                          .value
                      );

                      setCoupon(
                        null
                      );

                      setCouponMessage(
                        ""
                      );
                    }}
                  >
                    <option value="">
                      쿠폰을 선택하세요
                    </option>

                    {coupons.map(
                      (item) => (
                        <option
                          value={
                            item.id
                          }
                          key={
                            item.id
                          }
                        >
                          {item.label}{" "}
                          ({item.code})
                          {item.minAmount
                            ? ` · ${item.minAmount.toLocaleString(
                                "ko-KR"
                              )}원 이상`
                            : ` · ${item.expiresAt}까지`}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="button"
                    disabled={
                      !couponId
                    }
                    onClick={
                      applyCoupon
                    }
                  >
                    적용
                  </button>
                </div>

                {couponMessage && (
                  <p
                    className={
                      coupon
                        ? "is-success"
                        : ""
                    }
                  >
                    {
                      couponMessage
                    }
                  </p>
                )}
              </section>

              <section className="cart__summary">
                <h2>
                  결제 금액
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

                  <dd className="is-discount">
                    -
                    {formatPrice(
                      discount
                    )}
                  </dd>

                  <dt>
                    배송비
                  </dt>

                  <dd>무료</dd>

                  <dt>
                    총 결제 금액
                  </dt>

                  <dd>
                    {formatPrice(
                      total
                    )}
                  </dd>
                </dl>
              </section>
            </>
          )}
        </main>

        {!loading &&
          items.length > 0 && (
            <div className="cart__checkout">
              <Link
                to="/checkout"
                onClick={
                  prepareCheckout
                }
              >
                {formatPrice(
                  total
                )}{" "}
                주문하기
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};

export default Cart;