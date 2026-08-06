import React from "react";
import { Link } from "../router";
import BottomNavigation from "../components/BottomNavigation";
import AppHeader from "../components/AppHeader";
import mainBannerImage from "../assets/images/home/main-banner.jpg";
import categoryDirectDeliveryImage from "../assets/images/home/category-direct-delivery.jpg";
import categoryBeautyImage from "../assets/images/home/category-beauty.jpg";
import categoryTopImage from "../assets/images/home/category-top.jpg";
import categoryDressImage from "../assets/images/home/category-dress.jpg";
import categoryPantsImage from "../assets/images/home/category-pants.jpg";
import categorySkirtImage from "../assets/images/home/category-skirt.jpg";
import recommendDenimImage from "../assets/images/home/recommend-denim.jpg";
import recommendWideDenimImage from "../assets/images/home/recommend-wide-denim.jpg";
import recommendBeautyDeviceImage from "../assets/images/home/recommend-beauty-device.jpg";

const categories = [
  {
    id: 1,
    name: "직진배송",
    image: categoryDirectDeliveryImage,
  },
  {
    id: 2,
    name: "뷰티",
    image: categoryBeautyImage,
  },
  {
    id: 3,
    name: "상의",
    image: categoryTopImage,
  },
  {
    id: 4,
    name: "원피스",
    image: categoryDressImage,
  },
  {
    id: 5,
    name: "바지",
    image: categoryPantsImage,
  },
  {
    id: 6,
    name: "스커트",
    image: categorySkirtImage,
  },
];

const products = [
  {
    id: 1,
    brand: "유니클로",
    name: "[BEST] 와이드 데님 커브 진",
    discount: "15%",
    price: "63,320",
    image: recommendDenimImage,
  },
  {
    id: 2,
    brand: "애드모어",
    name: "[라이브 앵콜세일] MADE 와이드 데님",
    discount: "44%",
    price: "21,560",
    image: recommendWideDenimImage,
  },
  {
    id: 3,
    brand: "라피타",
    name: "라스트찬스 홈케어 뷰티 디바이스",
    discount: "59%",
    price: "106,480",
    image: recommendBeautyDeviceImage,
  },
];

const Home = () => {
  return (
    <div className="home-page">
      <div className="container">
        <div className="home">
        <AppHeader />

        <main className="home-main">
          <section className="home-banner">
            <img
              className="home-banner-image"
              src={mainBannerImage}
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
                  <Link to={`/products/${product.id}`} className="home-product-image">
                    <img src={product.image} alt={product.name} />
                  </Link>

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

          <BottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default Home;
