import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "../router-hooks";

import AppHeader from "../components/AppHeader";

import {
  getProduct,
} from "../api/productApi";

import {
  createReview,
} from "../api/reviewApi";

const ReviewWrite = () => {
  const navigate =
    useNavigate();

  const [params] =
    useSearchParams();

  const productId =
    params.get("product");

  const orderId =
    params.get("order");

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [rating, setRating] =
    useState(0);

  const [content, setContent] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!productId) {
      setError(
        "리뷰를 작성할 상품 정보가 없습니다."
      );

      setLoading(false);
      return;
    }

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
        } catch (error) {
          console.error(
            "리뷰 상품 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "리뷰를 작성할 상품을 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!rating) {
      setError(
        "별점을 선택해 주세요."
      );
      return;
    }

    if (
      content.trim().length < 10
    ) {
      setError(
        "리뷰 내용을 10자 이상 입력해 주세요."
      );
      return;
    }

    if (!orderId) {
      setError(
        "주문 정보를 확인할 수 없습니다. 주문 내역에서 다시 리뷰 작성을 진행해 주세요."
      );
      return;
    }

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createReview({
        productId:
          Number(productId),

        orderId:
          Number(orderId),

        content:
          content.trim(),

        rating,
      });

      navigate("/reviews", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "리뷰 등록 실패:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        setError(
          "로그인이 필요합니다."
        );
      } else if (
        error.response?.status ===
        403
      ) {
        setError(
          error.response?.data
            ?.error ||
            "구매한 상품에 대해서만 리뷰를 작성할 수 있습니다."
        );
      } else {
        setError(
          error.response?.data
            ?.error ||
            "리뷰 등록에 실패했습니다."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="review-write-page">
        <div className="container">
          <AppHeader
            title="리뷰 작성"
            back
            actions={false}
          />

          <main className="empty-state">
            <strong>
              상품 정보를
              불러오는 중...
            </strong>
          </main>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="review-write-page">
        <div className="container">
          <AppHeader
            title="리뷰 작성"
            back
            actions={false}
          />

          <main className="empty-state">
            <span>!</span>

            <strong>
              리뷰를 작성할 상품을
              찾을 수 없어요
            </strong>

            <p>{error}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="review-write-page">
      <div className="container">
        <AppHeader
          title="리뷰 작성"
          back
          actions={false}
        />

        <main className="review-write">
          <section className="review-write__product">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="review-write__image-placeholder">
                이미지 준비 중
              </div>
            )}

            <div>
              <strong>
                {product.brand}
              </strong>

              <p>
                {product.name}
              </p>

              <span>
                구매 상품
              </span>
            </div>
          </section>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <section className="review-write__rating">
              <h2>
                상품은
                어떠셨나요?
              </h2>

              <p>
                별점을 선택해
                주세요.
              </p>

              <div>
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (score) => (
                    <button
                      type="button"
                      key={
                        score
                      }
                      className={
                        score <=
                        rating
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setRating(
                          score
                        )
                      }
                      aria-label={`${score}점`}
                    >
                      ★
                    </button>
                  )
                )}
              </div>
            </section>

            <section className="review-write__content">
              <h2>
                상품 후기를
                작성해 주세요
              </h2>

              <p>
                실제 구매 경험을
                바탕으로 솔직한
                리뷰를 남겨주세요.
              </p>

              <textarea
                value={content}
                onChange={(
                  event
                ) => {
                  setContent(
                    event.target
                      .value
                  );

                  if (error) {
                    setError(
                      ""
                    );
                  }
                }}
                maxLength="500"
                placeholder="상품에 대한 솔직한 후기를 10자 이상 남겨주세요."
              />

              <span>
                {content.length} /
                500
              </span>
            </section>

            {error && (
              <p className="review-write__error">
                {error}
              </p>
            )}

            <button
              className="review-write__submit"
              type="submit"
              disabled={
                submitting ||
                !rating ||
                content.trim()
                  .length < 10
              }
            >
              {submitting
                ? "리뷰 등록 중..."
                : "리뷰 등록"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ReviewWrite;