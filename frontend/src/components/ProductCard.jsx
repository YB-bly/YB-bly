import { Link } from "../router";
import { formatPrice } from "../data/products";

const ProductCard = ({ product, liked = false }) => (
  <article className="product-card">
    <div className="product-card__image-wrap">
      <Link className="product-card__image-link" to={`/products/${product.id}`}>
        <img className="product-card__image" src={product.image} alt={product.name} />
        <span className="product-card__badge">{product.badge}</span>
      </Link>
      <button type="button" className="product-card__like" aria-label={`${product.name} 찜하기`}>{liked ? "♥" : "♡"}</button>
    </div>
    <Link to={`/products/${product.id}`}>
      <div className="product-card__body">
        <strong className="product-card__brand">{product.brand}</strong>
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__price">
          <span>{product.discount}%</span> {formatPrice(product.price)}
        </p>
        <p className="product-card__rating">
          ★ {product.rating} <span>({product.reviews})</span>
        </p>
      </div>
    </Link>
  </article>
);

export default ProductCard;
