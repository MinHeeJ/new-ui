/**
 * TEMPLATE: article-editor-v1
 * 용도: 게시글 작성/수정 에디터 (사이드바 없음)
 * 특징: 실시간 미리보기, SEO 설정, 태그 입력, 대표 이미지, 자동저장 표시
 *
 * Slots:
 *   - SLOT_PAGE_TITLE: 페이지 제목 ("New Article" 또는 "Edit Article")
 *   - SLOT_PAGE_SUB: 페이지 서브타이틀 (자동저장 안내 등)
 *   - SLOT_ACTION_BUTTONS: 상단 우측 액션 버튼들 (Save Draft, Publish 등)
 *   - SLOT_FETCH_ARTICLE: 수정 모드일 때 기존 게시글 fetch 로직
 *   - SLOT_SUBMIT_HANDLER: 저장/발행 핸들러 로직
 *   - SLOT_FOLDER_OPTIONS: 폴더 선택 <option> 목록 (API로 로드)
 *   - SLOT_CATEGORY_OPTIONS: 카테고리 선택 <option> 목록
 *   - SLOT_SEO_URL: SEO 미리보기에 표시할 URL
 *   - SLOT_IMAGE_UPLOAD_HANDLER: 대표 이미지 업로드 핸들러
 *   - SLOT_IMPORTS: 추가 임포트
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// SLOT_IMPORTS

export default function ArticleEditorPage() {
  const { articleCode } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!articleCode;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [folder, setFolder] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isEditMode) {
      // SLOT_FETCH_ARTICLE
    }
  }, [articleCode]);

  // 자동저장 (30초)
  useEffect(() => {
    if (!isEditMode) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      handleSave('draft');
    }, 30000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [title, content]);

  async function handleSave(mode: 'draft' | 'publish' | 'offline') {
    try {
      setSaving(true);
      // SLOT_SUBMIT_HANDLER
      setLastSaved(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag));
  }

  const savedTimeStr = lastSaved
    ? `Last saved: ${lastSaved.toLocaleTimeString()}`
    : saving ? 'Saving...' : 'Not saved yet';

  return (
    <div className="article-editor-page">

      {/* 페이지 헤더 */}
      <div className="editor-page-header">
        <div>
          <h1 className="editor-page-title">{/* SLOT_PAGE_TITLE */}</h1>
          <p className="editor-page-sub">{/* SLOT_PAGE_SUB */}</p>
        </div>
        <div className="editor-action-buttons">
          {/* SLOT_ACTION_BUTTONS */}
        </div>
      </div>

      {/* 에디터 그리드 */}
      <div className="editor-grid">

        {/* 좌: 에디터 영역 */}
        <div className="editor-main-col">

          {/* 제목 + 에디터 */}
          <div className="editor-card">
            <div className="editor-field-label">Article Title</div>
            <input
              type="text"
              className="editor-title-input"
              placeholder="Enter article title here..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            {/* 툴바 */}
            <div className="editor-toolbar">
              <button type="button" title="Bold" onClick={() => {}}><b>B</b></button>
              <button type="button" title="Italic" onClick={() => {}}><i>I</i></button>
              <button type="button" title="Underline" onClick={() => {}}><u>U</u></button>
              <span className="toolbar-divider" />
              <button type="button" title="Bullet List">≡</button>
              <button type="button" title="Ordered List">1.</button>
              <span className="toolbar-divider" />
              <button type="button" title="Quote">"</button>
              <button type="button" title="Image">🖼</button>
              <button type="button" title="Link">🔗</button>
              <button type="button" title="Code">{'</>'}</button>
              <span className="toolbar-divider" />
              <button type="button" title="Undo">↩</button>
              <button type="button" title="Redo">↪</button>
            </div>

            <textarea
              className="editor-textarea"
              placeholder="Start writing your story..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          {/* 실시간 미리보기 */}
          <div className="editor-preview-card">
            <div className="preview-header">
              <span>Live Preview</span>
              <span>👁</span>
            </div>
            <div className="preview-body">
              <h2 className="preview-title">{title || 'Title Preview'}</h2>
              <p className="preview-content">
                {content || 'Your content preview will appear here as you type...'}
              </p>
            </div>
          </div>
        </div>

        {/* 우: 설정 사이드바 */}
        <div className="editor-side-col">

          {/* 발행 설정 */}
          <div className="editor-settings-card">
            <h3 className="settings-title">Settings</h3>

            <div className="settings-field">
              <div className="editor-field-label">Status</div>
              <div className="status-row">
                <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                <span className="saved-time">{savedTimeStr}</span>
              </div>
            </div>

            <div className="settings-field">
              <div className="editor-field-label">Folder</div>
              <select
                className="settings-select"
                value={folder}
                onChange={e => setFolder(e.target.value)}
              >
                {/* SLOT_FOLDER_OPTIONS */}
              </select>
            </div>

            <div className="settings-field">
              <div className="editor-field-label">Category</div>
              <select
                className="settings-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {/* SLOT_CATEGORY_OPTIONS */}
              </select>
            </div>

            <div className="settings-field">
              <div className="editor-field-label">Tags</div>
              <div className="tags-row">
                {tags.map(tag => (
                  <span key={tag} className="tag-badge">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="tag-input"
                placeholder="Add a tag and press Enter..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </div>
          </div>

          {/* SEO 미리보기 */}
          <div className="editor-settings-card">
            <h3 className="settings-title">SEO Preview</h3>
            <p className="settings-sub">Preview how your article appears in search results.</p>
            <div className="seo-preview-box">
              <div className="seo-title">{title || 'Article Title'} | CMS</div>
              <div className="seo-url">{/* SLOT_SEO_URL */}</div>
              <div className="seo-desc">
                {metaDesc || content.substring(0, 150) || 'Meta description will appear here...'}
              </div>
            </div>
            <div className="editor-field-label">Meta Description</div>
            <textarea
              className="meta-textarea"
              placeholder="Write a short summary for SEO..."
              value={metaDesc}
              onChange={e => setMetaDesc(e.target.value)}
            />
          </div>

          {/* 대표 이미지 */}
          <div className="editor-settings-card">
            <div className="image-card-header">
              <h3 className="settings-title">Featured Image</h3>
              <button type="button" className="upload-link">Upload</button>
            </div>
            {featuredImage ? (
              <div className="featured-image-preview">
                <img src={featuredImage} alt="Featured" />
                <button type="button" onClick={() => setFeaturedImage('')}>×</button>
              </div>
            ) : (
              <div
                className="image-drop-zone"
                onClick={() => {/* SLOT_IMAGE_UPLOAD_HANDLER */}}
              >
                <span className="image-drop-icon">🖼</span>
                <span className="image-drop-label">Click to add cover image</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}