import { useState } from "react";
import { Link } from "../router";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const categoryGroups = {
  패션: {
    상의: ["매일 직진배송", "긴소매 티셔츠", "반소매 티셔츠", "셔츠", "블라우스", "니트/스웨터", "맨투맨", "후드", "슬리브리스"],
    아우터: ["매일 직진배송", "카디건", "재킷", "점퍼", "레더재킷", "트렌치코트", "트위드재킷", "사파리재킷", "베스트", "숏코트", "하프코트", "롱코트", "숏패딩", "롱패딩", "경량 패딩", "퍼코트"],
    "팬츠/스커트": ["데님", "슬랙스", "코튼팬츠", "숏팬츠", "미니스커트", "롱스커트"],
    "원피스/세트": ["미니 원피스", "롱 원피스", "점프수트", "투피스 세트"],
    "이너웨어/잠옷": ["브라", "팬티", "홈웨어", "파자마"],
    트레이닝: ["트레이닝 상의", "트레이닝 팬츠", "스포츠 세트"],
    "플러스사이즈": ["상의", "팬츠", "원피스", "아우터"],
    임부복: ["임부 원피스", "임부 팬츠", "수유복"],
    비치웨어: ["수영복", "커버업", "래시가드"],
    가방: ["숄더백", "크로스백", "백팩", "에코백"],
    슈즈: ["스니커즈", "로퍼", "샌들", "부츠"],
    주얼리: ["목걸이", "귀걸이", "반지", "팔찌"],
    패션잡화: ["모자", "벨트", "양말", "스카프"],
  },
  뷰티: {
    스킨케어: ["토너", "세럼", "크림", "마스크팩"],
    메이크업: ["베이스", "립", "아이", "치크"],
    헤어: ["샴푸", "트리트먼트", "스타일링"],
  },
  "라이프/푸드": {
    라이프: ["인테리어", "주방", "디지털", "반려동물"],
    푸드: ["간편식", "건강식품", "디저트", "음료"],
  },
};

const Categories = () => {
  const [tab, setTab] = useState("패션");
  const [section, setSection] = useState(Object.keys(categoryGroups.패션)[0]);
  const groups = categoryGroups[tab];

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setSection(Object.keys(categoryGroups[nextTab])[0]);
  };

  return (
    <div className="categories-page">
      <div className="container">
        <AppHeader title="카테고리" back />
        <main className="categories">
          <div className="categories__tabs" role="tablist">
            {Object.keys(categoryGroups).map((item) => (
              <button key={item} className={tab === item ? "is-active" : ""} onClick={() => changeTab(item)} role="tab" aria-selected={tab === item}>{item}</button>
            ))}
          </div>

          <div className="categories__body">
            <aside className="categories__sidebar" aria-label={`${tab} 세부 카테고리`}>
              {Object.keys(groups).map((item) => (
                <button key={item} className={section === item ? "is-active" : ""} onClick={() => setSection(item)}>{item}</button>
              ))}
            </aside>
            <section className="categories__content">
              {Object.entries(groups).map(([title, items]) => (
                <div className="categories__group" key={title} id={`category-${title}`}>
                  <div className="categories__group-title">
                    <span className="categories__thumbnail" aria-hidden="true">{title.slice(0, 1)}</span>
                    <h2>{title}</h2><span>›</span>
                  </div>
                  <div className="categories__links">
                    {items.map((item, index) => <Link className={index === 0 ? "is-highlighted" : ""} to={`/products?category=${encodeURIComponent(title)}`} key={item}>{item}</Link>)}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Categories;
