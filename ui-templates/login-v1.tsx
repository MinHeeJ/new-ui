/**
 * TEMPLATE: login-v1
 * 용도: 로그인 / 회원가입 페이지 (사이드바 없음, 전체 화면)
 * 특징: 좌측 브랜딩(mesh gradient + organic curve) + 우측 폼
 *
 * Slots:
 *   - SLOT_BRAND_ICON: 좌측 브랜드 아이콘 (JSX)
 *   - SLOT_BRAND_NAME: 브랜드명 텍스트
 *   - SLOT_HERO_TITLE: 좌측 메인 타이틀
 *   - SLOT_HERO_SUB: 좌측 서브 설명 텍스트
 *   - SLOT_FEATURE_TAGS: 좌측 하단 특징 태그들 (JSX, glass-tag 스타일)
 *   - SLOT_FORM_TITLE: 우측 폼 타이틀 ("Welcome back" 등)
 *   - SLOT_FORM_SUB: 우측 폼 서브타이틀
 *   - SLOT_FORM_FIELDS: 폼 입력 필드들 (JSX)
 *   - SLOT_SUBMIT_BUTTON: 제출 버튼 텍스트 및 아이콘
 *   - SLOT_SUBMIT_HANDLER: 폼 제출 핸들러 로직
 *   - SLOT_FOOTER_LINK: 하단 링크 ("Don't have an account? 회원가입" 등)
 *   - SLOT_IMPORTS: 추가 임포트
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// SLOT_IMPORTS

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      // SLOT_SUBMIT_HANDLER
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* 배경 blob */}
      <div className="login-blob login-blob-1" aria-hidden="true" />
      <div className="login-blob login-blob-2" aria-hidden="true" />

      <main className="login-layout">

        {/* 좌측: 브랜딩 */}
        <section className="login-left">
          <div className="login-mesh" aria-hidden="true" />

          <div className="login-brand-content">

            {/* 브랜드 */}
            <div className="login-brand">
              <div className="login-brand-icon">
                {/* SLOT_BRAND_ICON */}
              </div>
              <span className="login-brand-name">{/* SLOT_BRAND_NAME */}</span>
            </div>

            {/* 히어로 */}
            <h2 className="login-hero-title">
              {/* SLOT_HERO_TITLE */}
            </h2>
            <p className="login-hero-sub">
              {/* SLOT_HERO_SUB */}
            </p>

            {/* 특징 태그 */}
            <div className="login-feature-tags">
              {/* SLOT_FEATURE_TAGS */}
            </div>

          </div>
        </section>

        {/* 우측: 폼 */}
        <section className="login-right">
          <div className="login-form-wrap">

            <div className="login-form-header">
              <h1 className="login-form-title">{/* SLOT_FORM_TITLE */}</h1>
              <p className="login-form-sub">{/* SLOT_FORM_SUB */}</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>

              {/* SLOT_FORM_FIELDS */}

              {error && (
                <div className="login-error" role="alert">{error}</div>
              )}

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="login-spinner" aria-label="로그인 중" />
                ) : (
                  /* SLOT_SUBMIT_BUTTON */
                  <span>Sign In →</span>
                )}
              </button>

            </form>

            <div className="login-footer">
              {/* SLOT_FOOTER_LINK */}
            </div>

          </div>
        </section>

      </main>

      {/* 페이지 하단 푸터 */}
      <footer className="login-page-footer">
        <span className="footer-copy">© {new Date().getFullYear()} {/* SLOT_BRAND_NAME */}. All rights reserved.</span>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </footer>

    </div>
  );
}

/**
 * 폼 필드 컴포넌트 (SLOT_FORM_FIELDS에서 사용)
 */
export function LoginField({
  label,
  id,
  type = 'text',
  placeholder,
  icon,
  rightSlot,
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="login-field">
      <label htmlFor={id} className="login-field-label">{label}</label>
      <div className="login-input-wrap">
        {icon && <span className="login-input-icon" aria-hidden="true">{icon}</span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          className={`login-input ${icon ? 'login-input-with-icon' : ''}`}
        />
        {rightSlot && <div className="login-input-right">{rightSlot}</div>}
      </div>
    </div>
  );
}

/**
 * 특징 태그 컴포넌트 (SLOT_FEATURE_TAGS에서 사용)
 */
export function FeatureTag({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="login-feature-tag">
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
