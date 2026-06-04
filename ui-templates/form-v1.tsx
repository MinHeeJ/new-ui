/**
 * TEMPLATE: form-v1
 * 용도: 등록/수정 폼 또는 split-editor (variant)
 * Variants:
 *   - default: 단일 폼 (로그인, 등록 등)
 *   - split-editor: 좌우 분할 (Markdown 에디터)
 * Slots:
 *   - SLOT_FORM_TITLE: 폼 제목
 *   - SLOT_FORM_SUBTITLE: 폼 서브타이틀
 *   - SLOT_FORM_FIELDS: 폼 필드들 (JSX)
 *   - SLOT_FORM_ACTIONS: 폼 액션 버튼 (JSX)
 *   - SLOT_SUBMIT_HANDLER: 제출 핸들러 로직
 *   - SLOT_EDITOR_CONTENT: split-editor variant에서 에디터 영역
 *   - SLOT_SETTINGS_PANEL: split-editor variant에서 우측 설정 패널
 *   - SLOT_IMPORTS: 추가 임포트
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// SLOT_IMPORTS

// ── Default Form Variant ──────────────────────────────────────────────────────
export function DefaultFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  // SLOT_SUBMIT_HANDLER
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      // TODO: API 호출
    } catch (e: any) {
      setError(e.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">{/* SLOT_FORM_TITLE */}</h1>
          <p className="form-subtitle">{/* SLOT_FORM_SUBTITLE */}</p>
        </div>

        {error && (
          <div className="error-banner">⚠ {error}</div>
        )}

        <form onSubmit={handleSubmit} className="form-body">
          {/* SLOT_FORM_FIELDS */}
          <div className="form-actions">
            {/* SLOT_FORM_ACTIONS */}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '처리 중...' : '확인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Split Editor Variant ──────────────────────────────────────────────────────
export function SplitEditorPage() {
  const navigate = useNavigate();
  const { articleCode } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleCode) fetchArticle();
    else setLoading(false);
  }, [articleCode]);

  async function fetchArticle() {
    try {
      setLoading(true);
      // SLOT_EDITOR_CONTENT - fetch 로직
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="split-editor-layout">
      {/* 상단 툴바 */}
      <div className="editor-toolbar">
        <input
          className="editor-title-input"
          type="text"
          placeholder="제목을 입력하세요..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="toolbar-actions">
          {/* SLOT_FORM_ACTIONS */}
        </div>
      </div>

      {/* 분할 영역 */}
      <div className="editor-body">
        {/* 좌: 에디터 */}
        <div className="editor-main">
          <div className="editor-format-bar">
            <button type="button" title="Bold"><strong>B</strong></button>
            <button type="button" title="Italic"><em>I</em></button>
            <button type="button" title="Code">{'<>'}</button>
          </div>
          <textarea
            className="editor-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Markdown으로 작성하세요..."
          />
        </div>

        {/* 우: 설정 패널 */}
        <div className="editor-settings-panel">
          {/* SLOT_SETTINGS_PANEL */}
        </div>
      </div>
    </div>
  );
}

export default DefaultFormPage;
