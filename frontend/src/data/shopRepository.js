import {
  adminCategories,
  adminProducts,
  adminReviews,
} from "./adminData";

const PRODUCT_KEY =
  "yb-bly-managed-products";

const REVIEW_KEY =
  "yb-bly-managed-reviews";

const COUPON_KEY =
  "yb-bly-coupons-v2";

const CATEGORY_KEY =
  "yb-bly-managed-categories";

const USER_REVIEW_KEY =
  "yb-bly-user-reviews";

const RECENT_KEY =
  "yb-bly-recent-products";

const USER_KEY =
  "yb-bly-managed-users";

const SECURITY_SETTING_KEY =
  "yb-bly-admin-security-settings";

const initialCoupons = [
  {
    id: 1,
    code: "WELCOME10",
    label: "첫 구매 10% 할인",
    rate: 0.1,
    expiresAt: "2026.12.31",
  },
  {
    id: 2,
    code: "OVER100K15",
    label:
      "10만원 이상 구매 시 15% 할인",
    rate: 0.15,
    minPurchase: 100000,
    expiresAt: "2026.12.31",
  },
  {
    id: 3,
    code: "SUMMER20",
    label: "여름 상품 20% 할인",
    rate: 0.2,
    expiresAt: "2026.08.31",
  },
];

const seedCategories = [
  "원피스/세트",
  "팬츠/스커트",
  "상의",
  "아우터",
  "상의",
  "팬츠/스커트",
];

const seedProducts =
  adminProducts.map(
    (product, index) => ({
      ...product,

      category:
        product.category ??
        seedCategories[index],

      description:
        product.description ??
        "부드러운 촉감과 여유로운 실루엣으로 편안하게 착용할 수 있는 상품입니다.",

      tags:
        product.tags ?? [
          "무료배송",
          index % 2 === 0
            ? "마일리지 2배"
            : "여름추천",
        ],

      sizes:
        product.sizes ?? [
          "S",
          "M",
          "L",
        ],
    })
  );

const read = (
  key,
  fallback
) => {
  try {
    const value =
      localStorage.getItem(
        key
      );

    return value
      ? JSON.parse(value)
      : fallback;
  } catch {
    return fallback;
  }
};

const write = (
  key,
  value
) => {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

  window.dispatchEvent(
    new CustomEvent(
      "yb-bly-data-change",
      {
        detail: {
          key,
        },
      }
    )
  );

  return value;
};

export const getManagedProducts =
  () =>
    read(
      PRODUCT_KEY,
      seedProducts
    );

export const getManagedProduct =
  (id) =>
    getManagedProducts().find(
      (product) =>
        Number(product.id) ===
        Number(id)
    );

export const saveManagedProduct =
  (input) => {
    const products =
      getManagedProducts();

    const existing =
      input.id
        ? getManagedProduct(
            input.id
          )
        : null;

    const product = {
      rating: 0,
      reviews: 0,
      discount: 0,
      tags: [],
      sizes: ["FREE"],

      ...existing,
      ...input,

      id:
        existing?.id ??
        Date.now(),
    };

    product.discount =
      product.originalPrice >
      product.price
        ? Math.round(
            (1 -
              product.price /
                product.originalPrice) *
              100
          )
        : 0;

    return write(
      PRODUCT_KEY,

      existing
        ? products.map(
            (item) =>
              Number(
                item.id
              ) ===
              Number(
                product.id
              )
                ? product
                : item
          )
        : [
            product,
            ...products,
          ]
    );
  };

export const deleteManagedProduct =
  (id) =>
    write(
      PRODUCT_KEY,

      getManagedProducts().filter(
        (product) =>
          Number(
            product.id
          ) !== Number(id)
      )
    );

export const getManagedReviews =
  () =>
    read(
      REVIEW_KEY,

      adminReviews.map(
        (review) => ({
          ...review,

          verified: true,

          reported:
            review.status ===
            "신고검토",
        })
      )
    );

export const updateManagedReview =
  (
    id,
    changes
  ) =>
    write(
      REVIEW_KEY,

      getManagedReviews().map(
        (review) =>
          Number(
            review.id
          ) === Number(id)
            ? {
                ...review,
                ...changes,
              }
            : review
      )
    );

export const getProductReviews =
  (productId) =>
    getManagedReviews().filter(
      (review) =>
        Number(
          review.product.id
        ) ===
          Number(
            productId
          ) &&
        review.status !==
          "숨김"
    );

export const getCoupons =
  () =>
    read(
      COUPON_KEY,
      initialCoupons
    );

export const markCouponUsed =
  (couponId) =>
    write(
      COUPON_KEY,

      getCoupons().filter(
        (coupon) =>
          Number(
            coupon.id
          ) !==
          Number(
            couponId
          )
      )
    );

export const getManagedCategories =
  () =>
    read(
      CATEGORY_KEY,
      adminCategories
    ).map(
      (category) => ({
        ...category,

        count:
          getManagedProducts().filter(
            (product) =>
              product.category ===
              category.name
          ).length,
      })
    );

export const saveManagedCategories =
  (categories) =>
    write(
      CATEGORY_KEY,
      categories
    );

export const renameManagedCategory =
  (
    oldName,
    newName
  ) => {
    write(
      PRODUCT_KEY,

      getManagedProducts().map(
        (product) =>
          product.category ===
          oldName
            ? {
                ...product,
                category:
                  newName,
              }
            : product
      )
    );

    return saveManagedCategories(
      getManagedCategories().map(
        (category) =>
          category.name ===
          oldName
            ? {
                ...category,
                name: newName,
              }
            : category
      )
    );
  };

export const deleteManagedCategory =
  (name) =>
    saveManagedCategories(
      getManagedCategories().filter(
        (category) =>
          category.name !==
          name
      )
    );

const initialUserReviews = [
  {
    id: 1,

    product:
      seedProducts[0],

    rating: 5,

    date: "2026.08.03",

    text:
      "원단이 부드럽고 핏이 여유로워서 한여름에도 편하게 입기 좋아요. 프린트 색감도 사진과 같아요.",

    option:
      "화이트 / M",

    photos: [
      seedProducts[0].image,
    ],

    helpful: 8,

    helpfulByMe: false,
  },
  {
    id: 2,

    product:
      seedProducts[4],

    rating: 4,

    date: "2026.07.27",

    text:
      "생각보다 수납력이 좋고 어떤 옷에도 잘 어울려요. 스트랩 길이도 적당합니다.",

    option:
      "크림 / FREE",

    photos: [],

    helpful: 3,

    helpfulByMe: false,
  },
];

export const getUserReviews =
  () =>
    read(
      USER_REVIEW_KEY,
      initialUserReviews
    );

export const saveUserReview =
  (review) => {
    const reviews =
      getUserReviews();

    const existing =
      review.id
        ? reviews.find(
            (item) =>
              Number(
                item.id
              ) ===
              Number(
                review.id
              )
          )
        : null;

    const saved = {
      helpful: 0,
      helpfulByMe: false,

      date:
        new Date()
          .toLocaleDateString(
            "ko-KR"
          )
          .replace(
            /\. /g,
            "."
          )
          .replace(
            ".",
            ""
          ),

      ...existing,
      ...review,

      id:
        existing?.id ??
        Date.now(),
    };

    write(
      USER_REVIEW_KEY,

      existing
        ? reviews.map(
            (item) =>
              Number(
                item.id
              ) ===
              Number(
                saved.id
              )
                ? saved
                : item
          )
        : [
            saved,
            ...reviews,
          ]
    );

    const publicReview = {
      id: `user-${saved.id}`,

      user:
        "테스트 사용자",

      product:
        saved.product,

      rating:
        saved.rating,

      content:
        saved.text,

      status: "공개",

      date:
        saved.date,

      verified: true,

      reported: false,

      photos:
        saved.photos,
    };

    const managed =
      getManagedReviews().filter(
        (item) =>
          item.id !==
          publicReview.id
      );

    write(
      REVIEW_KEY,
      [
        publicReview,
        ...managed,
      ]
    );

    return saved;
  };

export const deleteUserReview =
  (id) => {
    write(
      USER_REVIEW_KEY,

      getUserReviews().filter(
        (review) =>
          Number(
            review.id
          ) !== Number(id)
      )
    );

    write(
      REVIEW_KEY,

      getManagedReviews().filter(
        (review) =>
          review.id !==
          `user-${id}`
      )
    );
  };

export const toggleUserReviewHelpful =
  (id) =>
    write(
      USER_REVIEW_KEY,

      getUserReviews().map(
        (review) =>
          Number(
            review.id
          ) === Number(id)
            ? {
                ...review,

                helpfulByMe:
                  !review.helpfulByMe,

                helpful:
                  Math.max(
                    0,

                    (review.helpful ??
                      0) +
                      (review.helpfulByMe
                        ? -1
                        : 1)
                  ),
              }
            : review
      )
    );

export const addRecentProduct =
  (productId) =>
    write(
      RECENT_KEY,

      [
        Number(
          productId
        ),

        ...read(
          RECENT_KEY,
          []
        ).filter(
          (id) =>
            Number(id) !==
            Number(
              productId
            )
        ),
      ].slice(0, 20)
    );

export const getRecentProducts =
  () =>
    read(
      RECENT_KEY,
      []
    )
      .map(
        getManagedProduct
      )
      .filter(Boolean);

export const getAdminUsers =
  (fallback) =>
    read(
      USER_KEY,
      fallback
    );

export const updateAdminUser =
  (
    id,
    changes,
    fallback
  ) =>
    write(
      USER_KEY,

      getAdminUsers(
        fallback
      ).map(
        (user) =>
          Number(
            user.id
          ) === Number(id)
            ? {
                ...user,
                ...changes,
              }
            : user
      )
    );

export const getAdminSecuritySettings =
  () =>
    read(
      SECURITY_SETTING_KEY,

      {
        loginAlerts: true,
        sessionMinutes: 30,
        requireReauth: true,
      }
    );

export const saveAdminSecuritySettings =
  (settings) =>
    write(
      SECURITY_SETTING_KEY,
      settings
    );