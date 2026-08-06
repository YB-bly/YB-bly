import { useMemo, useState } from "react";
import { useParams } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import { formatPrice, products } from "../data/products";

const ProductDetail = () => {
  const { productId } = useParams();
  const product = useMemo(() => products.find((item) => item.id === Number(productId)) ?? products[0], [productId]);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

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
            <div className="product-detail__brand"><strong>{product.brand}</strong><button type="button">브랜드 홈 →</button></div>
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
            <div>{["S", "M", "L"].map((item) => <button className={size === item ? "is-selected" : ""} type="button" key={item} onClick={() => setSize(item)}>{item}</button>)}</div>
            <div className="product-detail__quantity">
              <span>수량</span>
              <div><button type="button" disabled={quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><strong>{quantity}</strong><button type="button" onClick={() => setQuantity((value) => value + 1)}>＋</button></div>
            </div>
          </section>
          <section className="product-detail__description">
            <h2>상품 정보</h2>
            <p>부드러운 촉감과 여유로운 실루엣으로 일상에서 편안하게 입을 수 있는 아이템입니다.</p>
          </section>
        </main>
        <div className="purchase-bar">
          <button className={`purchase-bar__like${liked ? " is-liked" : ""}`} type="button" onClick={() => setLiked(!liked)} aria-label="찜하기">{liked ? "♥" : "♡"}</button>
          <button className="purchase-bar__cart" type="button" disabled={!size}>{size ? "장바구니 담기" : "사이즈를 선택해 주세요"}</button>
          <button className="purchase-bar__buy" type="button" disabled={!size}>{size ? `${formatPrice(product.price * quantity)} 구매` : "바로 구매"}</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
