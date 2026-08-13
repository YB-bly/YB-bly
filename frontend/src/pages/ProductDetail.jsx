import {
  useEffect,
  useState,
} from "react";

import { Link } from "../router";

import {
  useNavigate,
  useParams,
} from "../router-hooks";

import AppHeader from "../components/AppHeader";

import {
  formatPrice,
} from "../data/products";

import {
  saveCheckout,
} from "../data/shopStorage";

import {
  addRecentProduct,
} from "../data/shopRepository";

import {
  addCartItem,
} from "../api/cartApi";

import {
  getProduct,
} from "../api/productApi";

import {
  getProductReviews,
} from "../api/reviewApi";

import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../api/wishlistApi";

const ProductDetail = () => {
  const { productId } =
    useParams();

  const navigate =
    useNavigate();

  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    reviews,
    setReviews,
  ] = useState([]);

  const [
    reviewsLoading,
    setReviewsLoading,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    size,
    setSize,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    liked,
    setLiked,
  ] = useState(false);

  const [
    likeLoading,
    setLikeLoading,
  ] = useState(false);

  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getProduct(
              productId
            );

          setProduct(data);

          addRecentProduct(
            data.id
          );

          /*
           * 로그인 상태라면
           * 현재 상품의 찜 여부 확인
           */
          try {
            const wishlist =
              await getWishlist();

            setLiked(
              wishlist.some(
                (item) =>
                  Number(
                    item.id
                  ) ===
                  Number(
                    data.id
                  )
              )
            );
          } catch (
            wishlistError
          ) {
            if (
              wishlistError
                .response?.status !==
              401
            ) {
              console.error(
                "찜 상태 조회 실패:",
                wishlistError
              );
            }

            setLiked(false);
          }
        } catch (error) {
          console.error(
            "상품 상세 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "상품 정보를 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProduct();
  }, [productId]);

  /*
   * 상품 리뷰 API 조회
   */
  useEffect(() => {
    if (!productId) {
      return;
    }

    const fetchReviews =
      async () => {
        try {
          setReviewsLoading(
            true
          );

          const data =
            await getProductReviews(
              productId
            );

          setReviews(data);
        } catch (error) {
          console.error(
            "상품 리뷰 조회 실패:",
            error
          );

          setReviews([]);
        } finally {
          setReviewsLoading(
            false
          );
        }
      };

    fetchReviews();
  }, [productId]);

  const toggleWishlist =
    async () => {
      if (
        !product ||
        likeLoading
      ) {
        return;
      }

      try {
        setLikeLoading(true);

        if (liked) {
          await removeWishlistItem(
            product.id
          );

          setLiked(false);
        } else {
          await addWishlistItem(
            product.id
          );

          setLiked(true);
        }
      } catch (error) {
        console.error(
          "찜 변경 실패:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          navigate("/login");
          return;
        }

        alert(
          error.response?.data
            ?.error ||
            "찜 처리 중 오류가 발생했습니다."
        );
      } finally {
        setLikeLoading(false);
      }
    };

  const addToCart =
    async () => {
      try {
        await addCartItem({
          productId:
            product.id,

          quantity,

          optionLabel:
            size,
        });

        navigate("/cart");
      } catch (error) {
        console.error(
          "장바구니 담기 실패:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          navigate("/login");
          return;
        }

        alert(
          error.response?.data
            ?.error ||
            "장바구니에 담지 못했습니다."
        );
      }
    };

  const buyNow = () => {
    saveCheckout({
      items: [
        {
          id: `${product.id}-${size}`,

          product,

          option: size,

          quantity,
        },
      ],

      coupon: null,

      subtotal:
        product.price *
        quantity,

      discount: 0,

      total:
        product.price *
        quantity,
    });

    navigate("/checkout");
  };

  const formatReviewDate = (
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
      <div className="product-detail-page">
        <div className="container">
          <AppHeader
            title="상품 상세"
            back
          />

          <main className="empty-state">
            <strong>
              상품 정보를 불러오는
              중...
            </strong>
          </main>
        </div>
      </div>
    );
  }

  if (
    error ||
    !product
  ) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <AppHeader
            title="상품 상세"
            back
          />

          <main className="empty-state">
            <span>!</span>

            <strong>
              판매 중인 상품을
              찾을 수 없어요
            </strong>

            <p>
              {error ||
                "상품이 삭제되었거나 판매가 종료됐습니다."}
            </p>
          </main>
        </div>
      </div>
    );
  }

  /*
   * 현재 products 테이블에는
   * size 컬럼이 없으므로
   * FREE 기본값 사용
   */
  const sizes =
    product.sizes?.length
      ? product.sizes
      : ["FREE"];

  const soldOut =
    Number(
      product.stock
    ) <= 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        <AppHeader back />

        <main className="product-detail">
          <div className="product-detail__visual">
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
              <div className="product-detail__image-placeholder">
                이미지 준비 중
              </div>
            )}

            <span>
              1 / 1
            </span>
          </div>

          <section className="product-detail__summary">
            <div className="product-detail__brand">
              <strong>
                {
                  product.brand
                }
              </strong>

              <Link
                to={`/brands?brand=${encodeURIComponent(
                  product.brand
                )}`}
              >
                브랜드 홈 →
              </Link>
            </div>

            <h1>
              {product.name}
            </h1>

            <div className="product-detail__rating">
              ★{" "}
              {Number(
                product.rating
              ).toFixed(1)}{" "}

              <u>
                리뷰{" "}
                {product.reviews}
                개
              </u>
            </div>

            {product.originalPrice >
              product.price && (
              <del>
                {formatPrice(
                  product.originalPrice
                )}
              </del>
            )}

            <p className="product-detail__price">
              {product.discount >
                0 && (
                <span>
                  {
                    product.discount
                  }
                  %
                </span>
              )}

              {formatPrice(
                product.price
              )}
            </p>

            <p className="product-detail__benefit">
              로그인하면 최대
              3,400P 적립
            </p>
          </section>

          <section className="product-detail__delivery">
            <dl>
              <dt>
                배송
              </dt>

              <dd>
                <strong>
                  무료배송
                </strong>

                <br />

                평균 2일 이내 출고
              </dd>
            </dl>

            <dl>
              <dt>
                혜택
              </dt>

              <dd>
                YB-bly 첫 구매 10%
                쿠폰
              </dd>
            </dl>
          </section>

          <section className="product-detail__option">
            <h2>
              사이즈 선택
            </h2>

            <div>
              {sizes.map(
                (item) => (
                  <button
                    className={
                      size === item
                        ? "is-selected"
                        : ""
                    }
                    type="button"
                    key={item}
                    onClick={() =>
                      setSize(
                        item
                      )
                    }
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="product-detail__quantity">
              <span>
                수량
              </span>

              <div>
                <button
                  type="button"
                  disabled={
                    quantity === 1
                  }
                  onClick={() =>
                    setQuantity(
                      (value) =>
                        Math.max(
                          1,
                          value -
                            1
                        )
                    )
                  }
                >
                  −
                </button>

                <strong>
                  {quantity}
                </strong>

                <button
                  type="button"
                  disabled={
                    quantity >=
                    Number(
                      product.stock
                    )
                  }
                  onClick={() =>
                    setQuantity(
                      (value) =>
                        Math.min(
                          Number(
                            product.stock
                          ),
                          value +
                            1
                        )
                    )
                  }
                >
                  ＋
                </button>
              </div>
            </div>
          </section>

          <section className="product-detail__description">
            <h2>
              상품 정보
            </h2>

            <p>
              {product.description ||
                "상품 상세 정보가 준비 중입니다."}
            </p>
          </section>

          <section className="product-detail__reviews">
            <div>
              <h2>
                상품 리뷰{" "}
                <span>
                  {
                    reviews.length
                  }
                </span>
              </h2>

              <Link to="/reviews">
                나의 리뷰 보기
              </Link>
            </div>

            {reviewsLoading ? (
              <p className="product-detail__reviews-empty">
                리뷰를 불러오는
                중...
              </p>
            ) : reviews.length >
              0 ? (
              reviews.map(
                (review) => (
                  <article
                    key={
                      review.id
                    }
                  >
                    <header>
                      <strong>
                        {review.userName ||
                          "사용자"}
                      </strong>

                      <span>
                        {"★".repeat(
                          Number(
                            review.rating
                          )
                        )}

                        {"☆".repeat(
                          Math.max(
                            0,
                            5 -
                              Number(
                                review.rating
                              )
                          )
                        )}
                      </span>

                      <time>
                        {formatReviewDate(
                          review.createdAt
                        )}
                      </time>
                    </header>

                    <p>
                      {
                        review.content
                      }
                    </p>

                    <small>
                      ✓ 구매 인증
                    </small>
                  </article>
                )
              )
            ) : (
              <p className="product-detail__reviews-empty">
                아직 작성된 리뷰가
                없어요.
              </p>
            )}
          </section>
        </main>

        <div className="purchase-bar">
          <button
            className={`purchase-bar__like${
              liked
                ? " is-liked"
                : ""
            }`}
            type="button"
            disabled={
              likeLoading
            }
            onClick={
              toggleWishlist
            }
            aria-label={
              liked
                ? "찜 해제"
                : "찜하기"
            }
            aria-pressed={
              liked
            }
          >
            {liked
              ? "♥"
              : "♡"}
          </button>

          <button
            className="purchase-bar__cart"
            type="button"
            disabled={
              !size ||
              soldOut
            }
            onClick={
              addToCart
            }
          >
            {soldOut
              ? "품절"
              : size
                ? "장바구니 담기"
                : "사이즈를 선택해 주세요"}
          </button>

          <button
            className="purchase-bar__buy"
            type="button"
            disabled={
              !size ||
              soldOut
            }
            onClick={
              buyNow
            }
          >
            {soldOut
              ? "구매 불가"
              : size
                ? `${formatPrice(
                    product.price *
                      quantity
                  )} 구매`
                : "바로 구매"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;