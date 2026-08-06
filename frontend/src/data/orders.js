import { products } from "./products";

export const orders = [
  {
    id: 1,
    number: "20260801-00123",
    date: "2026.08.01",
    status: "배송완료",
    product: products[0],
    option: "화이트 / M",
    recipient: "테스트 사용자",
    phone: "010-0000-0000",
    address: "서울특별시 테스트구 예시로 00",
  },
  {
    id: 2,
    number: "20260722-00817",
    date: "2026.07.22",
    status: "배송중",
    product: products[4],
    option: "크림 / FREE",
    recipient: "테스트 사용자",
    phone: "010-0000-0000",
    address: "서울특별시 테스트구 예시로 00",
  },
];
