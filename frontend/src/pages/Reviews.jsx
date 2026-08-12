import { useMemo, useState } from "react";
import { Link } from "../router";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import { orders as seedOrders } from "../data/orders";
import { getMockOrders } from "../data/shopStorage";
import { deleteUserReview, getUserReviews, toggleUserReviewHelpful } from "../data/shopRepository";

const Reviews = () => {
  const [tab, setTab] = useState("written");
  const [reviews, setReviews] = useState(getUserReviews);
  const writtenProductIds = new Set(reviews.map((review) => Number(review.product.id)));
  const available = [...getMockOrders(), ...seedOrders].filter((order) => order.status === "배송완료" && !writtenProductIds.has(Number(order.product.id)));
  const average = useMemo(() => reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "0.0", [reviews]);
  const remove = (review) => { if (window.confirm("작성한 리뷰를 삭제할까요?")) { deleteUserReview(review.id); setReviews(getUserReviews()); } };
  const helpful = (id) => { toggleUserReviewHelpful(id); setReviews(getUserReviews()); };
  return <div className="reviews-page"><div className="container"><AppHeader title="나의 리뷰" /><main className="reviews"><section className="reviews__summary"><div><strong>{average}</strong><span>★★★★★</span><p>작성한 리뷰 {reviews.length}개</p></div><button type="button" onClick={() => setTab("available")}>작성 가능한 리뷰 <strong>{available.length}</strong> ›</button></section><div className="reviews__tabs"><button className={tab === "written" ? "is-active" : ""} onClick={() => setTab("written")} type="button">작성한 리뷰 {reviews.length}</button><button className={tab === "available" ? "is-active" : ""} onClick={() => setTab("available")} type="button">작성 가능 {available.length}</button></div>{tab === "written" ? <section className="reviews__list">{reviews.map((review) => <article className="review-card" key={review.id}><header><img src={review.product.image} alt="" /><div><strong>{review.product.brand}</strong><p>{review.product.name}</p><span>{review.option}</span></div><div className="review-card__actions"><Link to={`/reviews/write?edit=${review.id}`}>수정</Link><button type="button" onClick={() => remove(review)}>삭제</button></div></header><div className="review-card__meta"><span>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span><time>{review.date}</time></div>{review.chips?.length > 0 && <div className="review-card__chips">{review.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>}<p className="review-card__text">{review.text}</p>{review.photos.length > 0 && <div className="review-card__photos">{review.photos.map((photo, index) => <img src={photo} alt="리뷰 첨부" key={`${photo.slice(0,20)}-${index}`} />)}</div>}<button className={review.helpfulByMe ? "review-card__help is-active" : "review-card__help"} onClick={() => helpful(review.id)} type="button">{review.helpfulByMe ? "♥" : "♡"} 도움이 돼요 {review.helpful ?? 0}</button></article>)}{reviews.length === 0 && <div className="empty-state"><span>☆</span><strong>작성한 리뷰가 없어요</strong></div>}</section> : <section className="reviews__available">{available.map((order) => <article key={order.id}><img src={order.product.image} alt="" /><div><strong>{order.product.name}</strong><span>{order.option}</span></div><Link to={`/reviews/write?product=${order.product.id}`}>리뷰 작성</Link></article>)}{available.length === 0 && <div className="empty-state"><span>✓</span><strong>작성 가능한 리뷰가 없어요</strong></div>}</section>}</main><BottomNavigation /></div></div>;
};
export default Reviews;
