import { useState } from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { getManagedCategories, getManagedProducts } from "../data/shopRepository";
import { useSearchParams } from "../router-hooks";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const requestedSubcategory = searchParams.get("subcategory");
  const [category, setCategory] = useState(requestedCategory || "전체");
  const [sort, setSort] = useState("추천순");
  const [page, setPage] = useState(1);
  const categories = ["전체", ...getManagedCategories().filter((item) => item.visible).map((item) => item.name)];
  const filteredProducts = getManagedProducts().filter((product) => {
    if (product.status === "판매중지") return false;
    if (requestedSubcategory) return product.subcategory === requestedSubcategory;
    if (requestedCategory) return product.category === requestedCategory;
    if (category !== "전체") return product.category === category;
    return true;
  }).sort((a, b) => sort === "낮은 가격순" ? a.price - b.price : sort === "리뷰 많은순" ? b.reviews - a.reviews : b.rating - a.rating);
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
              <button className={`chip${category === item ? " chip--active" : ""}`} key={item} type="button" onClick={() => { setCategory(item); setPage(1); }}>{item}</button>
            ))}
          </div>}

          <div className="product-list__toolbar">
            <strong>총 {filteredProducts.length}개</strong>
            <select aria-label="상품 정렬" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
              <option>추천순</option><option>낮은 가격순</option><option>리뷰 많은순</option>
            </select>
          </div>

          {filteredProducts.length > 0 ? <section className="product-grid" aria-label={`${pageTitle} 상품 목록`}>
            {filteredProducts.slice((page - 1) * 6, page * 6).map((product) => <ProductCard key={product.id} product={product} />)}
          </section> : <section className="empty-state"><span>!</span><strong>등록된 상품이 아직 없어요</strong><p>{pageTitle} 상품을 준비하고 있습니다.</p></section>}
          <Pagination page={page} total={filteredProducts.length} pageSize={6} onChange={setPage} />
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ProductList;
