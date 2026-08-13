import { useState } from "react";
import { Link } from "../router";
import { useNavigate } from "../router-hooks";

import AppHeader from "../components/AppHeader";
import FormField from "../components/FormField";

import { register } from "../api/authApi";

const Signup = () => {
  const navigate = useNavigate();

  const [agreed, setAgreed] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const formElement =
      event.currentTarget;

    /*
     * required, email, minLength 등
     * HTML 기본 validation 검사
     */
    if (
      !formElement.checkValidity()
    ) {
      formElement.reportValidity();
      return;
    }

    const form = new FormData(
      formElement
    );

    const name =
      form.get("name")?.trim();

    const email =
      form.get("email")?.trim();

    const password =
      form.get("password");

    const passwordConfirm =
      form.get(
        "passwordConfirm"
      );

    setError("");

    if (!name || !email) {
      setError(
        "이름과 이메일을 모두 입력해 주세요."
      );
      return;
    }

    if (
      password !== passwordConfirm
    ) {
      setError(
        "비밀번호 확인이 일치하지 않습니다."
      );
      return;
    }

    /*
     * 최소 8자 + 영문 + 숫자
     */
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (
      !passwordPattern.test(
        password
      )
    ) {
      setError(
        "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다."
      );
      return;
    }

    if (!agreed) {
      setError(
        "이용약관 및 개인정보 수집에 동의해 주세요."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register({
        name,
        email,
        password,
      });

      /*
       * 회원가입 성공 후
       * 로그인 페이지로 이동
       */
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "회원가입 실패:",
        error
      );

      setError(
        error.response?.data?.error ||
          "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="container">
        <AppHeader
          title="회원가입"
          back
          actions={false}
        />

        <main className="signup">
          <div
            className="signup__progress"
            aria-label="가입 진행 단계"
          >
            <span className="signup__progress-active" />
          </div>

          <header className="auth-header">
            <span className="auth-header__eyebrow">
              JOIN YB-BLY
            </span>

            <h1 className="auth-header__title">
              당신의 취향을 알려주세요
            </h1>

            <p className="auth-header__description">
              입력한 정보로 꼭 맞는 상품을
              추천해 드릴게요.
            </p>
          </header>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <FormField
              label="이름"
              name="name"
              placeholder="이름을 입력해 주세요"
              autoComplete="name"
              required
            />

            <FormField
              label="이메일"
              name="email"
              type="email"
              placeholder="example@yb-bly.com"
              autoComplete="email"
              required
            />

            <FormField
              label="비밀번호"
              name="password"
              type="password"
              placeholder="영문, 숫자 포함 8자 이상"
              autoComplete="new-password"
              minLength="8"
              required
              hint="영문과 숫자를 포함해 8자 이상 입력해 주세요."
            />

            <FormField
              label="비밀번호 확인"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              autoComplete="new-password"
              minLength="8"
              required
            />

            {error && (
              <p className="auth-form__error">
                {error}
              </p>
            )}

            <label className="check-field signup__agreement">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) =>
                  setAgreed(
                    event.target.checked
                  )
                }
              />

              <span>
                <strong>
                  [필수]
                </strong>{" "}
                이용약관 및 개인정보
                수집에 동의합니다.
              </span>
            </label>

            <button
              className="primary-button"
              type="submit"
              disabled={
                !agreed || loading
              }
            >
              {loading
                ? "가입 중..."
                : "가입 완료"}
            </button>
          </form>

          <p className="auth-footer">
            이미 계정이 있으신가요?{" "}
            <Link to="/login">
              로그인
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
};

export default Signup;