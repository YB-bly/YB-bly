import { useState } from "react";
import { useNavigate, useAdminProductParams } from "../router-hooks";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import { deleteManagedProduct, getManagedCategories, getManagedProduct, saveManagedProduct } from "../data/shopRepository";

const emptyProduct = { name: "", brand: "", category: "상의", price: "", originalPrice: "", stock: "", status: "판매중", badge: "", tags: [], sizes: ["FREE"], description: "", image: "" };

const AdminProductUpload = () => {
  const navigate = useNavigate();
  const { productId } = useAdminProductParams();
  const existing = productId ? getManagedProduct(productId) : null;
  const [form, setForm] = useState(() => existing ? { ...emptyProduct, ...existing } : emptyProduct);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const categories = getManagedCategories();
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.image) { setError("대표 이미지를 선택해 주세요."); return; }
    saveManagedProduct({ ...form, id: existing?.id, price: Number(form.price), originalPrice: Number(form.originalPrice), stock: Number(form.stock), status: Number(form.stock) === 0 && form.status === "판매중" ? "품절" : form.status });
    setSaved(true); setError("");
    setTimeout(() => navigate("/admin/products"), 500);
  };
  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) { setError("로컬 저장용 이미지는 1.5MB 이하만 사용할 수 있어요."); return; }
    const reader = new FileReader();
    reader.onload = () => update("image", reader.result);
    reader.readAsDataURL(file);
  };
  const remove = () => {
    if (existing && window.confirm("이 상품을 삭제할까요?")) { deleteManagedProduct(existing.id); navigate("/admin/products", { replace: true }); }
  };
  return <div className="admin-product-upload-page admin-page"><div className="container"><AdminHeader title={existing ? "상품 수정" : "상품 업로드"} back /><main className="admin-product-upload"><form onSubmit={submit}><section><h2>기본 정보</h2><label>상품명<input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="상품명을 입력하세요" /></label><label>브랜드<input required value={form.brand} onChange={(e) => update("brand", e.target.value)} placeholder="브랜드명을 입력하세요" /></label><label>카테고리<select value={form.category} onChange={(e) => update("category", e.target.value)}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label><label>판매 상태<select value={form.status} onChange={(e) => update("status", e.target.value)}><option>판매중</option><option>품절</option><option>판매중지</option></select></label></section><section><h2>판매 정보</h2><label>판매가<input required min="0" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0" /></label><label>정상가<input required min="0" type="number" value={form.originalPrice} onChange={(e) => update("originalPrice", e.target.value)} placeholder="0" /></label><label>재고 수량<input required min="0" max="9999" type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} placeholder="0" /></label><label>대표 배지<input value={form.badge} onChange={(e) => update("badge", e.target.value)} placeholder="예: 오늘출발" /></label><label>검색 태그<input value={(form.tags ?? []).join(", ")} onChange={(e) => update("tags", e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} placeholder="여름, 무료배송" /></label><label>사이즈<input value={(form.sizes ?? []).join(", ")} onChange={(e) => update("sizes", e.target.value.split(",").map((size) => size.trim()).filter(Boolean))} placeholder="S, M, L" /></label></section><section><h2>상품 이미지</h2><label className="admin-product-upload__file">{form.image ? <img src={form.image} alt="대표 이미지 미리보기" /> : <>＋<span>대표 이미지를 선택하세요</span></>}<input type="file" accept="image/*" onChange={selectImage} /></label></section><section><h2>상세 설명</h2><textarea rows="6" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="상품 설명을 입력하세요" /></section>{error && <p className="admin-product-upload__error">{error}</p>}{saved && <p className="admin-product-upload__success">상품이 저장됐습니다.</p>}<div className="admin-product-upload__actions">{existing && <button className="is-delete" type="button" onClick={remove}>상품 삭제</button>}<button className="admin-product-upload__submit" type="submit">{existing ? "변경사항 저장" : "상품 저장"}</button></div></form></main><AdminBottomNavigation /></div></div>;
};

export default AdminProductUpload;
