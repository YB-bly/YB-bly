import { useState } from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const KEY = "yb-bly-inquiries";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; } };

const Inquiries = () => {
  const [items, setItems] = useState(read);
  const [writing, setWriting] = useState(false);
  const submit = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const next = [{ id: Date.now(), category: form.get("category"), title: form.get("title").trim(), content: form.get("content").trim(), status: "답변 대기", date: new Date().toLocaleDateString("ko-KR") }, ...items]; localStorage.setItem(KEY, JSON.stringify(next)); setItems(next); setWriting(false); };
  return <div className="utility-page"><div className="container"><AppHeader title="문의 내역" back /><main className="utility-content"><div className="utility-heading"><div><h1>1:1 문의</h1><span>상품과 주문에 관한 문의를 남겨주세요.</span></div><button onClick={() => setWriting(!writing)} type="button">{writing ? "닫기" : "+ 문의하기"}</button></div>{writing && <form className="utility-form" onSubmit={submit}><label>문의 유형<select name="category"><option>상품 문의</option><option>배송 문의</option><option>주문·결제 문의</option><option>기타</option></select></label><label>제목<input required maxLength="80" name="title" /></label><label>내용<textarea required minLength="10" maxLength="1000" name="content" rows="6" /></label><button type="submit">문의 등록</button><p>현재는 프론트 모의 기능이며 실제 고객센터로 전송되지 않습니다.</p></form>}<section className="utility-list">{items.map((item) => <article key={item.id}><header><strong>{item.title}</strong><em>{item.status}</em></header><span>{item.category} · {item.date}</span><p>{item.content}</p></article>)}{!items.length && !writing && <div className="empty-state"><span>?</span><strong>문의 내역이 없어요</strong></div>}</section></main><BottomNavigation /></div></div>;
};
export default Inquiries;
