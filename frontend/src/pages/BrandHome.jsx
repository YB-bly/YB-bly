import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "../router-hooks";
import { getProducts } from "../api/productApi";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../api/wishlistApi";

const BrandHome = () => {
  const [params] = useSearchParams();
  const brand = params.get("brand") ?? "브랜드";

  const [products, setProducts] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const allProducts = await getProducts();
        setProducts(allProducts.filter((product) => product.brand === brand));

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
        console.error("브랜드 상품 조회 실패:", err);
        setError(err.response?.data?.error || "상품을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brand]);

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
        <AppHeader title="브랜드 홈" back />
        <main>
          <section className="brand-hero">
            <span>BRAND HOME</span>
            <h1>{brand}</h1>
            <p>{brand}의 상품과 새로운 소식을 한곳에서 만나보세요.</p>
          </section>

          <section className="utility-content">
            <div className="utility-heading">
              <h2>전체 상품</h2>
              <span>{products.length}개</span>
            </div>

            {loading ? (
              <div className="empty-state">
                <strong>불러오는 중...</strong>
              </div>
            ) : error ? (
              <div className="empty-state">
                <span>!</span>
                <strong>상품을 불러오지 못했어요</strong>
                <p>{error}</p>
              </div>
            ) : products.length ? (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                    liked={likedItems.includes(Number(product.id))}
                    onLike={() => handleLike(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>!</span>
                <strong>판매 중인 상품이 없어요</strong>
              </div>
            )}
          </section>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default BrandHome;
