import { useState } from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const categories = ["전체", "상의", "하의", "원피스", "가방", "신발"];

const ProductList = () => {
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState("추천순");

  return (
    <div className="product-list-page">
      <div className="container">
        <AppHeader title="상품" />
        <main className="product-list">
          <section className="product-list__hero">
            <p>SUMMER EDIT</p>
            <h2>가볍고 선명한<br />여름의 옷장</h2>
            <span>최대 30% 할인</span>
          </section>

          <div className="chip-list scroll-hidden">
            {categories.map((item) => (
              <button className={`chip${category === item ? " chip--active" : ""}`} key={item} type="button" onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>

          <div className="product-list__toolbar">
            <strong>총 {products.length}개</strong>
            <select aria-label="상품 정렬" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>추천순</option><option>낮은 가격순</option><option>리뷰 많은순</option>
            </select>
          </div>

          <section className="product-grid" aria-label={`${category} 상품 목록`}>
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </section>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ProductList;
