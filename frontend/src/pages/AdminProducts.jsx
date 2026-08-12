import { useState } from "react";
import { Link } from "../router";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { formatPrice } from "../data/products";
import { getManagedProducts } from "../data/shopRepository";
import Pagination from "../components/Pagination";

const AdminProducts = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("전체 상태");
  const [page, setPage] = useState(1);
  const products = getManagedProducts();
  const filtered = products.filter((product) => `${product.brand} ${product.name} ${(product.tags ?? []).join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (status === "전체 상태" || product.status === status));
  return <div className="admin-products-page admin-page"><div className="container"><AdminHeader title="상품 관리" back /><main className="admin-products"><div className="admin-search"><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="상품명, 브랜드 또는 태그 검색" /><Link to="/admin/products/upload">+ 상품 등록</Link></div><div className="admin-products__summary"><strong>전체 상품 {products.length}</strong><select aria-label="판매 상태" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option>전체 상태</option><option>판매중</option><option>품절</option><option>판매중지</option></select></div><section className="admin-products__list">{filtered.slice((page - 1) * 5, page * 5).map((product) => <article key={product.id}><img src={product.image} alt={product.name} /><div><span>{product.brand}</span><strong>{product.name}</strong><p>{formatPrice(product.price)} · 재고 {product.stock}</p><div className="admin-products__tags">{[product.badge, ...(product.tags ?? [])].filter(Boolean).map((tag) => <small key={tag}>#{tag}</small>)}</div><em className={product.status !== "판매중" ? "is-soldout" : ""}>{product.status}</em></div><Link className="admin-products__manage" to={`/admin/products/${product.id}/edit`}>관리</Link></article>)}</section>{filtered.length === 0 && <section className="empty-state"><span>!</span><strong>조건에 맞는 상품이 없어요</strong></section>}<Pagination page={page} total={filtered.length} onChange={setPage} /></main><AdminBottomNavigation /></div></div>;
};

export default AdminProducts;
