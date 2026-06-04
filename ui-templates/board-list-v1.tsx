/**
 * TEMPLATE: board-list-v1
 * 용도: 게시판 목록 + 상세 보기
 * 기능: 게시글 목록(제목/작성자/날짜/조회수), 검색, 카테고리 필터, 페이지네이션, 상세 보기
 * Slots:
 *   - SLOT_PAGE_TITLE: 게시판 제목
 *   - SLOT_WRITE_BUTTON: 글쓰기 버튼 (관리자/로그인 시만 표시 등 조건 포함)
 *   - SLOT_CATEGORY_FILTER: 카테고리 탭 또는 드롭다운
 *   - SLOT_FETCH_LIST: 목록 API 호출 로직
 *   - SLOT_FETCH_DETAIL: 상세 API 호출 로직
 *   - SLOT_ROW_FIELDS: 테이블 행에 표시할 필드 (제목, 작성자, 날짜, 조회수 등)
 *   - SLOT_DETAIL_CONTENT: 상세 본문 내용
 *   - SLOT_DETAIL_META: 상세 메타 정보 (작성자, 날짜, 조회수 등)
 *   - SLOT_COMMENT_SECTION: 댓글 영역 (있으면)
 *   - SLOT_IMPORTS: 추가 임포트
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// SLOT_IMPORTS

export default function BoardListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 15;

  useEffect(() => {
    fetchList();
  }, [keyword, category, page]);

  async function fetchList() {
    try {
      setLoading(true);
      setError(null);
      setSelectedPost(null);
      // SLOT_FETCH_LIST
      setPosts([]);
      setTotal(0);
    } catch (e: any) {
      setError(e.message || '목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRowClick(post: any) {
    try {
      setDetailLoading(true);
      setSelectedPost(null);
      // SLOT_FETCH_DETAIL
    } catch (e: any) {
      setError(e.message || '게시글을 불러오지 못했습니다.');
    } finally {
      setDetailLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const kw = (form.elements.namedItem('keyword') as HTMLInputElement).value;
    setSearchParams({ keyword: kw, category, page: '1' });
  }

  const totalPages = Math.ceil(total / pageSize);

  // ── 상세 보기 모드 ────────────────────────────────────────────────────────
  if (selectedPost) {
    return (
      <div className="board-detail-container">
        <button className="back-button" onClick={() => setSelectedPost(null)}>
          ← 목록으로
        </button>

        <div className="detail-header">
          <h1 className="detail-title">{selectedPost.title}</h1>
          <div className="detail-meta">
            {/* SLOT_DETAIL_META */}
          </div>
        </div>

        <hr className="detail-divider" />

        <div className="detail-body">
          {/* SLOT_DETAIL_CONTENT */}
        </div>

        <div className="detail-comment">
          {/* SLOT_COMMENT_SECTION */}
        </div>
      </div>
    );
  }

  // ── 목록 모드 ─────────────────────────────────────────────────────────────
  return (
    <div className="board-container">
      {/* 헤더 */}
      <div className="board-header">
        <h1 className="board-title">{/* SLOT_PAGE_TITLE */}</h1>
        <div className="board-actions">
          {/* SLOT_WRITE_BUTTON */}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="board-filter">
        {/* SLOT_CATEGORY_FILTER */}
      </div>

      {/* 검색 */}
      <form className="board-search" onSubmit={handleSearch}>
        <input
          name="keyword"
          defaultValue={keyword}
          placeholder="검색어를 입력하세요"
          className="search-input"
        />
        <button type="submit" className="search-button">검색</button>
      </form>

      {/* 목록 */}
      <div className="board-table-wrap">
        {loading && (
          <div className="loading-skeleton">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        )}
        {error && (
          <div className="error-state">
            <p>⚠ {error}</p>
            <button onClick={fetchList}>다시 시도</button>
          </div>
        )}
        {!loading && !error && posts.length === 0 && (
          <div className="empty-state">
            <p>게시글이 없습니다.</p>
          </div>
        )}
        {!loading && !error && posts.length > 0 && (
          <table className="board-table">
            <thead>
              <tr>
                {/* SLOT_ROW_FIELDS - thead */}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={post.id ?? i}
                  className="board-row"
                  onClick={() => handleRowClick(post)}
                >
                  {/* SLOT_ROW_FIELDS - tbody */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setSearchParams({ keyword, category, page: String(page - 1) })}
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={p === page ? 'page-active' : ''}
              onClick={() => setSearchParams({ keyword, category, page: String(p) })}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setSearchParams({ keyword, category, page: String(page + 1) })}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
