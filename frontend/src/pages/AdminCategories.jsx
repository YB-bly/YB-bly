import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { deleteManagedCategory, getManagedCategories, renameManagedCategory, saveManagedCategories } from "../data/shopRepository";

const AdminCategories = () => {
  const [categories, setCategories] = useState(getManagedCategories);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState(null);

  const commit = (next) => { setCategories(next); saveManagedCategories(next); };
  const toggle = (categoryName) => commit(categories.map((category) => category.name === categoryName ? { ...category, visible: !category.visible } : category));
  const move = (from, to) => {
    if (from === to || to < 0 || to >= categories.length) return;
    const next = [...categories];
    const [selected] = next.splice(from, 1);
    next.splice(to, 0, selected);
    commit(next);
  };
  const addCategory = (event) => {
    event.preventDefault();
    const normalized = name.trim();
    if (!normalized) { setError("카테고리명을 입력해 주세요."); return; }
    if (categories.some((category) => category.name.toLowerCase() === normalized.toLowerCase())) { setError("이미 등록된 카테고리입니다."); return; }
    commit([...categories, { name: normalized, count: 0, visible: true }]);
    setName(""); setError(""); setAdding(false);
  };
  const rename = (category) => { const nextName = window.prompt("새 카테고리명을 입력하세요.", category.name)?.trim(); if (!nextName || nextName === category.name) return; if (categories.some((item) => item.name.toLowerCase() === nextName.toLowerCase())) { window.alert("이미 등록된 카테고리입니다."); return; } renameManagedCategory(category.name, nextName); setCategories(getManagedCategories()); };
  const remove = (category) => { if (category.count > 0) { window.alert("등록 상품이 있는 카테고리는 삭제할 수 없습니다. 상품 카테고리를 먼저 변경해 주세요."); return; } if (window.confirm(`${category.name} 카테고리를 삭제할까요?`)) { deleteManagedCategory(category.name); setCategories(getManagedCategories()); } };

  return <div className="admin-categories-page admin-page"><div className="container"><AdminHeader title="카테고리 관리" back /><main className="admin-categories"><div className="admin-categories__title"><div><h2>패션 카테고리</h2><span>드래그하거나 화살표로 노출 순서를 변경하세요.</span></div><button type="button" onClick={() => { setAdding(!adding); setError(""); }}>{adding ? "닫기" : "+ 추가"}</button></div>{adding && <form className="admin-categories__add" onSubmit={addCategory}><label htmlFor="new-category">새 카테고리명</label><div><input id="new-category" autoFocus maxLength="30" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="예: 액세서리" /><button type="submit">추가</button></div>{error && <p>{error}</p>}</form>}<section>{categories.map((category, index) => <article className={dragIndex === index ? "is-dragging" : ""} draggable onDragStart={() => setDragIndex(index)} onDragEnd={() => setDragIndex(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragIndex !== null) move(dragIndex, index); setDragIndex(null); }} key={category.name}><b title="드래그해서 순서 변경" aria-hidden="true">☰</b><div><strong>{category.name}</strong><span>등록 상품 {category.count}개</span></div><div className="admin-categories__controls"><button type="button" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label={`${category.name} 위로 이동`}>↑</button><button type="button" disabled={index === categories.length - 1} onClick={() => move(index, index + 1)} aria-label={`${category.name} 아래로 이동`}>↓</button><button type="button" onClick={() => rename(category)} aria-label={`${category.name} 이름 수정`}>✎</button><button type="button" onClick={() => remove(category)} aria-label={`${category.name} 삭제`}>×</button><button className={category.visible ? "is-active" : ""} type="button" onClick={() => toggle(category.name)}>{category.visible ? "노출" : "숨김"}</button></div><em>{index + 1}</em></article>)}</section></main><AdminBottomNavigation /></div></div>;
};

export default AdminCategories;
