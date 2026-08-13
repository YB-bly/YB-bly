import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

import {
  getProducts,
} from "../api/productApi";

import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../api/wishlistApi";

import {
  useNavigate,
  useSearchParams,
} from "../router-hooks";

const PAGE_SIZE = 6;

const ProductList = () => {
  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  const requestedCategory =
    searchParams.get(
      "category"
    );

  const requestedSubcategory =
    searchParams.get(
      "subcategory"
    );

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    likedItems,
    setLikedItems,
  ] = useState([]);

  const [
    category,
    setCategory,
  ] = useState(
    requestedCategory ||
      "전체"
  );

  const [
    sort,
    setSort,
  ] = useState("추천순");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    setCategory(
      requestedCategory ||
        "전체"
    );

    setPage(1);
  }, [requestedCategory]);

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getProducts(
              requestedCategory
            );

          setProducts(data);

          /*
           * 로그인 상태라면 현재 찜 목록도 조회.
           * 비로그인 상태의 401은 상품 목록
           * 오류로 처리하지 않는다.
           */
          try {
            const wishlist =
              await getWishlist();

            setLikedItems(
              wishlist.map(
                (item) =>
                  Number(item.id)
              )
            );
          } catch (
            wishlistError
          ) {
            if (
              wishlistError
                .response?.status !==
              401
            ) {
              console.error(
                "찜 목록 조회 실패:",
                wishlistError
              );
            }

            setLikedItems([]);
          }
        } catch (error) {
          console.error(
            "상품 목록 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "상품을 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [requestedCategory]);

  const handleLike = async (
    productId
  ) => {
    const normalizedId =
      Number(productId);

    const isLiked =
      likedItems.includes(
        normalizedId
      );

    try {
      if (isLiked) {
        await removeWishlistItem(
          normalizedId
        );

        setLikedItems(
          (current) =>
            current.filter(
              (id) =>
                id !==
                normalizedId
            )
        );
      } else {
        await addWishlistItem(
          normalizedId
        );

        setLikedItems(
          (current) =>
            current.includes(
              normalizedId
            )
              ? current
              : [
                  ...current,
                  normalizedId,
                ]
        );
      }
    } catch (error) {
      console.error(
        "찜 변경 실패:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        navigate("/login");
        return;
      }

      alert(
        error.response?.data
          ?.error ||
          "찜 처리 중 오류가 발생했습니다."
      );
    }
  };

  const categories =
    useMemo(() => {
      const categoryNames = [
        ...new Set(
          products
            .map(
              (product) =>
                product.category
            )
            .filter(Boolean)
        ),
      ];

      return [
        "전체",
        ...categoryNames,
      ];
    }, [products]);

  const filteredProducts =
    useMemo(() => {
      let result = [
        ...products,
      ];

      if (
        !requestedCategory &&
        category !== "전체"
      ) {
        result =
          result.filter(
            (product) =>
              product.category ===
              category
          );
      }

      /*
       * 현재 백엔드 products에는
       * subcategory 필드가 없음.
       */
      if (
        requestedSubcategory
      ) {
        result =
          result.filter(
            (product) =>
              product.subcategory ===
              requestedSubcategory
          );
      }

      if (
        sort ===
        "낮은 가격순"
      ) {
        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
      } else if (
        sort ===
        "리뷰 많은순"
      ) {
        result.sort(
          (a, b) =>
            Number(b.reviews) -
            Number(a.reviews)
        );
      } else {
        result.sort(
          (a, b) =>
            Number(b.rating) -
            Number(a.rating)
        );
      }

      return result;
    }, [
      products,
      category,
      sort,
      requestedCategory,
      requestedSubcategory,
    ]);

  useEffect(() => {
    const totalPages =
      Math.max(
        1,
        Math.ceil(
          filteredProducts.length /
            PAGE_SIZE
        )
      );

    if (
      page > totalPages
    ) {
      setPage(totalPages);
    }
  }, [
    filteredProducts.length,
    page,
  ]);

  const pageTitle =
    requestedSubcategory ||
    requestedCategory ||
    "상품";

  const pagedProducts =
    filteredProducts.slice(
      (page - 1) *
        PAGE_SIZE,
      page * PAGE_SIZE
    );

  return (
    <div className="product-list-page">
      <div className="container">
        <AppHeader
          title={pageTitle}
          back
        />

        <main className="product-list">
          <section className="product-list__hero">
            <p>
              SUMMER EDIT
            </p>

            <h2>
              가볍고 선명한
              <br />
              여름의 옷장
            </h2>

            <span>
              최대 30% 할인
            </span>
          </section>

          {!requestedCategory && (
            <div className="chip-list scroll-hidden">
              {categories.map(
                (item) => (
                  <button
                    className={`chip${
                      category ===
                      item
                        ? " chip--active"
                        : ""
                    }`}
                    key={item}
                    type="button"
                    onClick={() => {
                      setCategory(
                        item
                      );

                      setPage(1);
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}

          <div className="product-list__toolbar">
            <strong>
              총{" "}
              {
                filteredProducts.length
              }
              개
            </strong>

            <select
              aria-label="상품 정렬"
              value={sort}
              onChange={(
                event
              ) => {
                setSort(
                  event.target
                    .value
                );

                setPage(1);
              }}
            >
              <option>
                추천순
              </option>

              <option>
                낮은 가격순
              </option>

              <option>
                리뷰 많은순
              </option>
            </select>
          </div>

          {loading ? (
            <section className="empty-state">
              <strong>
                상품을 불러오는
                중...
              </strong>
            </section>
          ) : error ? (
            <section className="empty-state">
              <span>!</span>

              <strong>
                상품을 불러오지
                못했어요
              </strong>

              <p>
                {error}
              </p>
            </section>
          ) : filteredProducts.length >
            0 ? (
            <section
              className="product-grid"
              aria-label={`${pageTitle} 상품 목록`}
            >
              {pagedProducts.map(
                (product) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                    liked={likedItems.includes(
                      Number(
                        product.id
                      )
                    )}
                    onLike={() =>
                      handleLike(
                        product.id
                      )
                    }
                  />
                )
              )}
            </section>
          ) : (
            <section className="empty-state">
              <span>!</span>

              <strong>
                등록된 상품이 아직
                없어요
              </strong>

              <p>
                {pageTitle} 상품을
                준비하고 있습니다.
              </p>
            </section>
          )}

          {!loading &&
            !error && (
              <Pagination
                page={page}
                total={
                  filteredProducts.length
                }
                pageSize={
                  PAGE_SIZE
                }
                onChange={
                  setPage
                }
              />
            )}
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default ProductList;