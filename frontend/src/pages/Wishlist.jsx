import {
  useEffect,
  useState,
} from "react";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";

import {
  getWishlist,
  removeWishlistItem,
} from "../api/wishlistApi";

const Wishlist = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchWishlist =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getWishlist();

          setProducts(data);
        } catch (error) {
          console.error(
            "찜 목록 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "찜 목록을 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchWishlist();
  }, []);

  const handleUnlike = async (
    productId
  ) => {
    try {
      setError("");

      await removeWishlistItem(
        productId
      );

      setProducts((current) =>
        current.filter(
          (product) =>
            product.id !==
            productId
        )
      );
    } catch (error) {
      console.error(
        "찜 삭제 실패:",
        error
      );

      setError(
        error.response?.data
          ?.error ||
          "찜 목록에서 삭제하지 못했습니다."
      );
    }
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <AppHeader title="찜" />

        <main className="wishlist">
          <div className="wishlist__heading">
            <h2>
              찜한 상품
            </h2>

            <span>
              {products.length}개
            </span>
          </div>

          {loading ? (
            <section className="empty-state">
              <strong>
                찜 목록을 불러오는
                중...
              </strong>
            </section>
          ) : error &&
            products.length === 0 ? (
            <section className="empty-state">
              <span>!</span>

              <strong>
                찜 목록을
                불러오지 못했어요
              </strong>

              <p>{error}</p>
            </section>
          ) : products.length >
            0 ? (
            <>
              {error && (
                <p className="auth-form__error">
                  {error}
                </p>
              )}

              <section
                className="product-grid"
                aria-label="찜한 상품 목록"
              >
                {products.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                      liked
                      onLike={() =>
                        handleUnlike(
                          product.id
                        )
                      }
                    />
                  )
                )}
              </section>
            </>
          ) : (
            <section className="empty-state">
              <span>♡</span>

              <strong>
                찜한 상품이 없어요
              </strong>

              <p>
                마음에 드는 상품의
                하트를 눌러보세요.
              </p>
            </section>
          )}
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default Wishlist;