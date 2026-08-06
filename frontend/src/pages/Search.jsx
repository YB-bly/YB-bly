import { useMemo, useState } from "react";
import AppHeader from "../components/AppHeader";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const recentKeywords = ["여름 셔츠", "메리제인", "미니백"];

const Search = () => {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];
    return products.filter((product) => `${product.brand} ${product.name}`.toLowerCase().includes(keyword));
  }, [query]);

  return (
    <div className="search-page">
      <div className="container">
        <AppHeader back actions={false} />
        <main className="search">
          <div className="search__bar">
            <span aria-hidden="true">⌕</span>
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="브랜드 또는 상품을 검색해 보세요" aria-label="상품 검색" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="검색어 지우기">×</button>}
          </div>

          {!query ? (
            <>
              <section className="search__section">
                <div className="section-heading"><h2>최근 검색어</h2><button type="button">전체 삭제</button></div>
                <div className="chip-list">{recentKeywords.map((keyword) => <button className="chip" type="button" key={keyword} onClick={() => setQuery(keyword)}>{keyword} ×</button>)}</div>
              </section>
              <section className="search__section">
                <div className="section-heading"><h2>지금 많이 찾고 있어요</h2><span>08.06 기준</span></div>
                <ol className="search__ranking">
                  {["썸머 니트", "와이드 팬츠", "Mardi Mercredi", "숄더백", "메리제인"].map((keyword, index) => <li key={keyword}><button type="button" onClick={() => setQuery(keyword)}><strong>{index + 1}</strong>{keyword}<span>{index < 2 ? "NEW" : "—"}</span></button></li>)}
                </ol>
              </section>
            </>
          ) : (
            <section className="search__results">
              <h2>‘{query}’ 검색 결과 <span>{results.length}</span></h2>
              {results.length > 0 ? <div className="product-grid">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><span>⌕</span><strong>검색 결과가 없어요</strong><p>다른 검색어로 다시 시도해 보세요.</p></div>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
