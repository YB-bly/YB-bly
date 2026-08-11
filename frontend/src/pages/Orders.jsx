import { useState } from "react";
import { Link } from "../router";
import { useNavigate } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import { orders as orderItems } from "../data/orders";
import { formatPrice } from "../data/products";
import { addCartItem, getMockOrders } from "../data/shopStorage";

const Orders = () => {
  const orders = [...getMockOrders(), ...orderItems];
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(null);
  const [period, setPeriod] = useState("90");
  const repurchase = (order) => { addCartItem(order.product, order.option, order.quantity ?? 1); navigate("/cart"); };
  const visibleOrders = period === "all" ? orders : orders.filter((order) => new Date(order.date.replaceAll(".", "-")) >= new Date(Date.now() - Number(period) * 86400000));

  return (
  <div className="orders-page">
    <div className="container">
      <AppHeader title="주문 내역" back actions={false} />
      <main className="orders">
        <div className="orders__filter"><select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="주문 조회 기간"><option value="30">최근 1개월</option><option value="90">최근 3개월</option><option value="365">최근 1년</option><option value="all">전체 기간</option></select><span>총 {visibleOrders.length}건</span></div>
        <div className="orders__list">
          {visibleOrders.map((order) => (
            <article className="order-card" key={order.number}>
              <header><div><time>{order.date}</time><span>주문번호 {order.number}</span></div><Link to={`/orders/${order.id}`}>주문 상세 ›</Link></header>
              <strong className="order-card__status">{order.status}</strong>
              <div className="order-card__product">
                <img src={order.product.image} alt={order.product.name} />
                <div><strong>{order.product.brand}</strong><p>{order.product.name}</p><span>{order.option} · {order.quantity ?? 1}개</span><b>{formatPrice(order.total ?? order.product.price)}</b></div>
              </div>
              <div className="order-card__actions">
                {order.status === "배송완료" ? <Link to={`/reviews/write?product=${order.product.id}`}>리뷰 작성</Link> : <button type="button" onClick={() => setTracking(order)}>배송 조회</button>}
                <button type="button" onClick={() => repurchase(order)}>재구매</button>
              </div>
            </article>
          ))}
        </div>
        {tracking && <section className="orders__tracking" role="dialog" aria-modal="true"><div><header><div><strong>배송 조회</strong><span>{tracking.number}</span></div><button type="button" onClick={() => setTracking(null)} aria-label="배송 조회 닫기">×</button></header><p>{tracking.product.name}</p><ol>{["상품 준비", "집화 완료", "배송 중", "배송 완료"].map((step, index) => { const activeIndex = tracking.status === "배송완료" ? 3 : tracking.status === "배송중" ? 2 : tracking.status === "배송준비" ? 0 : 0; return <li className={index <= activeIndex ? "is-active" : ""} key={step}><b>{index + 1}</b><span>{step}</span></li>; })}</ol><small>모의 배송 정보이며 실제 택배사 조회가 아닙니다.</small></div></section>}
      </main>
    </div>
  </div>
  );
};

export default Orders;
