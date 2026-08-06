import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const Wishlist = () => (
  <div className="wishlist-page">
    <div className="container">
      <AppHeader title="찜" />
      <main className="wishlist">
        <div className="wishlist__heading"><h2>찜한 상품</h2><span>{products.slice(0, 4).length}개</span></div>
        <section className="product-grid" aria-label="찜한 상품 목록">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} liked />)}
        </section>
      </main>
      <BottomNavigation />
    </div>
  </div>
);

export default Wishlist;
