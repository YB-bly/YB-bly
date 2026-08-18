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

export const normalizeProduct = (product) => {
  if (!product) {
    return null;
  }

  return {
    ...product,

    originalPrice:
      product.original_price ??
      product.originalPrice ??
      product.price,

    discount:
      product.discount_percent ??
      product.discountPercent ??
      product.discount ??
      0,

    reviews:
      product.reviewCount ??
      product.reviews ??
      0,

    image:
      product.image_url ||
      product.image ||
      fallbackImages[product.id] ||
      "",

    rating: Number(
      product.rating ?? 0
    ),

    stock: Number(
      product.stock ?? 0
    ),

    // 현재 백엔드 상품 테이블에는 sizes가 없으므로
    // 상품 상세에서는 기본 FREE 옵션을 사용
    sizes:
      product.sizes?.length
        ? product.sizes
        : ["FREE"],
  };
};


/*
 * 화면의 정렬 이름 → DB ORDER BY 표현식
 */
const sortMap = {
  추천순: "rating DESC",
  "낮은 가격순": "price ASC",
  "리뷰 많은순": "reviewCount DESC",
};


export const getProducts = async (
  category,
  sort = "추천순"
) => {
  const params = {
    sort:
      sortMap[sort] ||
      "created_at DESC",
  };

  if (
    category &&
    category !== "전체"
  ) {
    params.category = category;
  }

  const response =
    await api.get(
      "/products",
      {
        params,
      }
    );

  return response.data.map(
    normalizeProduct
  );
};


export const getProduct = async (
  id
) => {
  const response =
    await api.get(
      `/products/${id}`
    );

  return normalizeProduct(
    response.data
  );
};


export const searchProducts = async (
  query
) => {
  const response =
    await api.get(
      "/products/search",
      {
        params: {
          q: query,
        },
      }
    );

  return response.data.map(
    normalizeProduct
  );
};