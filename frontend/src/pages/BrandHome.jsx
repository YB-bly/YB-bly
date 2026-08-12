import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "../router-hooks";
import { getManagedProducts } from "../data/shopRepository";

const BrandHome = () => { const [params] = useSearchParams(); const brand = params.get("brand") ?? "브랜드"; const products = getManagedProducts().filter((product) => product.brand === brand && product.status !== "판매중지"); return <div className="utility-page"><div className="container"><AppHeader title="브랜드 홈" back /><main><section className="brand-hero"><span>BRAND HOME</span><h1>{brand}</h1><p>{brand}의 상품과 새로운 소식을 한곳에서 만나보세요.</p></section><section className="utility-content"><div className="utility-heading"><h2>전체 상품</h2><span>{products.length}개</span></div>{products.length ? <div className="product-grid">{products.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="empty-state"><span>!</span><strong>판매 중인 상품이 없어요</strong></div>}</section></main><BottomNavigation /></div></div>; };
export default BrandHome;
