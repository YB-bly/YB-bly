import {
  useEffect,
  useState,
} from "react";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";

import {
  useNavigate,
} from "../router-hooks";

import {
  getProducts,
} from "../api/productApi";

import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../api/wishlistApi";

import fast from "../assets/img/home/fast.png";
import live from "../assets/img/home/live.png";
import cate3 from "../assets/img/home/cate3.png";
import cate4 from "../assets/img/home/cate4.png";
import cate5 from "../assets/img/home/cate5.png";
import cate6 from "../assets/img/home/cate6.png";

import sl1 from "../assets/img/home/sl1.png";
import sl2 from "../assets/img/home/sl2.png";
import sl3 from "../assets/img/home/sl3.png";
import sl4 from "../assets/img/home/sl4.png";
import sl5 from "../assets/img/home/sl5.png";

const slides = [
  {
    id: 1,
    image: sl2,
    subTitle: "YB-BLY 단독",
    title: "첫 주 더블 쿠폰",
    description:
      "최대 87% 할인 혜택",
  },
  {
    id: 2,
    image: sl1,
    subTitle: "SUMMER SALE",
    title: "여름 인기 상품 할인",
    description:
      "지금 최대 60% 할인",
  },
  {
    id: 3,
    image: sl3,
    subTitle: "오늘만 특가",
    title: "24시간 한정 할인",
    description:
      "놓치면 다시 없는 가격",
  },
  {
    id: 4,
    image: sl4,
    subTitle: "NEW ARRIVAL",
    title: "휴가를 위한 준비",
    description:
      "가장 먼저 만나보세요",
  },
  {
    id: 5,
    image: sl5,
    subTitle:
      "뷰티 디바이스까지",
    title: "배송비 없이 쇼핑",
    description:
      "YB-BLY 추천 상품",
  },
];

const categories = [
  {
    id: 1,
    name: "빠른배송",
    image: fast,
  },
  {
    id: 2,
    name: "라이브",
    image: live,
  },
  {
    id: 3,
    name: "뷰티",
    image: cate3,
  },
  {
    id: 4,
    name: "상의",
    image: cate4,
  },
  {
    id: 5,
    name: "원피스",
    image: cate6,
  },
  {
    id: 6,
    name: "하의",
    image: cate5,
  },
];

const MainHome = () => {
  const navigate =
    useNavigate();

  const [
    slideIndex,
    setSlideIndex,
  ] = useState(0);

  const [
    likedItems,
    setLikedItems,
  ] = useState([]);

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setSlideIndex(
          (prev) =>
            (prev + 1) %
            slides.length
        );
      }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchHomeData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const productData =
            await getProducts();

          setProducts(
            productData.slice(0, 6)
          );

          /*
           * 찜 API는 로그인 사용자만 사용 가능.
           * 비로그인 401은 상품 조회 실패로
           * 처리하지 않는다.
           */
          try {
            const wishlistData =
              await getWishlist();

            setLikedItems(
              wishlistData.map(
                (item) =>
                  Number(item.id)
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
                "홈 찜 목록 조회 실패:",
                wishlistError
              );
            }

            setLikedItems([]);
          }
        } catch (error) {
          console.error(
            "홈 상품 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "추천 상품을 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchHomeData();
  }, []);

  const handlePrevSlide = () => {
    setSlideIndex(
      (prev) =>
        prev === 0
          ? slides.length - 1
          : prev - 1
    );
  };

  const handleNextSlide = () => {
    setSlideIndex(
      (prev) =>
        (prev + 1) %
        slides.length
    );
  };

  const handleLike = async (
    productId
  ) => {
    const normalizedId =
      Number(productId);

    const isLiked =
      likedItems.includes(
        normalizedId
      );

    try {
      if (isLiked) {
        await removeWishlistItem(
          normalizedId
        );

        setLikedItems(
          (current) =>
            current.filter(
              (id) =>
                id !==
                normalizedId
            )
        );
      } else {
        await addWishlistItem(
          normalizedId
        );

        setLikedItems(
          (current) =>
            current.includes(
              normalizedId
            )
              ? current
              : [
                  ...current,
                  normalizedId,
                ]
        );
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
    }
  };

  return (
    <div className="home_wrap">
      <div className="container">
        <AppHeader />

        <main className="home_main">
          <section
            className="slider"
            aria-label="홈 배너"
          >
            <div
              className="slide_track"
              style={{
                transform: `translateX(-${
                  slideIndex * 100
                }%)`,
              }}
            >
              {slides.map(
                (slide) => (
                  <article
                    className="slide"
                    key={slide.id}
                  >
                    <img
                      src={
                        slide.image
                      }
                      alt={
                        slide.title
                      }
                      className="slide_img"
                    />

                    <div className="slide_dim" />

                    <div className="slide_text">
                      <span>
                        {
                          slide.subTitle
                        }
                      </span>

                      <h2>
                        {
                          slide.title
                        }
                      </h2>

                      <p>
                        {
                          slide.description
                        }
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>

            <button
              type="button"
              className="slide_btn prev"
              aria-label="이전 슬라이드"
              onClick={
                handlePrevSlide
              }
            >
              ‹
            </button>

            <button
              type="button"
              className="slide_btn next"
              aria-label="다음 슬라이드"
              onClick={
                handleNextSlide
              }
            >
              ›
            </button>

            <div className="slide_count">
              {slideIndex + 1} /{" "}
              {slides.length}
            </div>

            <div className="slide_dots">
              {slides.map(
                (
                  slide,
                  index
                ) => (
                  <button
                    type="button"
                    key={slide.id}
                    className={
                      index ===
                      slideIndex
                        ? "active"
                        : ""
                    }
                    aria-label={`${
                      index + 1
                    }번째 슬라이드 보기`}
                    onClick={() =>
                      setSlideIndex(
                        index
                      )
                    }
                  />
                )
              )}
            </div>
          </section>

          <section
            className="home_category scroll-hidden"
            aria-label="상품 카테고리"
          >
            <div className="category_inner">
              {categories.map(
                (category) => (
                  <button
                    type="button"
                    className="category"
                    key={
                      category.id
                    }
                  >
                    <div className="category_img">
                      <img
                        src={
                          category.image
                        }
                        alt={
                          category.name
                        }
                      />
                    </div>

                    <p>
                      {
                        category.name
                      }
                    </p>
                  </button>
                )
              )}
            </div>
          </section>

          <section className="recommend">
            <div className="recommend_head">
              <h2>
                당신을 위한 추천
                아이템
              </h2>
            </div>

            {loading ? (
              <div className="empty-state">
                <strong>
                  상품을 불러오는
                  중...
                </strong>
              </div>
            ) : error ? (
              <div className="empty-state">
                <span>!</span>

                <strong>
                  {error}
                </strong>
              </div>
            ) : products.length >
              0 ? (
              <div className="items">
                {products.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                      liked={likedItems.includes(
                        Number(
                          product.id
                        )
                      )}
                      onLike={() =>
                        handleLike(
                          product.id
                        )
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="empty-state">
                <strong>
                  등록된 상품이
                  없어요.
                </strong>
              </div>
            )}
          </section>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default MainHome;