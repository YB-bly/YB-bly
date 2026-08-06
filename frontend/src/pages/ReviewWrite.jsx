import { useState } from "react";
import { useNavigate, useSearchParams } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import { products } from "../data/products";

const ReviewWrite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const product = products.find((item) => item.id === Number(searchParams.get("product"))) ?? products[0];
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (rating && content.trim().length >= 10) navigate("/reviews");
  };

  return (
    <div className="review-write-page">
      <div className="container">
        <AppHeader title="리뷰 작성" back actions={false} />
        <main className="review-write">
          <section className="review-write__product"><img src={product.image} alt={product.name} /><div><strong>{product.brand}</strong><p>{product.name}</p><span>화이트 / M</span></div></section>
          <form onSubmit={handleSubmit}>
            <section className="review-write__rating"><h2>상품은 어떠셨나요?</h2><p>별점을 선택해 주세요.</p><div>{[1, 2, 3, 4, 5].map((score) => <button type="button" key={score} className={score <= rating ? "is-active" : ""} onClick={() => setRating(score)} aria-label={`${score}점`}>★</button>)}</div></section>
            <section className="review-write__content"><h2>어떤 점이 좋았나요?</h2><div className="review-write__chips">{["사이즈가 잘 맞아요", "색상이 같아요", "배송이 빨라요"].map((item) => <button type="button" key={item}>{item}</button>)}</div><textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength="500" placeholder="상품에 대한 솔직한 후기를 10자 이상 남겨주세요." /><span>{content.length} / 500</span></section>
            <section className="review-write__photo"><h2>사진을 추가해 주세요 <span>선택</span></h2><p>사진 리뷰를 작성하면 500P를 드려요.</p><button type="button"><strong>＋</strong><span>사진 0/5</span></button></section>
            <button className="review-write__submit" type="submit" disabled={!rating || content.trim().length < 10}>리뷰 등록</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ReviewWrite;
