/**
 * TEMPLATE: article-read-v1
 * 용도: Markdown 게시글 읽기 + 우측 목차
 * Slots:
 *   - SLOT_FETCH_ARTICLE: 게시글 fetch 로직
 *   - SLOT_META_INFO: 제목 하단 메타 정보 (폴더명, 발행일 등)
 *   - SLOT_IMPORTS: 추가 임포트
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
// SLOT_IMPORTS

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function OutlinePanel({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    const items = headings.map((h, i) => {
      const level = h.match(/^#+/)?.[0].length || 1;
      const text = h.replace(/^#+\s+/, '');
      const id = `heading-${i}`;
      return { id, text, level };
    });
    setToc(items);
  }, [content]);

  if (toc.length === 0) return null;

  return (
    <div className="outline-panel">
      <p className="outline-title">ON THIS PAGE</p>
      <ul className="outline-list">
        {toc.map(item => (
          <li
            key={item.id}
            className={`outline-item level-${item.level} ${active === item.id ? 'active' : ''}`}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            onClick={() => {
              setActive(item.id);
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ArticleReadPage() {
  const { articleCode } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticle();
  }, [articleCode]);

  async function fetchArticle() {
    try {
      setLoading(true);
      setError(null);
      // SLOT_FETCH_ARTICLE
    } catch (e: any) {
      setError(e.message || '게시글을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-skeleton">
          <div className="skeleton-title" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>⚠ {error}</p>
          <button onClick={fetchArticle}>다시 시도</button>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="article-read-layout">
      {/* 본문 영역 */}
      <div className="article-content">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          {/* SLOT_META_INFO */}
        </div>
        <hr className="article-divider" />
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeSanitize]}
          >
            {article.contentMd || ''}
          </ReactMarkdown>
        </div>
      </div>

      {/* 목차 패널 */}
      <aside className="toc-sidebar">
        <OutlinePanel content={article.contentMd || ''} />
      </aside>
    </div>
  );
}
