import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { adminCategories } from "../data/adminData";

const AdminCategories = () => {
  const [categories, setCategories] = useState(adminCategories);
  const toggle = (name) => setCategories(categories.map((category) => category.name === name ? { ...category, visible: !category.visible } : category));
  return <div className="admin-categories-page admin-page"><div className="container"><AdminHeader title="카테고리 관리" back /><main className="admin-categories"><div className="admin-categories__title"><div><h2>패션 카테고리</h2><span>노출 순서와 상태를 관리하세요.</span></div><button type="button">+ 추가</button></div><section>{categories.map((category, index) => <article key={category.name}><b>☰</b><div><strong>{category.name}</strong><span>등록 상품 {category.count}개</span></div><button className={category.visible ? "is-active" : ""} type="button" onClick={() => toggle(category.name)}>{category.visible ? "노출" : "숨김"}</button><em>{index + 1}</em></article>)}</section></main><AdminBottomNavigation /></div></div>;
};

export default AdminCategories;
