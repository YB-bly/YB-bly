import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { getManagedReviews, updateManagedReview } from "../data/shopRepository";
import Pagination from "../components/Pagination";

const AdminReviews = () => {
  const [reviews, setReviews] = useState(getManagedReviews);
  const [reportedOnly, setReportedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const toggle = (review) => {
    const status = review.status === "숨김" ? "공개" : "숨김";
    updateManagedReview(review.id, { status });
    setReviews(getManagedReviews());
  };
  const visibleReviews = reviews.filter((review) => (!reportedOnly || review.reported) && `${review.user} ${review.product.name} ${review.content}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="admin-reviews-page admin-page"><div className="container"><AdminHeader title="리뷰 관리" back /><main className="admin-reviews"><div className="admin-reviews__tools"><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="작성자, 상품명 또는 내용 검색" /></div><div className="admin-reviews__summary"><strong>{reportedOnly ? `신고 리뷰 ${visibleReviews.length}` : `전체 리뷰 ${visibleReviews.length}`}</strong><button className={reportedOnly ? "is-active" : ""} onClick={() => { setReportedOnly(!reportedOnly); setPage(1); }} type="button">{reportedOnly ? "전체 리뷰 보기" : "신고 리뷰만 보기"}</button></div><section>{visibleReviews.slice((page - 1) * 5, page * 5).map((review) => <article key={review.id}><header><img src={review.product.image} alt="" /><div><strong>{review.product.name}</strong><span>{review.user} · {review.date}</span></div><em className={review.reported ? "is-reported" : ""}>{review.status}</em></header><div className="admin-reviews__rating">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div><p>{review.content}</p>{review.reported && <div className="admin-reviews__report"><button type="button" onClick={() => setExpanded(expanded === review.id ? null : review.id)}>신고 사유 {expanded === review.id ? "접기" : "상세 보기"}</button>{expanded === review.id && <div><strong>부적절한 콘텐츠</strong><p>상품과 무관한 내용 또는 커뮤니티 운영 정책 위반 가능성으로 신고되었습니다.</p><span>신고 접수: 2026.08.05 · 누적 1회</span></div>}</div>}<footer><span>{review.verified ? "✓ 구매 인증 완료" : "구매 미인증"}</span><button type="button" onClick={() => toggle(review)}>{review.status === "숨김" ? "공개하기" : "리뷰 숨김"}</button></footer></article>)}</section>{visibleReviews.length === 0 && <section className="empty-state"><span>✓</span><strong>조건에 맞는 리뷰가 없어요</strong></section>}<Pagination page={page} total={visibleReviews.length} onChange={setPage} /></main><AdminBottomNavigation /></div></div>;
};

export default AdminReviews;
