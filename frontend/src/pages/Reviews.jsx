import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "../router";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

import {
  getOrders,
} from "../api/orderApi";

import {
  getMyProfile,
} from "../api/userApi";

import {
  deleteReview,
  getProductReviews,
} from "../api/reviewApi";

const Reviews = () => {
  const [tab, setTab] =
    useState("written");

  const [reviews, setReviews] =
    useState([]);

  const [
    availableReviews,
    setAvailableReviews,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchReviewData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            profile,
            orders,
          ] = await Promise.all([
            getMyProfile(),
            getOrders(),
          ]);
          const purchasedItems =
            orders.flatMap(
              (order) =>
                order.items.map(
                  (item) => ({
                    ...item,

                    orderId:
                      order.id,

                    orderStatus:
                      order.status,
                  })
                )
            );

          const productIds = [
            ...new Set(
              purchasedItems.map(
                (item) =>
                  item.productId
              )
            ),
          ];

          const reviewResults =
            await Promise.all(
              productIds.map(
                async (
                  productId
                ) => {
                  const data =
                    await getProductReviews(
                      productId
                    );

                  return {
                    productId,
                    reviews: data,
                  };
                }
              )
            );

          const myReviews =
            reviewResults.flatMap(
              ({
                productId,
                reviews:
                  productReviews,
              }) => {
                const product =
                  purchasedItems.find(
                    (item) =>
                      Number(
                        item.productId
                      ) ===
                      Number(
                        productId
                      )
                  );

                return productReviews
                  .filter(
                    (review) =>
                      review.userName ===
                      profile.name
                  )
                  .map(
                    (review) => ({
                      ...review,
                      product,
                    })
                  );
              }
            );

          setReviews(myReviews);

          const reviewedProductIds =
            new Set(
              myReviews.map(
                (review) =>
                  Number(
                    review.product
                      ?.productId
                  )
              )
            );

          const available =
            purchasedItems.filter(
              (item) =>
                item.orderStatus ===
                  "paid" &&
                !reviewedProductIds.has(
                  Number(
                    item.productId
                  )
                )
            );

          const uniqueAvailable =
            available.filter(
              (
                item,
                index,
                array
              ) =>
                array.findIndex(
                  (candidate) =>
                    Number(
                      candidate.productId
                    ) ===
                    Number(
                      item.productId
                    )
                ) === index
            );

          setAvailableReviews(
            uniqueAvailable
          );
        } catch (error) {
          console.error(
            "리뷰 정보 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "리뷰 정보를 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchReviewData();
  }, []);

  const average = useMemo(
    () =>
      reviews.length
        ? (
            reviews.reduce(
              (
                sum,
                review
              ) =>
                sum +
                review.rating,
              0
            ) / reviews.length
          ).toFixed(1)
        : "0.0",
    [reviews]
  );

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

  const remove = async (
    review
  ) => {
    const confirmed =
      window.confirm(
        "작성한 리뷰를 삭제할까요?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteReview(
        review.id
      );

      setReviews((current) =>
        current.filter(
          (item) =>
            item.id !== review.id
        )
      );

      if (review.product) {
        setAvailableReviews(
          (current) => {
            const exists =
              current.some(
                (item) =>
                  Number(
                    item.productId
                  ) ===
                  Number(
                    review.product
                      .productId
                  )
              );

            if (exists) {
              return current;
            }

            return [
              review.product,
              ...current,
            ];
          }
        );
      }
    } catch (error) {
      console.error(
        "리뷰 삭제 실패:",
        error
      );

      setError(
        error.response?.data
          ?.error ||
          "리뷰 삭제에 실패했습니다."
      );
    }
  };

  return (
    <div className="reviews-page">
      <div className="container">
        <AppHeader title="나의 리뷰" />

        <main className="reviews">
          {loading ? (
            <section className="empty-state">
              <strong>
                리뷰 정보를
                불러오는 중...
              </strong>
            </section>
          ) : error &&
            reviews.length === 0 &&
            availableReviews.length ===
              0 ? (
            <section className="empty-state">
              <span>!</span>

              <strong>
                리뷰 정보를
                불러오지 못했어요
              </strong>

              <p>{error}</p>
            </section>
          ) : (
            <>
              {error && (
                <p className="auth-form__error">
                  {error}
                </p>
              )}

              <section className="reviews__summary">
                <div>
                  <strong>
                    {average}
                  </strong>

                  <span>
                    ★★★★★
                  </span>

                  <p>
                    작성한 리뷰{" "}
                    {reviews.length}개
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setTab(
                      "available"
                    )
                  }
                >
                  작성 가능한 리뷰{" "}
                  <strong>
                    {
                      availableReviews.length
                    }
                  </strong>{" "}
                  ›
                </button>
              </section>

              <div className="reviews__tabs">
                <button
                  className={
                    tab ===
                    "written"
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    setTab(
                      "written"
                    )
                  }
                  type="button"
                >
                  작성한 리뷰{" "}
                  {reviews.length}
                </button>

                <button
                  className={
                    tab ===
                    "available"
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    setTab(
                      "available"
                    )
                  }
                  type="button"
                >
                  작성 가능{" "}
                  {
                    availableReviews.length
                  }
                </button>
              </div>

              {tab ===
              "written" ? (
                <section className="reviews__list">
                  {reviews.map(
                    (review) => (
                      <article
                        className="review-card"
                        key={
                          review.id
                        }
                      >
                        <header>
                          {review
                            .product
                            ?.image ? (
                            <img
                              src={
                                review
                                  .product
                                  .image
                              }
                              alt={
                                review
                                  .product
                                  .name
                              }
                            />
                          ) : (
                            <div className="review-card__image-placeholder">
                              이미지
                              준비 중
                            </div>
                          )}

                          <div>
                            <strong>
                              {
                                review
                                  .product
                                  ?.brand
                              }
                            </strong>

                            <p>
                              {
                                review
                                  .product
                                  ?.name
                              }
                            </p>

                            <span>
                              {review
                                .product
                                ?.option ||
                                "FREE"}
                            </span>
                          </div>

                          <div className="review-card__actions">

                            <button
                              type="button"
                              onClick={() =>
                                remove(
                                  review
                                )
                              }
                            >
                              삭제
                            </button>
                          </div>
                        </header>

                        <div className="review-card__meta">
                          <span>
                            {"★".repeat(
                              review.rating
                            )}

                            {"☆".repeat(
                              Math.max(
                                0,
                                5 -
                                  review.rating
                              )
                            )}
                          </span>

                          <time>
                            {formatDate(
                              review.createdAt
                            )}
                          </time>
                        </div>

                        <p className="review-card__text">
                          {
                            review.content
                          }
                        </p>
                      </article>
                    )
                  )}

                  {reviews.length ===
                    0 && (
                    <div className="empty-state">
                      <span>☆</span>

                      <strong>
                        작성한 리뷰가
                        없어요
                      </strong>
                    </div>
                  )}
                </section>
              ) : (
                <section className="reviews__available">
                  {availableReviews.map(
                    (item) => (
                      <article
                        key={`${item.orderId}-${item.productId}`}
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
                          <div className="reviews__image-placeholder">
                            이미지
                            준비 중
                          </div>
                        )}

                        <div>
                          <strong>
                            {
                              item.name
                            }
                          </strong>

                          <span>
                            {item.option ||
                              "FREE"}
                          </span>
                        </div>

                        <Link
                          to={`/reviews/write?product=${item.productId}&order=${item.orderId}`}
                        >
                          리뷰 작성
                        </Link>
                      </article>
                    )
                  )}

                  {availableReviews.length ===
                    0 && (
                    <div className="empty-state">
                      <span>✓</span>

                      <strong>
                        작성 가능한
                        리뷰가 없어요
                      </strong>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default Reviews;