import { Link } from "../router";
import { useNavigate } from "../router-hooks";

const AdminHeader = ({ title, back = false }) => {
  const navigate = useNavigate();
  return <header className="admin-header"><div>{back ? <button type="button" aria-label="이전 페이지" onClick={() => navigate(-1)}>←</button> : <Link to="/admin" className="admin-header__brand">YB-bly <span>ADMIN</span></Link>}</div><h1>{title}</h1><div className="admin-header__actions"><Link to="/admin/products" aria-label="관리자 검색">⌕</Link><Link to="/admin/mypage" aria-label="관리자 정보">A</Link></div></header>;
};

export default AdminHeader;
