import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ArticleReadPage from './ArticleReadPage';
import { articleApi } from '../../api';

vi.mock('../../api', () => ({
  articleApi: { getDetail: vi.fn() },
}));

describe('ArticleReadPage', () => {
  it('게시글 상세를 조회하고 Markdown 본문과 목차를 렌더링한다', async () => {
    vi.mocked(articleApi.getDetail).mockResolvedValue({
      articleCode: 'A1',
      title: '포털 게시글',
      folderTitle: '가이드',
      publishedAt: '2026-01-01T00:00:00Z',
      contentMd: '# 개요\n\n본문입니다.\n\n| A | B |\n|---|---|\n| 1 | 2 |',
    });

    render(
      <MemoryRouter initialEntries={['/portal/article/A1']}>
        <Routes><Route path="/portal/article/:articleCode" element={<ArticleReadPage />} /></Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '포털 게시글' })).toBeInTheDocument();
    expect(articleApi.getDetail).toHaveBeenCalledWith('A1');
    expect(screen.getByRole('heading', { name: '개요' })).toHaveAttribute('id', '개요');
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '개요' })).toBeInTheDocument();
  });
});
