import { Link } from "../router";
import { useSearchParams } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import { formatPrice } from "../data/products";
import { getMockOrders } from "../data/shopStorage";

const PaymentComplete = () => {
  const [searchParams] = useSearchParams();
  const order = getMockOrders().find((item) => String(item.id) === searchParams.get("order"));

  return (
    <div className="payment-complete-page">
      <div className="container">
        <AppHeader title="주문 완료" actions={false} />
        <main className="payment-complete">
          <div className="payment-complete__icon">✓</div><h1>모의 결제가 완료됐어요</h1><p>실제 금액은 결제되지 않았습니다.<br />주문 상태가 결제완료로 변경됐어요.</p>
          {order && <section><dl><dt>주문번호</dt><dd>{order.number}</dd><dt>결제 금액</dt><dd><strong>{formatPrice(order.total)}</strong></dd><dt>배송지</dt><dd>{order.address}</dd></dl></section>}
          <div className="payment-complete__actions"><Link to="/orders">주문 내역 보기</Link><Link to="/">쇼핑 계속하기</Link></div>
        </main>
      </div>
    </div>
  );
};

export default PaymentComplete;
