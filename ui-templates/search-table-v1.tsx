/**
 * TEMPLATE: search-table-v1
 * 용도: 검색 + 목록 테이블 화면
 * Slots:
 *   - SLOT_PAGE_TITLE: 페이지 제목 문자열
 *   - SLOT_PAGE_ACTIONS: 우측 액션 버튼들 (JSX)
 *   - SLOT_FILTERS: 필터 영역 (JSX)
 *   - SLOT_TABLE_COLUMNS: 테이블 컬럼 정의 (배열)
 *   - SLOT_TABLE_DATA: 데이터 fetch 로직
 *   - SLOT_ROW_CLICK: 행 클릭 핸들러
 *   - SLOT_IMPORTS: 추가 임포트
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// SLOT_IMPORTS

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export default function SearchTablePage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');

  // SLOT_TABLE_DATA
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      // TODO: API 호출
      setData([]);
    } catch (e: any) {
      setError(e.message || '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  // SLOT_ROW_CLICK
  function handleRowClick(row: any) {
    // TODO: 행 클릭 처리
  }

  // SLOT_TABLE_COLUMNS
  const columns: Column[] = [
    // TODO: 컬럼 정의
  ];

  return (
    <div className="page-container">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <h1 className="page-title">{/* SLOT_PAGE_TITLE */}</h1>
        <div className="page-actions">
          {/* SLOT_PAGE_ACTIONS */}
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="filter-bar">
        <input
          className="search-input"
          type="text"
          placeholder="검색..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchData()}
        />
        {/* SLOT_FILTERS */}
      </div>

      {/* 테이블 영역 */}
      <div className="table-container">
        {loading && (
          <div className="loading-skeleton">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        )}
        {error && (
          <div className="error-state">
            <p>⚠ {error}</p>
            <button onClick={fetchData}>다시 시도</button>
          </div>
        )}
        {!loading && !error && data.length === 0 && (
          <div className="empty-state">
            <p>데이터가 없습니다.</p>
          </div>
        )}
        {!loading && !error && data.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} onClick={() => handleRowClick(row)} className="table-row">
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
