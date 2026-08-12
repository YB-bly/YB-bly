import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { adminUsers } from "../data/adminData";
import { getAdminUsers, updateAdminUser } from "../data/shopRepository";
import Pagination from "../components/Pagination";

const AdminUsers = () => {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState(() => getAdminUsers(adminUsers));
  const [page, setPage] = useState(1);
  const users = members.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  const changeStatus = (user) => { const status = user.status === "정상" ? "이용정지" : "정상"; updateAdminUser(user.id, { status }, adminUsers); setMembers(getAdminUsers(adminUsers)); };
  return <div className="admin-users-page admin-page"><div className="container"><AdminHeader title="회원 관리" back /><main className="admin-users"><div className="admin-search"><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="이름 또는 이메일 검색" /></div><section className="admin-users__stats"><div><span>전체 회원</span><strong>{members.length}</strong></div><div><span>정상 회원</span><strong>{members.filter((user) => user.status === "정상").length}</strong></div><div><span>제한 회원</span><strong>{members.filter((user) => user.status !== "정상").length}</strong></div></section><section className="admin-users__list">{users.slice((page - 1) * 5, page * 5).map((user) => <article key={user.id}><div className="admin-users__avatar">{user.name[0]}</div><div><strong>{user.name}<em>{user.grade}</em></strong><p>{user.email}</p><span>가입 {user.joinedAt} · 주문 {user.orders}회</span></div><button className={user.status !== "정상" ? "is-restricted" : ""} type="button" onClick={() => changeStatus(user)}>{user.status}</button></article>)}</section><Pagination page={page} total={users.length} onChange={setPage} /></main><AdminBottomNavigation /></div></div>;
};

export default AdminUsers;
