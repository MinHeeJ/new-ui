import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import PortalHomePage from './PortalHomePage';
import { folderApi, searchApi } from '../../api';

vi.mock('../../api', () => ({
  folderApi: { getRoots: vi.fn() },
  searchApi: { search: vi.fn() },
}));

function LocationText() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('PortalHomePage', () => {
  it('포털 홈의 폴더 카드와 최근 게시글 목록을 렌더링한다', async () => {
    vi.mocked(folderApi.getRoots).mockResolvedValue([{ folderCode: 'F1', title: '가이드', description: '사용법' }]);
    vi.mocked(searchApi.search).mockResolvedValue([{ articleCode: 'A1', title: '최근 문서', folderTitle: '가이드', contentMd: '요약', publishedAt: '2026-01-01T00:00:00Z' }]);

    render(<MemoryRouter><PortalHomePage /></MemoryRouter>);

    expect(await screen.findByRole('button', { name: /가이드/i })).toBeInTheDocument();
    expect(screen.getByText('최근 문서')).toBeInTheDocument();
    expect(folderApi.getRoots).toHaveBeenCalledWith(true);
    expect(searchApi.search).toHaveBeenCalledWith('', true);
  });

  it('검색어 입력 후 검색 버튼을 클릭하면 포털 검색 API를 호출한다', async () => {
    vi.mocked(folderApi.getRoots).mockResolvedValue([]);
    vi.mocked(searchApi.search).mockResolvedValueOnce([]).mockResolvedValueOnce([{ articleCode: 'A2', title: '검색 결과', folderTitle: '가이드' }]);
    const user = userEvent.setup();

    render(<MemoryRouter><PortalHomePage /></MemoryRouter>);
    await screen.findByText('카테고리가 없습니다.');

    await user.type(screen.getByPlaceholderText('제목 또는 본문 검색'), '키워드');
    await user.click(screen.getByRole('button', { name: '검색' }));

    await waitFor(() => expect(searchApi.search).toHaveBeenLastCalledWith('키워드', true));
    expect(await screen.findByText('검색 결과')).toBeInTheDocument();
  });

  it('폴더 카드를 클릭하면 포털 폴더 경로로 이동한다', async () => {
    vi.mocked(folderApi.getRoots).mockResolvedValue([{ folderCode: 'F1', title: '가이드' }]);
    vi.mocked(searchApi.search).mockResolvedValue([]);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/portal']}>
        <PortalHomePage />
        <Routes><Route path="*" element={<LocationText />} /></Routes>
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /가이드/i }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/portal/folder/F1'));
  });
});
