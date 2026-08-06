import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";

const AdminProductUpload = () => {
  const [saved, setSaved] = useState(false);
  const submit = (event) => { event.preventDefault(); setSaved(true); };
  return <div className="admin-product-upload-page admin-page"><div className="container"><AdminHeader title="상품 업로드" back /><main className="admin-product-upload"><form onSubmit={submit}><section><h2>기본 정보</h2><label>상품명<input required placeholder="상품명을 입력하세요" /></label><label>브랜드<input required placeholder="브랜드명을 입력하세요" /></label><label>카테고리<select><option>상의</option><option>아우터</option><option>팬츠/스커트</option><option>원피스/세트</option></select></label></section><section><h2>판매 정보</h2><label>판매가<input required min="0" type="number" placeholder="0" /></label><label>정상가<input required min="0" type="number" placeholder="0" /></label><label>재고 수량<input required min="0" max="9999" type="number" placeholder="0" /></label></section><section><h2>상품 이미지</h2><label className="admin-product-upload__file">＋<span>대표 이미지를 선택하세요</span><input type="file" accept="image/*" /></label></section><section><h2>상세 설명</h2><textarea rows="6" placeholder="상품 설명을 입력하세요" /></section>{saved && <p className="admin-product-upload__success">상품이 임시 저장됐습니다.</p>}<button className="admin-product-upload__submit" type="submit">상품 저장</button></form></main><AdminBottomNavigation /></div></div>;
};

export default AdminProductUpload;
