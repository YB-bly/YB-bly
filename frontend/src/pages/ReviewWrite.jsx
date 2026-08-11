import { useState } from "react";
import { useNavigate, useSearchParams } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import { getManagedProduct, getUserReviews, saveUserReview } from "../data/shopRepository";

const chips = ["사이즈가 잘 맞아요", "색상이 같아요", "배송이 빨라요"];

const ReviewWrite = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const existing = getUserReviews().find((review) => Number(review.id) === Number(params.get("edit")));
  const product = existing?.product ?? getManagedProduct(params.get("product"));
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [content, setContent] = useState(existing?.text ?? "");
  const [selectedChips, setSelectedChips] = useState(existing?.chips ?? []);
  const [photos, setPhotos] = useState(existing?.photos ?? []);
  const [error, setError] = useState("");

  if (!product) return <div className="review-write-page"><div className="container"><AppHeader title="리뷰 작성" back /><main className="empty-state"><span>!</span><strong>리뷰를 작성할 상품을 찾을 수 없어요</strong></main></div></div>;

  const selectPhotos = (event) => {
    const files = [...(event.target.files ?? [])].slice(0, 5 - photos.length);
    if (files.some((file) => file.size > 800_000)) { setError("사진 한 장당 800KB 이하만 추가할 수 있어요."); return; }
    Promise.all(files.map((file) => new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }))).then((next) => { setPhotos((current) => [...current, ...next].slice(0, 5)); setError(""); });
  };
  const handleSubmit = (event) => { event.preventDefault(); if (!rating || content.trim().length < 10) return; saveUserReview({ id: existing?.id, product, rating, text: content.trim(), option: existing?.option ?? "구매 옵션", photos, chips: selectedChips }); navigate("/reviews"); };

  return <div className="review-write-page"><div className="container"><AppHeader title={existing ? "리뷰 수정" : "리뷰 작성"} back actions={false} /><main className="review-write"><section className="review-write__product"><img src={product.image} alt={product.name} /><div><strong>{product.brand}</strong><p>{product.name}</p><span>{existing?.option ?? "구매 옵션"}</span></div></section><form onSubmit={handleSubmit}><section className="review-write__rating"><h2>상품은 어떠셨나요?</h2><p>별점을 선택해 주세요.</p><div>{[1,2,3,4,5].map((score) => <button type="button" key={score} className={score <= rating ? "is-active" : ""} onClick={() => setRating(score)} aria-label={`${score}점`}>★</button>)}</div></section><section className="review-write__content"><h2>어떤 점이 좋았나요?</h2><div className="review-write__chips">{chips.map((item) => <button type="button" className={selectedChips.includes(item) ? "is-active" : ""} key={item} onClick={() => setSelectedChips((current) => current.includes(item) ? current.filter((chip) => chip !== item) : [...current, item])}>{item}</button>)}</div><textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength="500" placeholder="상품에 대한 솔직한 후기를 10자 이상 남겨주세요." /><span>{content.length} / 500</span></section><section className="review-write__photo"><h2>사진을 추가해 주세요 <span>선택</span></h2><p>최대 5장, 장당 800KB 이하의 이미지를 추가할 수 있어요.</p><div className="review-write__photo-list">{photos.map((photo, index) => <div key={`${photo.slice(0,30)}-${index}`}><img src={photo} alt={`리뷰 첨부 ${index + 1}`} /><button type="button" onClick={() => setPhotos(photos.filter((_, photoIndex) => photoIndex !== index))} aria-label={`사진 ${index + 1} 삭제`}>×</button></div>)}{photos.length < 5 && <label><strong>＋</strong><span>사진 {photos.length}/5</span><input type="file" accept="image/*" multiple onChange={selectPhotos} /></label>}</div>{error && <p className="review-write__error">{error}</p>}</section><button className="review-write__submit" type="submit" disabled={!rating || content.trim().length < 10}>{existing ? "리뷰 수정 완료" : "리뷰 등록"}</button></form></main></div></div>;
};
export default ReviewWrite;
