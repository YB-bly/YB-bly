import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import { getRecentProducts } from "../data/shopRepository";

const RecentProducts = () => {
  const products = getRecentProducts();
  return <div className="utility-page"><div className="container"><AppHeader title="최근 본 상품" back /><main className="utility-content"><div className="utility-heading"><h1>최근 본 상품</h1><span>최대 20개까지 저장돼요.</span></div>{products.length ? <section className="product-grid">{products.map((product) => <ProductCard product={product} key={product.id} />)}</section> : <section className="empty-state"><span>◎</span><strong>최근 본 상품이 없어요</strong><p>상품을 둘러보면 여기에 표시됩니다.</p></section>}</main><BottomNavigation /></div></div>;
};
export default RecentProducts;
