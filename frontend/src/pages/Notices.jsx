import { useState } from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const notices = [
  { id: 1, title: "YB-bly 서비스 점검 안내", date: "2026.08.10", content: "더 안정적인 서비스를 위해 8월 15일 새벽에 모의 서비스 점검이 진행됩니다." },
  { id: 2, title: "여름 배송 일정 안내", date: "2026.08.05", content: "택배사 일정에 따라 일부 지역의 배송이 1~2일 지연될 수 있습니다." },
  { id: 3, title: "리뷰 운영 정책 안내", date: "2026.07.28", content: "상품과 무관하거나 타인의 권리를 침해하는 리뷰는 검토 후 숨김 처리될 수 있습니다." },
];

const Notices = () => { const [open, setOpen] = useState(null); return <div className="utility-page"><div className="container"><AppHeader title="공지사항" back /><main className="utility-content"><div className="utility-heading"><h1>공지사항</h1><span>새로운 소식과 이용 안내입니다.</span></div><section className="notice-list">{notices.map((item) => <article key={item.id}><button onClick={() => setOpen(open === item.id ? null : item.id)} type="button" aria-expanded={open === item.id}><div><strong>{item.title}</strong><time>{item.date}</time></div><span>{open === item.id ? "−" : "+"}</span></button>{open === item.id && <p>{item.content}</p>}</article>)}</section></main><BottomNavigation /></div></div>; };
export default Notices;
