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

const normalizeCartCouponSummary = (data) => ({
  subtotal: Number(data.subtotal ?? 0),
  discountAmount: Number(data.discount_amount ?? 0),
  totalAmount: Number(data.total_amount ?? 0),
  appliedCoupons: data.applied_coupons ?? [],
});

export const applyCartCoupon = async (couponCode) => {
  const response = await api.post("/cart/coupons/apply", {
    coupon_code: couponCode,
  });

  return normalizeCartCouponSummary(response.data);
};

export const getCartCouponSummary = async () => {
  const response = await api.get("/cart/coupons/summary");
  return normalizeCartCouponSummary(response.data);
};