import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { adminUsers } from "../data/adminData";

const AdminUsers = () => {
  const [query, setQuery] = useState("");
  const users = adminUsers.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="admin-users-page admin-page"><div className="container"><AdminHeader title="회원 관리" back /><main className="admin-users"><div className="admin-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름 또는 이메일 검색" /></div><section className="admin-users__stats"><div><span>전체 회원</span><strong>{adminUsers.length}</strong></div><div><span>신규 회원</span><strong>7</strong></div><div><span>휴면 회원</span><strong>1</strong></div></section><section className="admin-users__list">{users.map((user) => <article key={user.id}><div className="admin-users__avatar">{user.name[0]}</div><div><strong>{user.name}<em>{user.grade}</em></strong><p>{user.email}</p><span>가입 {user.joinedAt} · 주문 {user.orders}회</span></div><button type="button">{user.status}</button></article>)}</section></main><AdminBottomNavigation /></div></div>;
};

export default AdminUsers;
