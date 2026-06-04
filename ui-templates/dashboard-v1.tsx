/**
 * TEMPLATE: dashboard-v2
 * 용도: 고급 대시보드 - fluid blob 배경, 타임라인 활동 피드, 시스템 상태 카드
 * 기존 dashboard-v1보다 시각적으로 풍부한 버전
 *
 * Slots:
 *   - SLOT_BRAND_NAME: 브랜드/서비스명
 *   - SLOT_USER_NAME: 로그인 유저명
 *   - SLOT_USER_ROLE: 유저 역할
 *   - SLOT_NAV_ITEMS: 사이드바 네비게이션 항목들 (JSX)
 *   - SLOT_WELCOME_TITLE: 메인 타이틀 (JSX, span으로 강조 가능)
 *   - SLOT_ACTION_BUTTON: 우측 상단 주요 액션 버튼
 *   - SLOT_SEARCH_PLACEHOLDER: 검색창 placeholder
 *   - SLOT_KPI_CARDS: KPI 메트릭 카드들 (JSX, 3개 권장)
 *   - SLOT_FETCH_KPI: KPI 데이터 fetch 로직
 *   - SLOT_RECENT_ITEMS: 최근 항목 목록 (JSX)
 *   - SLOT_FETCH_RECENT: 최근 항목 fetch 로직
 *   - SLOT_ACTIVITY_FEED: 타임라인 활동 항목들 (JSX)
 *   - SLOT_FETCH_ACTIVITY: 활동 피드 fetch 로직
 *   - SLOT_SYSTEM_STATS: 시스템 상태 정보 (JSX)
 *   - SLOT_IMPORTS: 추가 임포트
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// SLOT_IMPORTS

export default function DashboardV2Page() {
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      setLoading(true);
      // SLOT_FETCH_KPI
      // SLOT_FETCH_RECENT
      // SLOT_FETCH_ACTIVITY
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-v2-layout">

      {/* 사이드바 */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">{/* SLOT_BRAND_NAME */}</div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {/* SLOT_USER_NAME의 이니셜 */}
          </div>
          <div>
            <div className="profile-name">{/* SLOT_USER_NAME */}</div>
            <div className="profile-role">{/* SLOT_USER_ROLE */}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* SLOT_NAV_ITEMS */}
        </nav>

        {/* SLOT_SYSTEM_STATS - 사이드바 하단 시스템 상태 */}
      </aside>

      {/* 메인 영역 */}
      <main className="dashboard-main">
        {/* 배경 blob 장식 */}
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />

        <div className="dashboard-content">

          {/* 헤더 */}
          <div className="dashboard-header">
            <div>
              <p className="welcome-label">Welcome back, {/* SLOT_USER_NAME */}</p>
              <h1 className="welcome-title">
                {/* SLOT_WELCOME_TITLE */}
              </h1>
            </div>
            <div>
              {/* SLOT_ACTION_BUTTON */}
            </div>
          </div>

          {/* 검색 */}
          <div className="dashboard-search">
            <input
              type="text"
              placeholder={/* SLOT_SEARCH_PLACEHOLDER */ "Search..."}
              className="search-input"
            />
          </div>

          {/* KPI 카드 그리드 */}
          <div className="kpi-blob-card">
            <div className="kpi-grid">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="kpi-skeleton" />
                ))
              ) : (
                /* SLOT_KPI_CARDS */
                null
              )}
            </div>
          </div>

          {/* 하단 2열 */}
          <div className="dashboard-bottom">

            {/* 좌: 최근 항목 */}
            <div className="recent-section">
              <div className="section-header">
                <h2 className="section-title">Recent Items</h2>
                <button className="section-link">View All</button>
              </div>
              <div className="recent-list">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="recent-skeleton" />
                  ))
                ) : recentItems.length === 0 ? (
                  <div className="empty-state">항목이 없습니다.</div>
                ) : (
                  /* SLOT_RECENT_ITEMS */
                  null
                )}
              </div>
            </div>

            {/* 우: 활동 피드 + 시스템 상태 */}
            <div className="right-column">

              {/* 타임라인 활동 피드 */}
              <div className="activity-card">
                <h3 className="card-title">Activity</h3>
                <div className="timeline">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="timeline-skeleton" />
                    ))
                  ) : activityFeed.length === 0 ? (
                    <div className="empty-state">활동 내역이 없습니다.</div>
                  ) : (
                    /* SLOT_ACTIVITY_FEED */
                    null
                  )}
                </div>
              </div>

              {/* 시스템/상태 카드 (glass morphism) */}
              <div className="glass-card">
                {/* SLOT_SYSTEM_STATS */}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * KPI 카드 컴포넌트 (SLOT_KPI_CARDS에서 사용)
 */
export function KpiMetricCard({
  icon,
  label,
  value,
  iconBg = 'icon-blue',
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg?: string;
}) {
  return (
    <div className="kpi-metric">
      <div className={`kpi-icon ${iconBg}`}>{icon}</div>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
    </div>
  );
}

/**
 * 타임라인 아이템 컴포넌트 (SLOT_ACTIVITY_FEED에서 사용)
 */
export function TimelineItem({
  time,
  text,
  active = false,
}: {
  time: string;
  text: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="timeline-item">
      <div className={`timeline-dot ${active ? 'dot-active' : 'dot-muted'}`} />
      <p className={`timeline-time ${active ? 'time-active' : 'time-muted'}`}>{time}</p>
      <p className={`timeline-text ${!active ? 'text-muted' : ''}`}>{text}</p>
    </div>
  );
}

/**
 * 최근 항목 카드 컴포넌트 (SLOT_RECENT_ITEMS에서 사용)
 */
export function RecentItemCard({
  thumbnail,
  title,
  tag,
  time,
  status,
  onClick,
}: {
  thumbnail?: React.ReactNode;
  title: string;
  tag?: string;
  time?: string;
  status?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="recent-item" onClick={onClick}>
      {thumbnail && <div className="recent-thumb">{thumbnail}</div>}
      <div className="recent-body">
        <p className="recent-title">{title}</p>
        <div className="recent-meta">
          {tag && <span className="recent-tag">{tag}</span>}
          {time && <span className="recent-time">{time}</span>}
        </div>
      </div>
      {status && <div className="recent-status">{status}</div>}
    </div>
  );
}