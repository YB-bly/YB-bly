const Pagination = ({ page, total, pageSize = 5, onChange }) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return <nav className="pagination" aria-label="페이지 이동">
    <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="이전 페이지">‹</button>
    {Array.from({ length: pages }, (_, index) => index + 1).map((number) => <button className={page === number ? "is-active" : ""} type="button" onClick={() => onChange(number)} aria-current={page === number ? "page" : undefined} key={number}>{number}</button>)}<button type="button" disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="다음 페이지">›</button></nav>;
};
export default Pagination;
