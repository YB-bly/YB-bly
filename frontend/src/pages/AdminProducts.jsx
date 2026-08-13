import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "../router";

import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import Pagination from "../components/Pagination";

import {
  formatPrice,
} from "../data/products";

import {
  getProducts,
} from "../api/productApi";

const PAGE_SIZE = 5;

const AdminProducts = () => {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [query, setQuery] =
    useState("");

  const [status, setStatus] =
    useState("전체 상태");

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getProducts();

          setProducts(data);
        } catch (error) {
          console.error(
            "관리자 상품 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "상품 목록을 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, []);

  const getStatus = (
    product
  ) => {
    if (
      Number(product.stock) <= 0
    ) {
      return "품절";
    }

    return "판매중";
  };

  const filtered =
    useMemo(() => {
      return products.filter(
        (product) => {
          const productStatus =
            getStatus(product);

          const queryMatch =
            `${product.brand} ${product.name} ${product.badge ?? ""}`
              .toLowerCase()
              .includes(
                query
                  .trim()
                  .toLowerCase()
              );

          const statusMatch =
            status ===
              "전체 상태" ||
            productStatus ===
              status;

          return (
            queryMatch &&
            statusMatch
          );
        }
      );
    }, [
      products,
      query,
      status,
    ]);

  return (
    <div className="admin-products-page admin-page">
      <div className="container">
        <AdminHeader
          title="상품 관리"
          back
        />

        <main className="admin-products">
          <div className="admin-search">
            <input
              value={query}
              onChange={(event) => {
                setQuery(
                  event.target.value
                );
                setPage(1);
              }}
              placeholder="상품명 또는 브랜드 검색"
            />

            <Link to="/admin/products/upload">
              + 상품 등록
            </Link>
          </div>

          <div className="admin-products__summary">
            <strong>
              전체 상품{" "}
              {products.length}
            </strong>

            <select
              aria-label="판매 상태"
              value={status}
              onChange={(event) => {
                setStatus(
                  event.target.value
                );
                setPage(1);
              }}
            >
              <option>
                전체 상태
              </option>

              <option>
                판매중
              </option>

              <option>
                품절
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
              <strong>{error}</strong>
            </section>
          ) : (
            <>
              <section className="admin-products__list">
                {filtered
                  .slice(
                    (page - 1) *
                      PAGE_SIZE,
                    page *
                      PAGE_SIZE
                  )
                  .map(
                    (product) => {
                      const productStatus =
                        getStatus(
                          product
                        );

                      return (
                        <article
                          key={
                            product.id
                          }
                        >
                          {product.image ? (
                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                            />
                          ) : (
                            <div className="admin-products__image-placeholder">
                              이미지 준비 중
                            </div>
                          )}

                          <div>
                            <span>
                              {
                                product.brand
                              }
                            </span>

                            <strong>
                              {
                                product.name
                              }
                            </strong>

                            <p>
                              {formatPrice(
                                product.price
                              )}{" "}
                              · 재고{" "}
                              {
                                product.stock
                              }
                            </p>

                            <div className="admin-products__tags">
                              {product.badge && (
                                <small>
                                  #
                                  {
                                    product.badge
                                  }
                                </small>
                              )}
                            </div>

                            <em
                              className={
                                productStatus !==
                                "판매중"
                                  ? "is-soldout"
                                  : ""
                              }
                            >
                              {
                                productStatus
                              }
                            </em>
                          </div>

                          <Link
                            className="admin-products__manage"
                            to={`/admin/products/${product.id}/edit`}
                          >
                            관리
                          </Link>
                        </article>
                      );
                    }
                  )}
              </section>

              {filtered.length ===
                0 && (
                <section className="empty-state">
                  <span>!</span>

                  <strong>
                    조건에 맞는 상품이
                    없어요
                  </strong>
                </section>
              )}

              <Pagination
                page={page}
                total={
                  filtered.length
                }
                pageSize={
                  PAGE_SIZE
                }
                onChange={
                  setPage
                }
              />
            </>
          )}
        </main>

        <AdminBottomNavigation />
      </div>
    </div>
  );
};

export default AdminProducts;