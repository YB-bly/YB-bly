import React from "react";

const categories = [
  {
    id: 1,
    name: "직진배송",
    image:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "뷰티",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "상의",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "원피스",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 5,
    name: "바지",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 6,
    name: "스커트",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=200&q=80",
  },
];

const products = [
  {
    id: 1,
    brand: "유니클로",
    name: "[BEST] 와이드 데님 커브 진",
    discount: "15%",
    price: "63,320",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    brand: "애드모어",
    name: "[라이브 앵콜세일] MADE 와이드 데님",
    discount: "44%",
    price: "21,560",
    image:
      "https://images.unsplash.com/photo-1548624149-f6c97f5b36d5?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    brand: "라피타",
    name: "라스트찬스 홈케어 뷰티 디바이스",
    discount: "59%",
    price: "106,480",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85",
  },
];

const Home = () => {
  return (
    <div className="container">
      <div className="home">
        <header className="home-header">
          <h1 className="home-logo">YB-bly</h1>

          <div className="home-header-actions">
            <button
              type="button"
              className="home-header-button"
              aria-label="이미지 검색"
            >
              ◎
            </button>

            <button
              type="button"
              className="home-header-button"
              aria-label="검색"
            >
              ⌕
            </button>

            <button
              type="button"
              className="home-header-button"
              aria-label="장바구니"
            >
              ♧
            </button>
          </div>
        </header>

        <main className="home-main">
          <section className="home-banner">
            <img
              className="home-banner-image"
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1300&q=90"
              alt="여름 뷰티 상품"
            />

            <div className="home-banner-content">
              <h2 className="home-banner-title">
                수분감 차오르는 여름
                <br />
                YB-bly 뷰티로 케어
              </h2>

              <p className="home-banner-description">
                최대 50% 할인 + 마스크팩 증정
              </p>
            </div>

            <span className="home-banner-count">27 | 46</span>
          </section>

          <section className="home-category-section">
            <ul className="home-category-list scroll-hidden">
              {categories.map((category) => (
                <li className="home-category-item" key={category.id}>
                  <div className="home-category-image">
                    <img src={category.image} alt="" />
                  </div>

                  <span className="home-category-name">{category.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="home-product-section">
            <h2 className="home-section-title">
              당신을 위한 추천 아이템
            </h2>

            <div className="home-product-list">
              {products.map((product) => (
                <article className="home-product-card" key={product.id}>
                  <div className="home-product-image">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="home-product-info">
                    <h3 className="home-product-brand">{product.brand}</h3>

                    <p className="home-product-name">{product.name}</p>

                    <div className="home-product-price">
                      <span className="home-product-discount">
                        {product.discount}
                      </span>

                      <span>{product.price}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <nav className="bottom-navigation">
          <button type="button" className="bottom-navigation-item">
            <span className="bottom-navigation-icon">Y</span>
            <span>홈</span>
          </button>

          <button type="button" className="bottom-navigation-item">
            <span className="bottom-navigation-icon">☰</span>
            <span>카테고리</span>
          </button>

          <button type="button" className="bottom-navigation-item">
            <span className="bottom-navigation-icon">♡</span>
            <span>찜</span>
          </button>

          <button type="button" className="bottom-navigation-item">
            <span className="bottom-navigation-icon">♙</span>
            <span>마이페이지</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Home;