import { useState } from "react";
import { Link } from "../router";
import { useNavigate } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import FormField from "../components/FormField";

const Signup = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.currentTarget.checkValidity() && agreed) navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="container">
        <AppHeader title="회원가입" back actions={false} />
        <main className="signup">
          <div className="signup__progress" aria-label="가입 진행 단계">
            <span className="signup__progress-active" />
          </div>
          <header className="auth-header">
            <span className="auth-header__eyebrow">JOIN YB-BLY</span>
            <h1 className="auth-header__title">당신의 취향을 알려주세요</h1>
            <p className="auth-header__description">입력한 정보로 꼭 맞는 상품을 추천해 드릴게요.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <FormField label="이름" name="name" placeholder="이름을 입력해 주세요" required />
            <FormField label="이메일" name="email" type="email" placeholder="example@yb-bly.com" required />
            <FormField label="비밀번호" name="password" type="password" placeholder="영문, 숫자 포함 8자 이상" minLength="8" required hint="영문과 숫자를 포함해 8자 이상 입력해 주세요." />
            <FormField label="비밀번호 확인" name="passwordConfirm" type="password" placeholder="비밀번호를 다시 입력해 주세요" required />
            <label className="check-field signup__agreement">
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              <span><strong>[필수]</strong> 이용약관 및 개인정보 수집에 동의합니다.</span>
            </label>
            <button className="primary-button" type="submit" disabled={!agreed}>가입 완료</button>
          </form>
          <p className="auth-footer">이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
        </main>
      </div>
    </div>
  );
};

export default Signup;
