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

export const getMyCoupons = async () => {
  const response = await api.get("/coupons");
  return response.data.map(normalizeCoupon);
};
