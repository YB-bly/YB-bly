import item1 from "../assets/img/home/item1.png";
import item2 from "../assets/img/home/item2.png";
import item3 from "../assets/img/home/item3.png";
import item4 from "../assets/img/home/item4.png";
import item5 from "../assets/img/home/item5.png";
import item6 from "../assets/img/home/item6.png";

export const products = [
  {
    id: 1,
    brand: "융보와요",
    name: "(최단일) 미엘 클라라 블라우스 원피스",
    price: 44650,
    originalPrice: 55813,
    discount: 20,
    rating: 4.9,
    reviews: 24,
    badge: "빠른출고",
    image: item1,
  },
  {
    id: 2,
    brand: "융로우먼트",
    name: "[여름바지/3기장선택] 와이드 밴딩 팬츠",
    price: 26520,
    originalPrice: 54122,
    discount: 51,
    rating: 4.8,
    reviews: 47566,
    badge: "오늘출발",
    image: item2,
  },
  {
    id: 3,
    brand: "융프라와우",
    name: "여름 찰랑 와우 감탄사 절로나와 셔츠",
    price: 49900,
    originalPrice: 77969,
    discount: 36,
    rating: 4.9,
    reviews: 23298,
    badge: "빠른배송",
    image: item3,
  },
  {
    id: 4,
    brand: "융어데이",
    name: "여름 시스루 루즈핏 체크 셔츠",
    price: 32800,
    originalPrice: 40000,
    discount: 18,
    rating: 4.7,
    reviews: 1203,
    badge: "단독상품",
    image: item4,
  },
  {
    id: 5,
    brand: "융티랩",
    name: "하늘하늘 날아갈지도 몰라 블라우스",
    price: 39900,
    originalPrice: 57000,
    discount: 30,
    rating: 4.8,
    reviews: 7624,
    badge: "하루특가",
    image: item5,
  },
  {
    id: 6,
    brand: "융랙무드",
    name: "시원한 여름 청바지 이거야 이거",
    price: 29900,
    originalPrice: 39867,
    discount: 25,
    rating: 4.9,
    reviews: 842,
    badge: "빠른출고",
    image: item6,
  },
];

export const formatPrice = (price) =>
  `${price.toLocaleString("ko-KR")}원`;