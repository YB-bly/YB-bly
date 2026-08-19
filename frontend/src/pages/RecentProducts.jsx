import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import { getRecentProductIds } from "../data/shopRepository";
import { getProducts } from "../api/productApi";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../api/wishlistApi";

const RecentProducts = () => {
  const [products, setProducts] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        setError("");

        const recentIds = getRecentProductIds();
        const allProducts = await getProducts();

        const byId = new Map(
          allProducts.map((product) => [Number(product.id), product])
        );

        const ordered = recentIds
          .map((id) => byId.get(Number(id)))
          .filter(Boolean);

        setProducts(ordered);

        try {
          const wishlist = await getWishlist();
          setLikedItems(wishlist.map((item) => Number(item.id)));
        } catch (wishlistError) {
          if (wishlistError.response?.status !== 401) {
            console.error("찜 목록 조회 실패:", wishlistError);
          }
          setLikedItems([]);
        }
      } catch (err) {
        console.error("최근 본 상품 조회 실패:", err);
        setError(
          err.response?.data?.error || "최근 본 상품을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const handleLike = async (productId) => {
    const normalizedId = Number(productId);
    const isLiked = likedItems.includes(normalizedId);

    try {
      if (isLiked) {
        await removeWishlistItem(normalizedId);
        setLikedItems((current) =>
          current.filter((id) => id !== normalizedId)
        );
      } else {
        await addWishlistItem(normalizedId);
        setLikedItems((current) =>
          current.includes(normalizedId) ? current : [...current, normalizedId]
        );
      }
    } catch (err) {
      console.error("찜 변경 실패:", err);
    }
  };

  return (
    <div className="utility-page">
      <div className="container">
        <AppHeader title="최근 본 상품" back />
        <main className="utility-content">
          <div className="utility-heading">
            <h1>최근 본 상품</h1>
            <span>최대 20개까지 저장돼요.</span>
          </div>

          {loading ? (
            <section className="empty-state">
              <strong>불러오는 중...</strong>
            </section>
          ) : error ? (
            <section className="empty-state">
              <span>!</span>
              <strong>최근 본 상품을 불러오지 못했어요</strong>
              <p>{error}</p>
            </section>
          ) : products.length ? (
            <section className="product-grid">
              {products.map((product) => (
                <ProductCard
                  product={product}
                  key={product.id}
                  liked={likedItems.includes(Number(product.id))}
                  onLike={() => handleLike(product.id)}
                />
              ))}
            </section>
          ) : (
            <section className="empty-state">
              <span>◎</span>
              <strong>최근 본 상품이 없어요</strong>
              <p>상품을 둘러보면 여기에 표시됩니다.</p>
            </section>
          )}
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default RecentProducts;
