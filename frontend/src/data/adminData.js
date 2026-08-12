import { products } from "./products";
import { orders } from "./orders";

export const adminProducts = products.map((product, index) => ({ ...product, stock: [34, 12, 0, 8, 21, 5][index], status: index === 2 ? "품절" : "판매중" }));

export const adminOrders = orders.map((order, index) => ({ ...order, customer: index === 0 ? "김영블" : "이쇼핑", amount: order.product.price }));

export const adminUsers = [
  { id: 101, name: "김영블", email: "user@yb-bly.com", grade: "Silver", orders: 4, joinedAt: "2026.07.12", status: "정상" },
  { id: 102, name: "이쇼핑", email: "shopper@example.com", grade: "Gold", orders: 11, joinedAt: "2026.06.03", status: "정상" },
  { id: 103, name: "박리뷰", email: "reviewer@example.com", grade: "Silver", orders: 2, joinedAt: "2026.08.01", status: "정상" },
  { id: 104, name: "최휴면", email: "sleep@example.com", grade: "Basic", orders: 0, joinedAt: "2026.04.18", status: "휴면" },
];

export const adminReviews = [
  { id: 201, user: "김영블", product: products[0], rating: 5, content: "원단이 부드럽고 핏이 좋아요.", status: "공개", date: "2026.08.03" },
  { id: 202, user: "이쇼핑", product: products[4], rating: 4, content: "수납력이 좋고 색상도 화면과 같아요.", status: "공개", date: "2026.07.27" },
  { id: 203, user: "박리뷰", product: products[1], rating: 2, content: "배송 포장이 아쉬웠습니다.", status: "신고검토", date: "2026.08.04" },
];

export const adminCategories = [
  { name: "상의", count: 128, visible: true }, { name: "아우터", count: 76, visible: true }, { name: "팬츠/스커트", count: 94, visible: true },
  { name: "원피스/세트", count: 61, visible: true }, { name: "가방", count: 45, visible: true }, { name: "슈즈", count: 39, visible: false },
];
