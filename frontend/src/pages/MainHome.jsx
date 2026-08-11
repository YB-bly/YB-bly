import { useEffect, useState } from "react";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";

import item1 from "../assets/img/home/item1.png";
import item2 from "../assets/img/home/item2.png";
import item3 from "../assets/img/home/item3.png";
import item4 from "../assets/img/home/item4.png";
import item5 from "../assets/img/home/item5.png";
import item6 from "../assets/img/home/item6.png";

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
    description: "최대 87% 할인 혜택",
  },
  {
    id: 2,
    image: sl1,
    subTitle: "SUMMER SALE",
    title: "여름 인기 상품 할인",
    description: "지금 최대 60% 할인",
  },
  {
    id: 3,
    image: sl3,
    subTitle: "오늘만 특가",
    title: "24시간 한정 할인",
    description: "놓치면 다시 없는 가격",
  },
  {
    id: 4,
    image: sl4,
    subTitle: "NEW ARRIVAL",
    title: "휴가를 위한 준비",
    description: "가장 먼저 만나보세요",
  },
  {
    id: 5,
    image: sl5,
    subTitle: "뷰티 디바이스까지",
    title: "배송비 없이 쇼핑",
    description: "YB-BLY 추천 상품",
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
    name: "바지",
    image: cate5,
  },
];

const products = [
  {
    id: 1,
    image: item1,
    brand: "융보와요",
    name: "(최단일) 미엘 클라라 블라우스 원피스",
    discount: 20,
    price: 44650,
    badge: "빠른출고",
    rating: "4.9",
    reviews: "24",
  },
  {
    id: 2,
    image: item2,
    brand: "융로우먼트",
    name: "[여름바지/3기장선택] 와이드 밴딩 팬츠",
    discount: 51,
    price: 26520,
    badge: "오늘출발",
    rating: "4.8",
    reviews: "47,566",
  },
  {
    id: 3,
    image: item3,
    brand: "융프라와우",
    name: "여름 찰랑 와우 감탄사 절로나와 셔츠",
    discount: 36,
    price: 49900,
    badge: "빠른배송",
    rating: "4.9",
    reviews: "23,298",
  },
  {
    id: 4,
    image: item4,
    brand: "융어데이",
    name: "여름 시스루 루즈핏 체크 셔츠",
    discount: 18,
    price: 32800,
    badge: "단독상품",
    rating: "4.7",
    reviews: "1,203",
  },
  {
    id: 5,
    image: item5,
    brand: "융티랩",
    name: "하늘하늘 날아갈지도 몰라 블라우스",
    discount: 30,
    price: 39900,
    badge: "하루특가",
    rating: "4.8",
    reviews: "7,624",
  },
  {
    id: 6,
    image: item6,
    brand: "융랙무드",
    name: "시원한 여름 청바지 이거야 이거",
    discount: 25,
    price: 29900,
    badge: "빠른출고",
    rating: "4.9",
    reviews: "842",
  },
];

const MainHome = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const handlePrevSlide = () => {
    setSlideIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleLike = (productId) => {
    setLikedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="home_wrap">
      <div className="container">
        <AppHeader />

        <main className="home_main">
          <section className="slider" aria-label="홈 배너">
            <div
              className="slide_track"
              style={{
                transform: `translateX(-${slideIndex * 100}%)`,
              }}
            >
              {slides.map((slide) => (
                <article className="slide" key={slide.id}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="slide_img"
                  />

                  <div className="slide_dim" />

                  <div className="slide_text">
                    <span>{slide.subTitle}</span>
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="slide_btn prev"
              aria-label="이전 슬라이드"
              onClick={handlePrevSlide}
            >
              ‹
            </button>

            <button
              type="button"
              className="slide_btn next"
              aria-label="다음 슬라이드"
              onClick={handleNextSlide}
            >
              ›
            </button>

            <div className="slide_count">
              {slideIndex + 1} / {slides.length}
            </div>

            <div className="slide_dots">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.id}
                  className={index === slideIndex ? "active" : ""}
                  aria-label={`${index + 1}번째 슬라이드 보기`}
                  onClick={() => setSlideIndex(index)}
                />
              ))}
            </div>
          </section>

          <section
            className="home_category scroll-hidden"
            aria-label="상품 카테고리"
          >
            <div className="category_inner">
              {categories.map((category) => (
                <button
                  type="button"
                  className="category"
                  key={category.id}
                >
                  <div className="category_img">
                    <img
                      src={category.image}
                      alt={category.name}
                    />
                  </div>

                  <p>{category.name}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="recommend">
            <div className="recommend_head">
              <h2>당신을 위한 추천 아이템</h2>
            </div>

            <div className="items">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  liked={likedItems.includes(product.id)}
                  onLike={() => handleLike(product.id)}
                />
              ))}
            </div>
          </section>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default MainHome;