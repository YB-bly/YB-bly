import { useMemo, useState } from "react";
import { Link } from "../router";
import AppHeader from "../components/AppHeader";
import { formatPrice } from "../data/products";
import { getCart, saveCart, saveCheckout } from "../data/shopStorage";

const coupons = {
  WELCOME10: { label: "첫 구매 10% 할인", rate: 0.1 },
  ONCE20: { label: "1회 한정 20% 할인", rate: 0.2 },
};

const Cart = () => {
  const [items, setItems] = useState(getCart);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
  const discount = coupon ? Math.floor(subtotal * coupon.rate) : 0;
  const total = Math.max(0, subtotal - discount);

  const updateItems = (next) => {
    setItems(next);
    saveCart(next);
  };

  const updateQuantity = (id, nextQuantity) => {
    if (nextQuantity < 1 || nextQuantity > 20) return;
    updateItems(items.map((item) => item.id === id ? { ...item, quantity: nextQuantity } : item));
  };

  const applyCoupon = () => {
    const found = coupons[couponInput.trim().toUpperCase()];
    if (!found) {
      setCoupon(null);
      setCouponMessage("사용할 수 없는 쿠폰이에요.");
      return;
    }
    setCoupon(found);
    setCouponMessage(`${found.label} 쿠폰이 적용됐어요.`);
  };

  const prepareCheckout = () => saveCheckout({ items, coupon: coupon ? { ...coupon, code: couponInput.trim().toUpperCase() } : null, subtotal, discount, total });

  return (
    <div className="cart-page">
      <div className="container">
        <AppHeader title="장바구니" back actions={false} />
        <main className="cart">
          {items.length === 0 ? (
            <section className="empty-state"><span>🛍</span><strong>장바구니가 비어 있어요</strong><p>마음에 드는 상품을 담아보세요.</p><Link className="cart__empty-link" to="/products">상품 보러 가기</Link></section>
          ) : (
            <>
              <section className="cart__items">
                <div className="cart__section-title"><h2>상품 {items.length}개</h2><button type="button" onClick={() => updateItems([])}>전체 삭제</button></div>
                {items.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="cart-item__body">
                      <button className="cart-item__remove" type="button" aria-label={`${item.product.name} 삭제`} onClick={() => updateItems(items.filter((cartItem) => cartItem.id !== item.id))}>×</button>
                      <strong>{item.product.brand}</strong><p>{item.product.name}</p><span>{item.option}</span>
                      <div className="cart-item__bottom"><div className="quantity-control"><button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button><b>{item.quantity}</b><button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>＋</button></div><b>{formatPrice(item.product.price * item.quantity)}</b></div>
                    </div>
                  </article>
                ))}
              </section>
              <section className="cart__coupon">
                <h2>할인 쿠폰</h2><div><input value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="쿠폰 코드를 입력하세요" /><button type="button" onClick={applyCoupon}>적용</button></div>
                {couponMessage && <p className={coupon ? "is-success" : ""}>{couponMessage}</p>}
              </section>
              <section className="cart__summary">
                <h2>결제 금액</h2><dl><dt>상품 금액</dt><dd>{formatPrice(subtotal)}</dd><dt>쿠폰 할인</dt><dd className="is-discount">-{formatPrice(discount)}</dd><dt>배송비</dt><dd>무료</dd><dt>총 결제 금액</dt><dd>{formatPrice(total)}</dd></dl>
              </section>
            </>
          )}
        </main>
        {items.length > 0 && <div className="cart__checkout"><Link to="/checkout" onClick={prepareCheckout}>{formatPrice(total)} 주문하기</Link></div>}
      </div>
    </div>
  );
};

export default Cart;
