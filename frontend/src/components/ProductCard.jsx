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

  const ratingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    margin: "8px 0 0",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.4,
  };

  const starStyle = {
    color: "#f5a623",
    fontSize: "14px",
  };

  const ratingCountStyle = {
    color: "#8a8a8a",
    fontSize: "12px",
    fontWeight: 500,
  };

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <Link
          className="product-card__image-link"
          to={`/products/${product.id}`}
        >
          {product.image ? (
            <img
              className="product-card__image"
              src={product.image}
              alt={product.name}
            />
          ) : (
            <div className="product-card__image product-card__image--empty">
              이미지 준비 중
            </div>
          )}

          {product.badge && (
            <span className="product-card__badge">
              {product.badge}
            </span>
          )}
        </Link>

        <button
          type="button"
          className={`product-card__like${
            liked
              ? " product-card__like--active"
              : ""
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
            {Number(product.discount) > 0 && (
              <span>
                {product.discount}%
              </span>
            )}

            <strong>
              {formatPrice(product.price)}
            </strong>
          </p>

          <div className="product-card__tags">
            {(
              product.tags?.length
                ? product.tags
                : ["무료배송"]
            )
              .slice(0, 2)
              .map((tag) => (
                <span key={tag}>
                  {tag}
                </span>
              ))}
          </div>

          <p style={ratingStyle}>
            <span
              style={starStyle}
              aria-hidden="true"
            >
              ★
            </span>

            <span>
              {Number(
                product.rating ?? 0
              ).toFixed(1)}
            </span>

            <span style={ratingCountStyle}>
              리뷰 {product.reviews ?? 0}
            </span>
          </p>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;