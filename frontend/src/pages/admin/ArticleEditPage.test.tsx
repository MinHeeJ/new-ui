import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArticleEditPage from './ArticleEditPage';
import { articleApi, folderApi } from '../../api';

vi.mock('../../api', () => ({
  folderApi: { getRoots: vi.fn() },
  articleApi: { getDetail: vi.fn(), create: vi.fn(), update: vi.fn(), publish: vi.fn(), offline: vi.fn(), delete: vi.fn() },
}));

function LocationText() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('ArticleEditPage', () => {
  beforeEach(() => {
    vi.mocked(folderApi.getRoots).mockResolvedValue([{ folderCode: 'F1', title: '공지사항' }]);
  });

  it('새 게시글 작성 화면을 렌더링하고 초안을 저장한다', async () => {
    vi.mocked(articleApi.create).mockResolvedValue({ articleCode: 'A100', title: '새 글', status: 'DRAFT' });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/admin/article/new']}>
        <Routes>
          <Route path="/admin/article/new" element={<><ArticleEditPage /><LocationText /></>} />
          <Route path="/admin/article/:articleCode" element={<LocationText />} />
        </Routes>
      </MemoryRouter>
    );

    const titleInput = await screen.findByPlaceholderText('제목을 입력하세요...');
    await user.type(titleInput, '새 글');
    await user.clear(screen.getByPlaceholderText('Markdown으로 작성하세요...'));
    await user.type(screen.getByPlaceholderText('Markdown으로 작성하세요...'), '# 본문');
    await user.click(screen.getByRole('button', { name: 'Save Draft' }));

    await waitFor(() => expect(articleApi.create).toHaveBeenCalledWith({ title: '새 글', contentMd: '# 본문', folderCode: 'F1' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/article/A100'));
  });

  it('수정 화면에서 기존 게시글을 불러오고 발행 버튼을 처리한다', async () => {
    vi.mocked(articleApi.getDetail).mockResolvedValue({ articleCode: 'A1', title: '기존 글', contentMd: '# 기존', folderCode: 'F1', status: 'DRAFT' });
    vi.mocked(articleApi.update).mockResolvedValue({ articleCode: 'A1', title: '기존 글', status: 'DRAFT' });
    vi.mocked(articleApi.publish).mockResolvedValue({ articleCode: 'A1', title: '기존 글', status: 'PUBLISHED' });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/admin/article/A1']}>
        <Routes><Route path="/admin/article/:articleCode" element={<ArticleEditPage />} /></Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue('기존 글')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Publish/i }));

    await waitFor(() => expect(articleApi.update).toHaveBeenCalled());
    expect(articleApi.publish).toHaveBeenCalledWith('A1');
    expect(await screen.findByText('게시글이 발행되었습니다.')).toBeInTheDocument();
  });
});
