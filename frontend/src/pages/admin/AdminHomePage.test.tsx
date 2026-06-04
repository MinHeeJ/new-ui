import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AdminHomePage from './AdminHomePage';
import { folderApi, searchApi } from '../../api';

vi.mock('../../api', () => ({
  folderApi: { getRoots: vi.fn() },
  searchApi: { search: vi.fn() },
}));

function LocationText() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('AdminHomePage', () => {
  it('대시보드 통계와 최근 게시글을 렌더링한다', async () => {
    vi.mocked(folderApi.getRoots).mockResolvedValue([{ folderCode: 'F1' }, { folderCode: 'F2' }]);
    vi.mocked(searchApi.search).mockResolvedValue([
      { articleCode: 'A1', title: '초안 글', status: 'DRAFT', folderTitle: '가이드', updatedAt: '2026-01-01T00:00:00Z' },
      { articleCode: 'A2', title: '발행 글', status: 'PUBLISHED', folderTitle: '공지', updatedAt: '2026-01-02T00:00:00Z' },
    ]);

    render(<MemoryRouter><AdminHomePage /></MemoryRouter>);

    expect(await screen.findByText('초안 글')).toBeInTheDocument();
    expect(screen.getByText('발행 글')).toBeInTheDocument();
    expect(screen.getByText('폴더').nextSibling).toHaveTextContent('2');
    expect(screen.getByText('게시글').nextSibling).toHaveTextContent('2');
    expect(screen.getByText('초안').nextSibling).toHaveTextContent('1');
    expect(folderApi.getRoots).toHaveBeenCalledWith(false);
    expect(searchApi.search).toHaveBeenCalledWith('', false);
  });

  it('새 게시글 버튼 클릭 시 작성 페이지로 이동한다', async () => {
    vi.mocked(folderApi.getRoots).mockResolvedValue([]);
    vi.mocked(searchApi.search).mockResolvedValue([]);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminHomePage />
        <Routes><Route path="*" element={<LocationText />} /></Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /새 게시글/i }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/article/new'));
  });
});
