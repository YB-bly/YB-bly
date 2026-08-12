import { useEffect, useMemo, useState } from "react";
import { Link } from "../router";
import { useParams } from "../router-hooks";
import { useNavigate } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import { formatPrice } from "../data/products";
import { addCartItem, saveCheckout } from "../data/shopStorage";
import { addRecentProduct, getManagedProduct, getProductReviews } from "../data/shopRepository";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => getManagedProduct(productId), [productId]);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  useEffect(() => { if (product) addRecentProduct(product.id); }, [product]);

  if (!product || product.status === "판매중지") {
    return <div className="product-detail-page"><div className="container"><AppHeader title="상품 상세" back /><main className="empty-state"><span>!</span><strong>판매 중인 상품을 찾을 수 없어요</strong><p>상품이 삭제되었거나 판매가 종료됐습니다.</p></main></div></div>;
  }
  const reviews = getProductReviews(product.id);
  const sizes = product.sizes?.length ? product.sizes : ["FREE"];
  const soldOut = product.status === "품절" || Number(product.stock) === 0;

  const addToCart = () => {
    addCartItem(product, size, quantity);
    navigate("/cart");
  };

  const buyNow = () => {
    saveCheckout({ items: [{ id: `${product.id}-${size}`, product, option: size, quantity }], coupon: null, subtotal: product.price * quantity, discount: 0, total: product.price * quantity });
    navigate("/checkout");
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <AppHeader back />
        <main className="product-detail">
          <div className="product-detail__visual">
            <img src={product.image} alt={product.name} />
            <span>1 / 4</span>
          </div>
          <section className="product-detail__summary">
            <div className="product-detail__brand"><strong>{product.brand}</strong><Link to={`/brands?brand=${encodeURIComponent(product.brand)}`}>브랜드 홈 →</Link></div>
            <h1>{product.name}</h1>
            <div className="product-detail__rating">★ {product.rating} <u>리뷰 {product.reviews}개</u></div>
            <del>{formatPrice(product.originalPrice)}</del>
            <p className="product-detail__price"><span>{product.discount}%</span>{formatPrice(product.price)}</p>
            <p className="product-detail__benefit">로그인하면 최대 3,400P 적립</p>
          </section>
          <section className="product-detail__delivery">
            <dl><dt>배송</dt><dd><strong>무료배송</strong><br />평균 2일 이내 출고</dd></dl>
            <dl><dt>혜택</dt><dd>YB-bly 첫 구매 10% 쿠폰</dd></dl>
          </section>
          <section className="product-detail__option">
            <h2>사이즈 선택</h2>
            <div>{sizes.map((item) => <button className={size === item ? "is-selected" : ""} type="button" key={item} onClick={() => setSize(item)}>{item}</button>)}</div>
            <div className="product-detail__quantity">
              <span>수량</span>
              <div><button type="button" disabled={quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><strong>{quantity}</strong><button type="button" onClick={() => setQuantity((value) => value + 1)}>＋</button></div>
            </div>
          </section>
          <section className="product-detail__description">
            <h2>상품 정보</h2>
            <p>{product.description}</p>
          </section>
          <section className="product-detail__reviews">
            <div><h2>상품 리뷰 <span>{reviews.length}</span></h2><a href="/reviews">나의 리뷰 보기</a></div>
            {reviews.length ? reviews.map((review) => <article key={review.id}><header><strong>{review.user}</strong><span>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span><time>{review.date}</time></header><p>{review.content}</p>{review.verified && <small>✓ 구매 인증</small>}</article>) : <p className="product-detail__reviews-empty">아직 작성된 리뷰가 없어요.</p>}
          </section>
        </main>
        <div className="purchase-bar">
          <button className={`purchase-bar__like${liked ? " is-liked" : ""}`} type="button" onClick={() => setLiked(!liked)} aria-label="찜하기">{liked ? "♥" : "♡"}</button>
          <button className="purchase-bar__cart" type="button" disabled={!size || soldOut} onClick={addToCart}>{soldOut ? "품절" : size ? "장바구니 담기" : "사이즈를 선택해 주세요"}</button>
          <button className="purchase-bar__buy" type="button" disabled={!size || soldOut} onClick={buyNow}>{soldOut ? "구매 불가" : size ? `${formatPrice(product.price * quantity)} 구매` : "바로 구매"}</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
