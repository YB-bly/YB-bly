import { Link } from "../router";
import AppHeader from "../components/AppHeader";
import { orders as orderItems } from "../data/orders";
import { formatPrice } from "../data/products";

const Orders = () => (
  <div className="orders-page">
    <div className="container">
      <AppHeader title="주문 내역" back actions={false} />
      <main className="orders">
        <div className="orders__filter"><button type="button">최근 3개월⌄</button><span>총 {orderItems.length}건</span></div>
        <div className="orders__list">
          {orderItems.map((order) => (
            <article className="order-card" key={order.number}>
              <header><div><time>{order.date}</time><span>주문번호 {order.number}</span></div><Link to={`/orders/${order.id}`}>주문 상세 ›</Link></header>
              <strong className="order-card__status">{order.status}</strong>
              <div className="order-card__product">
                <img src={order.product.image} alt={order.product.name} />
                <div><strong>{order.product.brand}</strong><p>{order.product.name}</p><span>{order.option} · 1개</span><b>{formatPrice(order.product.price)}</b></div>
              </div>
              <div className="order-card__actions">
                {order.status === "배송완료" ? <Link to={`/reviews/write?product=${order.product.id}`}>리뷰 작성</Link> : <button type="button">배송 조회</button>}
                <button type="button">재구매</button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  </div>
);

export default Orders;
