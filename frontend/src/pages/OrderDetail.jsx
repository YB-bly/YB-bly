import AppHeader from "../components/AppHeader";
import { orders } from "../data/orders";
import { formatPrice } from "../data/products";
import { useOrderParams } from "../router-hooks";

const OrderDetail = () => {
  const { orderId } = useOrderParams();
  const order = orders.find((item) => item.id === Number(orderId));

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <AppHeader title="주문 상세" back actions={false} />
          <main className="empty-state"><span>!</span><strong>주문을 찾을 수 없어요</strong><p>주문 번호를 다시 확인해 주세요.</p></main>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <AppHeader title="주문 상세" back actions={false} />
        <main className="order-detail">
          <section className="order-detail__status">
            <span>{order.date} 주문</span><h1>{order.status}</h1><p>상품이 안전하게 이동하고 있어요.</p>
          </section>
          <section className="order-detail__section">
            <h2>주문 상품</h2>
            <div className="order-detail__product"><img src={order.product.image} alt={order.product.name} /><div><strong>{order.product.brand}</strong><p>{order.product.name}</p><span>{order.option} · 1개</span><b>{formatPrice(order.product.price)}</b></div></div>
          </section>
          <section className="order-detail__section">
            <h2>배송지 정보</h2>
            <dl><dt>받는 분</dt><dd>{order.recipient}</dd><dt>연락처</dt><dd>{order.phone}</dd><dt>주소</dt><dd>{order.address}</dd></dl>
          </section>
          <section className="order-detail__section">
            <h2>결제 정보</h2>
            <dl><dt>상품 금액</dt><dd>{formatPrice(order.product.price)}</dd><dt>배송비</dt><dd>0원</dd><dt>총 결제 금액</dt><dd><strong>{formatPrice(order.product.price)}</strong></dd></dl>
          </section>
          <p className="order-detail__number">주문번호 {order.number} · 내부 ID #{order.id}</p>
        </main>
      </div>
    </div>
  );
};

export default OrderDetail;
