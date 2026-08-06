import { Link } from "../router";
import { useNavigate } from "../router-hooks";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="m15.5 15.5 4.2 4.2" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.5 8.5h11l1 11h-13z" />
    <path d="M9 8.5V6a3 3 0 0 1 6 0v2.5" />
  </svg>
);

const BackIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m15 5-7 7 7 7" />
  </svg>
);

const AppHeader = ({
  title,
  back = false,
  actions = true,
}) => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__side">
        {back ? (
          <button
            type="button"
            className="app-header__icon"
            aria-label="이전 페이지"
            onClick={() => navigate(-1)}
          >
            <BackIcon />
          </button>
        ) : (
          <Link className="app-header__logo" to="/">
            YB-bly
          </Link>
        )}
      </div>

      {title && (
        <h1 className="app-header__title">
          {title}
        </h1>
      )}

      <div className="app-header__side app-header__side--right">
        {actions && (
          <>
            <Link
              className="app-header__icon"
              to="/search"
              aria-label="검색"
            >
              <SearchIcon />
            </Link>

            <button
              type="button"
              className="app-header__icon"
              aria-label="장바구니"
            >
              <CartIcon />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default AppHeader;