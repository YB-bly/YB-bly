import {
  useEffect,
  useState,
} from "react";

import AppHeader from "../components/AppHeader";
import ProductCard from "../components/ProductCard";

import {
  searchProducts,
} from "../api/productApi";

const initialRecentKeywords = [
  "여름 셔츠",
  "메리제인",
  "미니백",
];

const Search = () => {
  const [query, setQuery] =
    useState("");

  const [
    recentKeywords,
    setRecentKeywords,
  ] = useState(
    initialRecentKeywords
  );

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const keyword =
      query.trim();

    if (!keyword) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    const timer =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);
            setError("");

            const data =
              await searchProducts(
                keyword
              );

            setResults(data);
          } catch (error) {
            console.error(
              "상품 검색 실패:",
              error
            );

            setResults([]);

            setError(
              error.response?.data
                ?.error ||
                "검색 결과를 불러오지 못했습니다."
            );
          } finally {
            setLoading(false);
          }
        },
        300
      );

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  const selectKeyword = (
    keyword
  ) => {
    setQuery(keyword);

    setRecentKeywords(
      (prev) => [
        keyword,
        ...prev.filter(
          (item) =>
            item !== keyword
        ),
      ].slice(0, 5)
    );
  };

  return (
    <div className="search-page">
      <div className="container">
        <AppHeader
          back
          actions={false}
        />

        <main className="search">
          <div className="search__bar">
            <span aria-hidden="true">
              ⌕
            </span>

            <input
              autoFocus
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="브랜드 또는 상품을 검색해 보세요"
              aria-label="상품 검색"
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
                aria-label="검색어 지우기"
              >
                ×
              </button>
            )}
          </div>

          {!query.trim() ? (
            <>
              <section className="search__section">
                <div className="section-heading">
                  <h2>
                    최근 검색어
                  </h2>

                  <button
                    type="button"
                    disabled={
                      !recentKeywords.length
                    }
                    onClick={() =>
                      setRecentKeywords(
                        []
                      )
                    }
                  >
                    전체 삭제
                  </button>
                </div>

                <div className="chip-list">
                  {recentKeywords.map(
                    (keyword) => (
                      <button
                        className="chip"
                        type="button"
                        key={
                          keyword
                        }
                        onClick={() =>
                          selectKeyword(
                            keyword
                          )
                        }
                      >
                        {keyword}
                      </button>
                    )
                  )}

                  {recentKeywords.length ===
                    0 && (
                    <span>
                      최근 검색어가
                      없어요.
                    </span>
                  )}
                </div>
              </section>

              <section className="search__section">
                <div className="section-heading">
                  <h2>
                    지금 많이 찾고
                    있어요
                  </h2>

                  <span>
                    08.13 기준
                  </span>
                </div>

                <ol className="search__ranking">
                  {[
                    "썸머 니트",
                    "와이드 팬츠",
                    "Mardi Mercredi",
                    "숄더백",
                    "메리제인",
                  ].map(
                    (
                      keyword,
                      index
                    ) => (
                      <li
                        key={
                          keyword
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            selectKeyword(
                              keyword
                            )
                          }
                        >
                          <strong>
                            {index +
                              1}
                          </strong>

                          {keyword}

                          <span>
                            {index <
                            2
                              ? "NEW"
                              : "—"}
                          </span>
                        </button>
                      </li>
                    )
                  )}
                </ol>
              </section>
            </>
          ) : (
            <section className="search__results">
              <h2>
                ‘{query}’ 검색 결과{" "}
                <span>
                  {results.length}
                </span>
              </h2>

              {loading ? (
                <div className="empty-state">
                  <strong>
                    검색 중...
                  </strong>
                </div>
              ) : error ? (
                <div className="empty-state">
                  <span>!</span>

                  <strong>
                    검색 중 오류가
                    발생했어요
                  </strong>

                  <p>
                    {error}
                  </p>
                </div>
              ) : results.length >
                0 ? (
                <div className="product-grid">
                  {results.map(
                    (product) => (
                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <span>⌕</span>

                  <strong>
                    검색 결과가
                    없어요
                  </strong>

                  <p>
                    다른 검색어로
                    다시 시도해
                    보세요.
                  </p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;