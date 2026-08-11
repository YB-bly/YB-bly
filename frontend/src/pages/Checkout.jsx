import { useState } from "react";
import { useNavigate } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import { formatPrice } from "../data/products";
import { clearCheckout, getCheckout, saveCart, saveMockOrder } from "../data/shopStorage";
import { markCouponUsed } from "../data/shopRepository";

const Checkout = () => {
  const navigate = useNavigate();
  const checkout = getCheckout();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePayment = (event) => {
    event.preventDefault();
    if (!checkout?.items?.length) {
      setError("결제할 상품이 없습니다. 장바구니에서 다시 진행해 주세요.");
      return;
    }
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    if (!["name", "phone", "address"].every((key) => form.get(key)?.trim())) {
      setError("배송지 정보를 모두 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    const now = Date.now();
    const order = {
      id: now,
      number: `20260806-${String(now).slice(-5)}`,
      date: new Date().toLocaleDateString("ko-KR").replace(/\. /g, ".").replace(".", ""),
      status: "결제완료",
      product: checkout.items[0].product,
      items: checkout.items,
      option: checkout.items[0].option,
      quantity: checkout.items.reduce((sum, item) => sum + item.quantity, 0),
      recipient: form.get("name"),
      phone: form.get("phone"),
      address: form.get("address"),
      subtotal: checkout.subtotal,
      discount: checkout.discount,
      total: checkout.total,
      coupon: checkout.coupon,
      paymentMethod,
    };
    saveMockOrder(order);
    if (checkout.coupon?.id) markCouponUsed(checkout.coupon.id);
    saveCart([]);
    clearCheckout();
    navigate(`/payment/complete?order=${order.id}`, { replace: true });
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <AppHeader title="주문 및 결제" back actions={false} />
        <form className="checkout" onSubmit={handlePayment}>
          <section className="checkout__section"><h2>배송지 정보</h2><label>받는 분<input name="name" defaultValue="테스트 사용자" /></label><label>연락처<input name="phone" defaultValue="010-0000-0000" inputMode="tel" /></label><label>주소<input name="address" defaultValue="서울특별시 테스트구 예시로 00" /></label><label className="checkout__memo">배송 요청사항<select name="memo"><option>문 앞에 놓아주세요</option><option>배송 전 연락해 주세요</option><option>직접 입력</option></select></label></section>
          <section className="checkout__section"><h2>주문 상품</h2>{checkout?.items?.map((item) => <div className="checkout-product" key={item.id}><img src={item.product.image} alt={item.product.name} /><div><strong>{item.product.brand}</strong><p>{item.product.name}</p><span>{item.option} · {item.quantity}개</span><b>{formatPrice(item.product.price * item.quantity)}</b></div></div>)}</section>
          <section className="checkout__section"><h2>결제 수단</h2><div className="checkout__payments">{[{ id: "card", label: "신용·체크카드" }, { id: "bank", label: "무통장 입금" }, { id: "mock", label: "YB 간편결제" }].map((method) => <button className={paymentMethod === method.id ? "is-selected" : ""} type="button" key={method.id} onClick={() => setPaymentMethod(method.id)}>{method.label}</button>)}</div><p className="checkout__mock-notice">실제 결제는 발생하지 않으며, 결제 버튼을 누르면 주문 상태만 ‘결제완료’로 변경됩니다.</p></section>
          <section className="checkout__section checkout__total"><h2>최종 결제 금액</h2><dl><dt>상품 금액</dt><dd>{formatPrice(checkout?.subtotal ?? 0)}</dd><dt>쿠폰 할인</dt><dd>-{formatPrice(checkout?.discount ?? 0)}</dd><dt>총 결제 금액</dt><dd>{formatPrice(checkout?.total ?? 0)}</dd></dl></section>
          {error && <p className="checkout__error">{error}</p>}
          <div className="checkout__submit"><button type="submit" disabled={submitting}>{submitting ? "주문 처리 중…" : `${formatPrice(checkout?.total ?? 0)} 모의 결제하기`}</button></div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
