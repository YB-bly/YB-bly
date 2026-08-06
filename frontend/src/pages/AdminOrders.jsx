import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { formatPrice } from "../data/products";
import { adminOrders } from "../data/adminData";
import { getMockOrders, updateMockOrderStatus } from "../data/shopStorage";

const statuses = ["결제완료", "배송준비", "배송중", "배송완료", "취소"];

const AdminOrders = () => {
  const [orders, setOrders] = useState(() => [...getMockOrders(), ...adminOrders]);
  const changeStatus = (orderId, status) => { setOrders(orders.map((order) => order.id === orderId ? { ...order, status } : order)); updateMockOrderStatus(orderId, status); };
  return <div className="admin-orders-page admin-page"><div className="container"><AdminHeader title="주문 관리" back /><main className="admin-orders"><div className="admin-orders__filters"><button className="is-active" type="button">전체 {orders.length}</button>{statuses.slice(0, 4).map((status) => <button type="button" key={status}>{status}</button>)}</div><section className="admin-orders__list">{orders.map((order) => <article key={order.id}><header><div><strong>{order.number}</strong><span>{order.date} · {order.customer ?? order.recipient}</span></div><select aria-label={`${order.number} 주문 상태`} value={order.status} onChange={(event) => changeStatus(order.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></header><div className="admin-order-product"><img src={order.product.image} alt={order.product.name} /><div><strong>{order.product.name}</strong><span>{order.option} · {order.quantity ?? 1}개</span><b>{formatPrice(order.total ?? order.amount ?? order.product.price)}</b></div></div><footer><span>주문 내부번호 #{order.id}</span><button type="button">상세 조회</button></footer></article>)}</section></main><AdminBottomNavigation /></div></div>;
};

export default AdminOrders;
