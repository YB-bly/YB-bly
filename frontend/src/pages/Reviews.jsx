import { Link } from "../router";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import { products } from "../data/products";

const reviews = [
  { id: 1, product: products[0], rating: 5, date: "2026.08.03", text: "원단이 부드럽고 핏이 여유로워서 한여름에도 편하게 입기 좋아요. 프린트 색감도 사진과 같아요.", option: "화이트 / M", photos: [products[0].image] },
  { id: 2, product: products[4], rating: 4, date: "2026.07.27", text: "생각보다 수납력이 좋고 어떤 옷에도 잘 어울려요. 스트랩 길이도 적당합니다.", option: "크림 / FREE", photos: [] },
];

const Reviews = () => (
  <div className="reviews-page">
    <div className="container">
      <AppHeader title="나의 리뷰" />
      <main className="reviews">
        <section className="reviews__summary">
          <div><strong>4.8</strong><span>★★★★★</span><p>작성한 리뷰 12개</p></div>
          <Link to="/orders">작성 가능한 리뷰 <strong>2</strong> ›</Link>
        </section>
        <div className="reviews__tabs"><button className="is-active" type="button">작성한 리뷰 12</button><button type="button">작성 가능 2</button></div>
        <section className="reviews__list">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <header><img src={review.product.image} alt="" /><div><strong>{review.product.brand}</strong><p>{review.product.name}</p><span>{review.option}</span></div><button type="button">⋮</button></header>
              <div className="review-card__meta"><span>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span><time>{review.date}</time></div>
              <p className="review-card__text">{review.text}</p>
              {review.photos.length > 0 && <div className="review-card__photos">{review.photos.map((photo) => <img src={photo} alt="리뷰 첨부" key={photo} />)}</div>}
              <button className="review-card__help" type="button">♡ 도움이 돼요 8</button>
            </article>
          ))}
        </section>
      </main>
      <BottomNavigation />
    </div>
  </div>
);

export default Reviews;
