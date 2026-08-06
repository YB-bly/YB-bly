import { useState } from "react";
import { Link } from "../router";
import { useNavigate } from "../router-hooks";
import AppHeader from "../components/AppHeader";
import FormField from "../components/FormField";
import BottomNavigation from "../components/BottomNavigation";

const Login = ({ redirectTo }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    if (!form.get("email") || !form.get("password")) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    localStorage.setItem("yb-bly-auth", "true");
    navigate(redirectTo || "/mypage", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="container">
        <AppHeader title="로그인" back actions={false} />
        <main className="login">
          {redirectTo && (
            <p className="login__notice">찜과 마이페이지는 로그인 후 이용할 수 있어요.</p>
          )}
          <header className="auth-header">
            <span className="auth-header__eyebrow">WELCOME BACK</span>
            <h1 className="auth-header__title">다시 만나서 반가워요!</h1>
            <p className="auth-header__description">YB-bly에서 오늘의 취향을 발견해 보세요.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <FormField label="이메일" name="email" type="email" placeholder="example@yb-bly.com" />
            <FormField label="비밀번호" name="password" type="password" placeholder="비밀번호를 입력해 주세요" />
            {error && <p className="auth-form__error">{error}</p>}
            <div className="login__options">
              <label className="check-field">
                <input type="checkbox" /> <span>로그인 상태 유지</span>
              </label>
              <button type="button" className="text-button">비밀번호 찾기</button>
            </div>
            <button className="primary-button" type="submit">로그인</button>
          </form>

          <p className="auth-footer">아직 회원이 아니신가요? <Link to="/signup">회원가입</Link></p>
        </main>
        {redirectTo && <BottomNavigation />}
      </div>
    </div>
  );
};

export default Login;
