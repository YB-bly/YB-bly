import {
  useState,
} from "react";

import { Link } from "../router";

import {
  useNavigate,
} from "../router-hooks";

import AppHeader from "../components/AppHeader";
import FormField from "../components/FormField";
import BottomNavigation from "../components/BottomNavigation";

import {
  login,
  logout,
} from "../api/authApi";

const Login = ({
  redirectTo,
  adminMode = false,
}) => {
  const navigate =
    useNavigate();

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    forgotOpen,
    setForgotOpen,
  ] = useState(false);

  const [
    resetMessage,
    setResetMessage,
  ] = useState("");

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const form =
      new FormData(
        event.currentTarget
      );

    const email =
      form
        .get("email")
        ?.trim();

    const password =
      form.get("password");

    if (
      !email ||
      !password
    ) {
      setError(
        "이메일과 비밀번호를 모두 입력해 주세요."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await login(
          email,
          password
        );

      const role =
        data?.user?.role;

      if (
        adminMode &&
        role !== "admin"
      ) {
        try {
          await logout();
        } catch (
          logoutError
        ) {
          console.error(
            "관리자 권한 확인 후 로그아웃 실패:",
            logoutError
          );
        }

        setError(
          "관리자 계정으로 로그인해 주세요."
        );

        return;
      }

      if (
        role === "admin"
      ) {
        navigate(
          "/admin",
          {
            replace: true,
          }
        );

        return;
      }

      navigate(
        redirectTo &&
          !redirectTo.startsWith(
            "/admin"
          )
          ? redirectTo
          : "/",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "로그인 실패:",
        error
      );

      setError(
        error.response?.data
          ?.error ||
          "로그인 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const requestReset = (
    event
  ) => {
    event.preventDefault();

    const form =
      new FormData(
        event.currentTarget
      );

    const email =
      form
        .get("resetEmail")
        ?.trim();

    if (!email) {
      return;
    }

    setResetMessage(
      "입력한 이메일이 등록되어 있다면 재설정 안내가 발송됩니다. (모의 전송)"
    );
  };

  const toggleForgotPassword =
    () => {
      setForgotOpen(
        (current) =>
          !current
      );

      setResetMessage("");
    };

  return (
    <div className="login-page">
      <div className="container">
        <AppHeader
          title={
            adminMode
              ? "관리자 로그인"
              : "로그인"
          }
          back
          actions={false}
        />

        <main className="login">
          {redirectTo && (
            <p className="login__notice">
              {adminMode
                ? "관리자 페이지는 관리자 로그인 후 이용할 수 있어요."
                : "구매 활동과 마이페이지는 로그인 후 이용할 수 있어요."}
            </p>
          )}

          <header className="auth-header">
            <span className="auth-header__eyebrow">
              WELCOME BACK
            </span>

            <h1 className="auth-header__title">
              {adminMode
                ? "관리자 로그인"
                : "다시 만나서 반가워요!"}
            </h1>

            <p className="auth-header__description">
              {adminMode
                ? "상품과 주문 현황을 안전하게 관리하세요."
                : "YB-bly에서 오늘의 취향을 발견해 보세요."}
            </p>
          </header>

          <form
            className="auth-form"
            onSubmit={
              handleSubmit
            }
            noValidate
          >
            <FormField
              label="이메일"
              name="email"
              type="email"
              placeholder="example@yb-bly.com"
              autoComplete="email"
            />

            <FormField
              label="비밀번호"
              name="password"
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="current-password"
            />

            {error && (
              <p className="auth-form__error">
                {error}
              </p>
            )}

            <div className="login__options">
              <label className="check-field">
                <input
                  type="checkbox"
                  name="keepLoggedIn"
                />

                <span>
                  로그인 상태 유지
                </span>
              </label>

              <button
                type="button"
                className="text-button"
                onClick={
                  toggleForgotPassword
                }
              >
                비밀번호 찾기
              </button>
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "로그인 중..."
                : "로그인"}
            </button>
          </form>

          {forgotOpen && (
            <div className="login__forgot">
              <strong>
                비밀번호 재설정
              </strong>

              <p>
                가입한 이메일을 입력해
                주세요. 계정 존재 여부와
                관계없이 동일한 안내를
                표시합니다.
              </p>

              <form
                onSubmit={
                  requestReset
                }
              >
                <input
                  required
                  name="resetEmail"
                  type="email"
                  placeholder="example@yb-bly.com"
                  autoComplete="email"
                />

                <button type="submit">
                  안내 받기
                </button>
              </form>

              {resetMessage && (
                <span>
                  {resetMessage}
                </span>
              )}
            </div>
          )}

          {!adminMode && (
            <p className="auth-footer">
              아직 회원이
              아니신가요?{" "}

              <Link to="/signup">
                회원가입
              </Link>
            </p>
          )}
        </main>

        {redirectTo &&
          !adminMode && (
            <BottomNavigation />
          )}
      </div>
    </div>
  );
};

export default Login;