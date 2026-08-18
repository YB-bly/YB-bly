import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useAdminProductParams,
} from "../router-hooks";

import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";

import {
  getProduct,
} from "../api/productApi";

import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
} from "../api/adminApi";

const categories = [
  "상의",
  "하의",
  "원피스",
  "가방",
  "신발",
  "뷰티",
];

const emptyProduct = {
  name: "",
  brand: "",
  category: "상의",
  price: "",
  originalPrice: "",
  discountPercent: "",
  stock: "",
  badge: "",
  description: "",
  image: "",
};

const AdminProductUpload =
  () => {
    const navigate =
      useNavigate();

    const { productId } =
      useAdminProductParams();

    const [
      form,
      setForm,
    ] = useState(
      emptyProduct
    );

    const [
      loading,
      setLoading,
    ] = useState(
      Boolean(productId)
    );

    const [
      submitting,
      setSubmitting,
    ] = useState(false);

    const [
      saved,
      setSaved,
    ] = useState(false);

    const [
      error,
      setError,
    ] = useState("");

    useEffect(() => {
      if (!productId) {
        return;
      }

      const fetchProduct =
        async () => {
          try {
            setLoading(true);
            setError("");

            const product =
              await getProduct(
                productId
              );

            setForm({
              name:
                product.name ||
                "",

              brand:
                product.brand ||
                "",

              category:
                product.category ||
                "상의",

              price:
                product.price ??
                "",

              originalPrice:
                product.originalPrice ??
                "",

              discountPercent:
                product.discount ??
                0,

              stock:
                product.stock ??
                "",

              badge:
                product.badge ||
                "",

              description:
                product.description ||
                "",

              image:
                product.image ||
                "",
            });
          } catch (error) {
            console.error(
              "상품 정보 조회 실패:",
              error
            );

            setError(
              error.response?.data
                ?.error ||
                "상품 정보를 불러오지 못했습니다."
            );
          } finally {
            setLoading(false);
          }
        };

      fetchProduct();
    }, [productId]);

    const update = (
      key,
      value
    ) => {
      setForm(
        (current) => ({
          ...current,
          [key]: value,
        })
      );
    };

    const selectImage = (
      event
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      if (
        file.size >
        1_500_000
      ) {
        setError(
          "이미지는 1.5MB 이하만 사용할 수 있어요."
        );
        return;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        update(
          "image",
          reader.result
        );

        setError("");
      };

      reader.readAsDataURL(
        file
      );
    };

    const submit =
      async (event) => {
        event.preventDefault();

        if (
          !form.name.trim() ||
          !form.brand.trim()
        ) {
          setError(
            "상품명과 브랜드를 입력해 주세요."
          );
          return;
        }

        try {
          setSubmitting(true);
          setSaved(false);
          setError("");

          const payload = {
            name:
              form.name.trim(),

            brand:
              form.brand.trim(),

            price:
              Number(
                form.price
              ),

            originalPrice:
              Number(
                form.originalPrice ||
                  form.price
              ),

            discountPercent:
              Number(
                form.discountPercent ||
                  0
              ),

            badge:
              form.badge.trim(),

            category:
              form.category,

            description:
              form.description.trim(),

            image_url:
              form.image || "",

            stock:
              Number(
                form.stock
              ),
          };

          if (productId) {
            await updateAdminProduct(
              productId,
              payload
            );
          } else {
            await createAdminProduct(
              payload
            );
          }

          setSaved(true);

          window.setTimeout(
            () => {
              navigate(
                "/admin/products"
              );
            },
            500
          );
        } catch (error) {
          console.error(
            "상품 저장 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "상품을 저장하지 못했습니다."
          );
        } finally {
          setSubmitting(false);
        }
      };

    const remove =
      async () => {
        if (!productId) {
          return;
        }

        if (
          !window.confirm(
            "이 상품을 삭제할까요?"
          )
        ) {
          return;
        }

        try {
          setError("");

          await deleteAdminProduct(
            productId
          );

          navigate(
            "/admin/products",
            {
              replace: true,
            }
          );
        } catch (error) {
          console.error(
            "상품 삭제 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "상품을 삭제하지 못했습니다."
          );
        }
      };

    if (loading) {
      return (
        <div className="admin-product-upload-page admin-page">
          <div className="container">
            <AdminHeader
              title="상품 수정"
              back
            />

            <main className="empty-state">
              <strong>
                상품 정보를
                불러오는 중...
              </strong>
            </main>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-product-upload-page admin-page">
        <div className="container">
          <AdminHeader
            title={
              productId
                ? "상품 수정"
                : "상품 업로드"
            }
            back
          />

          <main className="admin-product-upload">
            <form
              onSubmit={submit}
            >
              <section>
                <h2>
                  기본 정보
                </h2>

                <label>
                  상품명
                  <input
                    required
                    value={
                      form.name
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "name",
                        event.target
                          .value
                      )
                    }
                    placeholder="상품명을 입력하세요"
                  />
                </label>

                <label>
                  브랜드
                  <input
                    required
                    value={
                      form.brand
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "brand",
                        event.target
                          .value
                      )
                    }
                    placeholder="브랜드명을 입력하세요"
                  />
                </label>

                <label>
                  카테고리
                  <select
                    value={
                      form.category
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "category",
                        event.target
                          .value
                      )
                    }
                  >
                    {categories.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category
                          }
                        >
                          {
                            category
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>
              </section>

              <section>
                <h2>
                  판매 정보
                </h2>

                <label>
                  판매가
                  <input
                    required
                    min="0"
                    type="number"
                    value={
                      form.price
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "price",
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  정상가
                  <input
                    required
                    min="0"
                    type="number"
                    value={
                      form.originalPrice
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "originalPrice",
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  할인율
                  <input
                    min="0"
                    max="100"
                    type="number"
                    value={
                      form.discountPercent
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "discountPercent",
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  재고 수량
                  <input
                    required
                    min="0"
                    max="9999"
                    type="number"
                    value={
                      form.stock
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "stock",
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  대표 배지
                  <input
                    value={
                      form.badge
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "badge",
                        event.target
                          .value
                      )
                    }
                    placeholder="예: BEST"
                  />
                </label>
              </section>

              <section>
                <h2>
                  상품 이미지
                </h2>

                <label className="admin-product-upload__file">
                  {form.image ? (
                    <img
                      src={
                        form.image
                      }
                      alt="대표 이미지 미리보기"
                    />
                  ) : (
                    <>
                      ＋
                      <span>
                        대표 이미지를
                        선택하세요
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      selectImage
                    }
                  />
                </label>
              </section>

              <section>
                <h2>
                  상세 설명
                </h2>

                <textarea
                  rows="6"
                  value={
                    form.description
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      "description",
                      event.target
                        .value
                    )
                  }
                  placeholder="상품 설명을 입력하세요"
                />
              </section>

              {error && (
                <p className="admin-product-upload__error">
                  {error}
                </p>
              )}

              {saved && (
                <p className="admin-product-upload__success">
                  상품이
                  저장됐습니다.
                </p>
              )}

              <div className="admin-product-upload__actions">
                {productId && (
                  <button
                    className="is-delete"
                    type="button"
                    onClick={
                      remove
                    }
                  >
                    상품 삭제
                  </button>
                )}

                <button
                  className="admin-product-upload__submit"
                  type="submit"
                  disabled={
                    submitting
                  }
                >
                  {submitting
                    ? "저장 중..."
                    : productId
                      ? "변경사항 저장"
                      : "상품 저장"}
                </button>
              </div>
            </form>
          </main>

          <AdminBottomNavigation />
        </div>
      </div>
    );
  };

export default AdminProductUpload;