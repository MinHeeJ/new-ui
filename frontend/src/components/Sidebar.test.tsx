import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Sidebar from './Sidebar';
import { folderApi } from '../api';

const mockLogout = vi.hoisted(() => vi.fn());

vi.mock('../api', () => ({
  folderApi: { getRoots: vi.fn() },
}));

vi.mock('../store/auth-store', () => ({
  useAuthStore: (selector: any) => selector({ logout: mockLogout }),
}));

function LocationText() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('Sidebar', () => {
  it('포털 모드 메뉴와 폴더 목록을 렌더링한다', async () => {
    vi.mocked(folderApi.getRoots).mockResolvedValue([{ folderCode: 'F1', title: '공지사항' }]);

    render(<MemoryRouter initialEntries={['/portal']}><Sidebar mode="portal" /></MemoryRouter>);

    expect(screen.getByRole('link', { name: /Portal Home/i })).toHaveClass('active');
    expect(await screen.findByRole('link', { name: /공지사항/i })).toHaveAttribute('href', '/portal/folder/F1');
    expect(folderApi.getRoots).toHaveBeenCalledWith(true);
  });

  it('관리자 모드에서 활성 메뉴를 표시하고 로그아웃 시 로그인 페이지로 이동한다', async () => {
    vi.mocked(folderApi.getRoots).mockResolvedValue([]);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/admin/articles']}>
        <Sidebar mode="admin" />
        <Routes><Route path="*" element={<LocationText />} /></Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /게시글 관리/i })).toHaveClass('active');
    await user.click(screen.getByRole('button', { name: /로그아웃/i }));

    expect(mockLogout).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'));
    expect(folderApi.getRoots).toHaveBeenCalledWith(false);
  });
});
