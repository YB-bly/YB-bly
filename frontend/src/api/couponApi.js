import api from "./api";

const normalizeCoupon = (coupon) => ({
  ...coupon,

  id: Number(coupon.id),

  rate: Number(coupon.discount_percent ?? coupon.rate ?? 0) / 100,

  minAmount: Number(
    coupon.min_order_amount ?? coupon.minAmount ?? 0
  ),

  expiresAt:
    coupon.expires_at ?? coupon.expiresAt ?? "",
});

// 로그인한 사용자가 아직 안 쓴 쿠폰만 내려옴 (이미 쓴 쿠폰은 응답에 아예 없음)
export const getMyCoupons = async () => {
  const response = await api.get("/coupons");
  return response.data.map(normalizeCoupon);
};
