import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import HeaderBar from './HeaderBar';
import { searchApi } from '../api';

vi.mock('../api', () => ({
  searchApi: { search: vi.fn() },
}));

function LocationText() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('HeaderBar', () => {
  it('다크 헤더 네비게이션과 검색 입력을 렌더링한다', () => {
    render(<MemoryRouter><HeaderBar mode="portal" /></MemoryRouter>);

    expect(screen.getByText('CMS')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Portal/i })).toHaveAttribute('href', '/portal');
    expect(screen.getByRole('link', { name: /Admin/i })).toHaveAttribute('href', '/admin');
    expect(screen.getByPlaceholderText('문서 검색...')).toBeInTheDocument();
  });

  it('검색 결과를 클릭하면 해당 게시글 경로로 이동한다', async () => {
    vi.mocked(searchApi.search).mockResolvedValue([{ articleCode: 'A-001', title: '테스트 문서', folderTitle: '가이드' }]);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/portal']}>
        <HeaderBar mode="portal" />
        <Routes><Route path="*" element={<LocationText />} /></Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('문서 검색...'), '테스트');

    expect(await screen.findByText('테스트 문서')).toBeInTheDocument();
    expect(searchApi.search).toHaveBeenCalledWith('테스트', true);
    await user.click(screen.getByRole('button', { name: /테스트 문서/i }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/portal/article/A-001'));
  });
});
