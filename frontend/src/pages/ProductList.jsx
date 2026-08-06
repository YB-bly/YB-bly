import { useState } from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useSearchParams } from "../router-hooks";

const categories = ["전체", "상의", "아우터", "팬츠/스커트", "가방", "슈즈"];

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const requestedSubcategory = searchParams.get("subcategory");
  const [category, setCategory] = useState(requestedCategory || "전체");
  const [sort, setSort] = useState("추천순");
  const filteredProducts = products.filter((product) => {
    if (requestedSubcategory) return product.subcategory === requestedSubcategory;
    if (requestedCategory) return product.category === requestedCategory;
    if (category !== "전체") return product.category === category;
    return true;
  });
  const pageTitle = requestedSubcategory || requestedCategory || "상품";

  return (
    <div className="product-list-page">
      <div className="container">
        <AppHeader title={pageTitle} back />
        <main className="product-list">
          <section className="product-list__hero">
            <p>SUMMER EDIT</p>
            <h2>가볍고 선명한<br />여름의 옷장</h2>
            <span>최대 30% 할인</span>
          </section>

          {!requestedCategory && <div className="chip-list scroll-hidden">
            {categories.map((item) => (
              <button className={`chip${category === item ? " chip--active" : ""}`} key={item} type="button" onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>}

          <div className="product-list__toolbar">
            <strong>총 {filteredProducts.length}개</strong>
            <select aria-label="상품 정렬" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>추천순</option><option>낮은 가격순</option><option>리뷰 많은순</option>
            </select>
          </div>

          {filteredProducts.length > 0 ? <section className="product-grid" aria-label={`${pageTitle} 상품 목록`}>
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </section> : <section className="empty-state"><span>!</span><strong>등록된 상품이 아직 없어요</strong><p>{pageTitle} 상품을 준비하고 있습니다.</p></section>}
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ProductList;
