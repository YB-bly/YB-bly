import api from "./api";

import item1 from "../assets/img/home/item1.png";
import item2 from "../assets/img/home/item2.png";
import item3 from "../assets/img/home/item3.png";
import item4 from "../assets/img/home/item4.png";
import item5 from "../assets/img/home/item5.png";
import item6 from "../assets/img/home/item6.png";

const fallbackImages = {
  1: item1,
  2: item2,
  3: item3,
  4: item4,
  5: item5,
  6: item6,
};

const normalizeWishlistProduct = (item) => ({
  ...item,

  id: Number(item.id),

  wishlistId: Number(
    item.wishlistId
  ),

  originalPrice:
    item.original_price ??
    item.originalPrice ??
    item.price,

  discount:
    item.discount_percent ??
    item.discountPercent ??
    item.discount ??
    0,

  reviews:
    item.reviewCount ??
    item.reviews ??
    0,

  rating: Number(
    item.rating ?? 0
  ),

  stock: Number(
    item.stock ?? 0
  ),

  image:
    item.image_url ||
    item.image ||
    fallbackImages[item.id] ||
    "",
});

export const getWishlist = async () => {
  const response =
    await api.get("/wishlist");

  return response.data.map(
    normalizeWishlistProduct
  );
};

export const addWishlistItem = async (
  productId
) => {
  const response =
    await api.post("/wishlist", {
      productId,
    });

  return response.data;
};

export const removeWishlistItem = async (
  productId
) => {
  const response =
    await api.delete(
      `/wishlist/${productId}`
    );

  return response.data;
};