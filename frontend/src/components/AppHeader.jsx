import { Link } from "../router";
import { useNavigate } from "../router-hooks";

const AppHeader = ({ title, back = false, actions = true }) => {
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
            ←
          </button>
        ) : (
          <Link className="app-header__logo" to="/">
            YB-bly
          </Link>
        )}
      </div>

      {title && <h1 className="app-header__title">{title}</h1>}

      <div className="app-header__side app-header__side--right">
        {actions && (
          <>
            <Link className="app-header__icon" to="/search" aria-label="검색">
              ⌕
            </Link>
            <button type="button" className="app-header__icon" aria-label="장바구니">
              ♧
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
