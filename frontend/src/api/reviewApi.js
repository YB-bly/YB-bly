import api from "./api";

const normalizeReview = (review) => ({
  ...review,

  id: Number(review.id),

  rating: Number(review.rating ?? 0),

  content: review.content ?? "",

  userName:
    review.userName ??
    review.user_name ??
    "사용자",

  createdAt:
    review.created_at ??
    review.createdAt ??
    "",
});

export const getProductReviews = async (
  productId
) => {
  const response = await api.get(
    `/reviews/product/${productId}`
  );

  return response.data.map(
    normalizeReview
  );
};

export const createReview = async ({
  productId,
  orderId,
  content,
  rating,
}) => {
  const response = await api.post(
    "/reviews",
    {
      productId,
      orderId,
      content,
      rating,
    }
  );

  return response.data;
};

export const deleteReview = async (
  reviewId
) => {
  const response = await api.delete(
    `/reviews/${reviewId}`
  );

  return response.data;
};