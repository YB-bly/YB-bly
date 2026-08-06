import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { adminReviews } from "../data/adminData";

const AdminReviews = () => {
  const [reviews, setReviews] = useState(adminReviews);
  const toggle = (id) => setReviews(reviews.map((review) => review.id === id ? { ...review, status: review.status === "숨김" ? "공개" : "숨김" } : review));
  return <div className="admin-reviews-page admin-page"><div className="container"><AdminHeader title="리뷰 관리" back /><main className="admin-reviews"><div className="admin-reviews__summary"><strong>전체 리뷰 {reviews.length}</strong><button type="button">신고 리뷰만 보기</button></div><section>{reviews.map((review) => <article key={review.id}><header><img src={review.product.image} alt="" /><div><strong>{review.product.name}</strong><span>{review.user} · {review.date}</span></div><em>{review.status}</em></header><div className="admin-reviews__rating">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div><p>{review.content}</p><footer><span>구매 인증 완료</span><button type="button" onClick={() => toggle(review.id)}>{review.status === "숨김" ? "공개하기" : "리뷰 숨김"}</button></footer></article>)}</section></main><AdminBottomNavigation /></div></div>;
};

export default AdminReviews;
