import { useState } from "react";
import { Link } from "../router";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { formatPrice } from "../data/products";
import { adminOrders } from "../data/adminData";
import { applyOrderStatus, getMockOrders, updateMockOrderStatus } from "../data/shopStorage";
import Pagination from "../components/Pagination";

const statuses = ["결제완료", "배송준비", "배송중", "배송완료", "취소"];

const AdminOrders = () => {
  const [orders, setOrders] = useState(() => applyOrderStatus([...getMockOrders(), ...adminOrders]));
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);
  const changeStatus = (orderId, status) => { setOrders(orders.map((order) => order.id === orderId ? { ...order, status } : order)); updateMockOrderStatus(orderId, status); };
  const cutoff = period === "all" ? null : new Date(Date.now() - Number(period) * 86400000);
  const visibleOrders = orders.filter((order) => (filter === "전체" || order.status === filter) && (!cutoff || new Date(order.date.replaceAll(".", "-")) >= cutoff) && `${order.number} ${order.customer ?? order.recipient} ${order.product.name}`.toLowerCase().includes(query.toLowerCase()));
  const changeFilters = (setter, value) => { setter(value); setPage(1); };
  return <div className="admin-orders-page admin-page"><div className="container"><AdminHeader title="주문 관리" back /><main className="admin-orders"><div className="admin-orders__search"><input value={query} onChange={(e) => changeFilters(setQuery, e.target.value)} placeholder="주문번호, 주문자 또는 상품 검색" /><select value={period} onChange={(e) => changeFilters(setPeriod, e.target.value)} aria-label="주문 기간"><option value="all">전체 기간</option><option value="30">최근 30일</option><option value="90">최근 90일</option></select></div><div className="admin-orders__filters"><button className={filter === "전체" ? "is-active" : ""} onClick={() => changeFilters(setFilter, "전체")} type="button">전체 {orders.length}</button>{statuses.map((status) => <button className={filter === status ? "is-active" : ""} onClick={() => changeFilters(setFilter, status)} type="button" key={status}>{status} {orders.filter((order) => order.status === status).length}</button>)}</div><section className="admin-orders__list">{visibleOrders.slice((page - 1) * 5, page * 5).map((order) => <article key={order.id}><header><div><strong>{order.number}</strong><span>{order.date} · {order.customer ?? order.recipient}</span></div><select aria-label={`${order.number} 주문 상태`} value={order.status} onChange={(event) => changeStatus(order.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></header><div className="admin-order-product"><img src={order.product.image} alt={order.product.name} /><div><strong>{order.product.name}</strong><span>{order.option} · {order.quantity ?? 1}개</span><b>{formatPrice(order.total ?? order.amount ?? order.product.price)}</b></div></div><footer><span>주문 내부번호 #{order.id}</span><Link to={`/admin/orders/${order.id}`}>상세 조회</Link></footer></article>)}</section>{visibleOrders.length === 0 && <section className="empty-state"><span>!</span><strong>조건에 맞는 주문이 없어요</strong></section>}<Pagination page={page} total={visibleOrders.length} onChange={setPage} /></main><AdminBottomNavigation /></div></div>;
};

export default AdminOrders;
