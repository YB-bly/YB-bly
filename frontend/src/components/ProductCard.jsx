import { Link } from "../router";
import { formatPrice } from "../data/products";

const ProductCard = ({
  product,
  liked = false,
  onLike,
}) => {
  const handleLike = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onLike?.();
  };

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <Link
          className="product-card__image-link"
          to={`/products/${product.id}`}
        >
          <img
            className="product-card__image"
            src={product.image}
            alt={product.name}
          />

          {product.badge && (
            <span className="product-card__badge">
              {product.badge}
            </span>
          )}
        </Link>

        <button
          type="button"
          className={`product-card__like${
            liked ? " product-card__like--active" : ""
          }`}
          aria-label={
            liked
              ? `${product.name} 찜 취소`
              : `${product.name} 찜하기`
          }
          aria-pressed={liked}
          onClick={handleLike}
        >
          {liked ? "♥" : "♡"}
        </button>
      </div>

      <Link
        className="product-card__detail-link"
        to={`/products/${product.id}`}
      >
        <div className="product-card__body">
          <strong className="product-card__brand">
            {product.brand}
          </strong>

          <p className="product-card__name">
            {product.name}
          </p>

          <p className="product-card__price">
            <span>{product.discount}%</span>
            <strong>{formatPrice(product.price)}</strong>
          </p>

          <div className="product-card__tags">
            <span>무료배송</span>
            <span>마일리지 2배</span>
          </div>

          <p className="product-card__rating">
            ★ {product.rating}
            <span>({product.reviews})</span>
          </p>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;