import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ArticleListPage from './ArticleListPage';
import { searchApi } from '../../api';

vi.mock('../../api', () => ({
  searchApi: { search: vi.fn() },
}));

function LocationText() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('ArticleListPage', () => {
  it('관리자 게시글 목록을 렌더링하고 상태 필터를 적용한다', async () => {
    vi.mocked(searchApi.search).mockResolvedValue([
      { articleCode: 'A1', title: '초안 글', folderTitle: '가이드', status: 'DRAFT', updatedAt: '2026-01-01T00:00:00Z' },
      { articleCode: 'A2', title: '발행 글', folderTitle: '공지', status: 'PUBLISHED', updatedAt: '2026-01-02T00:00:00Z' },
    ]);
    const user = userEvent.setup();

    render(<MemoryRouter><ArticleListPage /></MemoryRouter>);

    expect(await screen.findByText('초안 글')).toBeInTheDocument();
    expect(screen.getByText('발행 글')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'DRAFT' }));

    expect(screen.getByText('초안 글')).toBeInTheDocument();
    expect(screen.queryByText('발행 글')).not.toBeInTheDocument();
  });

  it('검색 버튼 클릭 시 입력 키워드로 API를 다시 호출하고 행 클릭 시 수정 페이지로 이동한다', async () => {
    vi.mocked(searchApi.search).mockResolvedValue([{ articleCode: 'A1', title: '검색 글', folderTitle: '가이드', status: 'DRAFT' }]);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/admin/articles']}>
        <ArticleListPage />
        <Routes><Route path="*" element={<LocationText />} /></Routes>
      </MemoryRouter>
    );

    await screen.findByText('검색 글');
    await user.type(screen.getByPlaceholderText('제목/본문 검색'), '검색어');
    await user.click(screen.getByRole('button', { name: '검색' }));

    await waitFor(() => expect(searchApi.search).toHaveBeenLastCalledWith('검색어', false));
    await user.click(screen.getByText('검색 글'));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/article/A1'));
  });
});
