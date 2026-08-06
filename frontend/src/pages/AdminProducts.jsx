import { useState } from "react";
import { Link } from "../router";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { formatPrice } from "../data/products";
import { adminProducts } from "../data/adminData";

const AdminProducts = () => {
  const [query, setQuery] = useState("");
  const filtered = adminProducts.filter((product) => `${product.brand} ${product.name}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="admin-products-page admin-page"><div className="container"><AdminHeader title="상품 관리" back /><main className="admin-products"><div className="admin-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="상품명 또는 브랜드 검색" /><Link to="/admin/products/upload">+ 상품 등록</Link></div><div className="admin-products__summary"><strong>전체 상품 {adminProducts.length}</strong><select aria-label="판매 상태"><option>전체 상태</option><option>판매중</option><option>품절</option></select></div><section className="admin-products__list">{filtered.map((product) => <article key={product.id}><img src={product.image} alt={product.name} /><div><span>{product.brand}</span><strong>{product.name}</strong><p>{formatPrice(product.price)} · 재고 {product.stock}</p><em className={product.status === "품절" ? "is-soldout" : ""}>{product.status}</em></div><button type="button">관리</button></article>)}</section></main><AdminBottomNavigation /></div></div>;
};

export default AdminProducts;
