/**
 * TEMPLATE: master-detail-v1
 * 용도: 좌측 목록 + 우측 상세 패널
 * Slots:
 *   - SLOT_PAGE_TITLE: 페이지 제목
 *   - SLOT_PAGE_ACTIONS: 상단 액션 버튼 (JSX)
 *   - SLOT_MASTER_ITEMS: 목록 아이템 fetch + 렌더링
 *   - SLOT_DETAIL_CONTENT: 우측 상세 내용 (JSX)
 *   - SLOT_DETAIL_ACTIONS: 상세 패널 액션 버튼 (JSX)
 *   - SLOT_IMPORTS: 추가 임포트
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// SLOT_IMPORTS

export default function MasterDetailPage() {
  const navigate = useNavigate();
  const { folderCode } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [folderCode]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError(null);
      // SLOT_MASTER_ITEMS
      setItems([]);
    } catch (e: any) {
      setError(e.message || '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <h1 className="page-title">{/* SLOT_PAGE_TITLE */}</h1>
        <div className="page-actions">
          {/* SLOT_PAGE_ACTIONS */}
        </div>
      </div>

      {/* 분할 레이아웃 */}
      <div className="master-detail-layout">
        {/* 좌측: 목록 */}
        <div className="master-panel">
          {loading && (
            <div className="loading-skeleton">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-row" />
              ))}
            </div>
          )}
          {error && (
            <div className="error-state">
              <p>⚠ {error}</p>
              <button onClick={fetchItems}>다시 시도</button>
            </div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="empty-state">항목이 없습니다.</div>
          )}
          {!loading && !error && items.map((item, i) => (
            <div
              key={i}
              className={`master-item ${selected?.id === item.id ? 'selected' : ''}`}
              onClick={() => setSelected(item)}
            >
              {/* SLOT_MASTER_ITEM_RENDER */}
              <span>{item.title || item.name}</span>
            </div>
          ))}
        </div>

        {/* 우측: 상세 */}
        <div className="detail-panel">
          {selected ? (
            <>
              <div className="detail-content">
                {/* SLOT_DETAIL_CONTENT */}
              </div>
              <div className="detail-actions">
                {/* SLOT_DETAIL_ACTIONS */}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>항목을 선택해주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
