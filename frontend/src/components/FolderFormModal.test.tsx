import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import FolderFormModal from './FolderFormModal';
import { folderApi } from '../api';

vi.mock('../api', () => ({
  folderApi: { create: vi.fn(), update: vi.fn() },
}));

describe('FolderFormModal', () => {
  it('닫힌 상태에서는 모달을 렌더링하지 않는다', () => {
    render(<FolderFormModal isOpen={false} mode="create" onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('폴더 생성 폼을 렌더링하고 생성 API를 호출한다', async () => {
    vi.mocked(folderApi.create).mockResolvedValue({ folderCode: 'F1' });
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const user = userEvent.setup();

    render(<FolderFormModal isOpen mode="create" parentFolderCode="P1" onClose={onClose} onSuccess={onSuccess} />);

    expect(screen.getByRole('heading', { name: '새 폴더' })).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('예: 제품 문서'), '제품 문서');
    await user.type(screen.getByPlaceholderText('폴더 설명'), '제품 설명');
    await user.click(screen.getByRole('button', { name: '생성' }));

    await waitFor(() => expect(folderApi.create).toHaveBeenCalledWith({ title: '제품 문서', description: '제품 설명', parentFolderCode: 'P1' }));
    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('수정 모드에서 기존 데이터를 채우고 update API를 호출한다', async () => {
    vi.mocked(folderApi.update).mockResolvedValue({ folderCode: 'F1' });
    const user = userEvent.setup();

    render(<FolderFormModal isOpen mode="edit" folder={{ folderCode: 'F1', title: '기존 폴더', description: '기존 설명', active: true }} onClose={vi.fn()} />);

    await user.clear(screen.getByDisplayValue('기존 폴더'));
    await user.type(screen.getByPlaceholderText('예: 제품 문서'), '수정 폴더');
    await user.click(screen.getByRole('checkbox', { name: /활성 상태/i }));
    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(folderApi.update).toHaveBeenCalledWith('F1', { title: '수정 폴더', description: '기존 설명', active: false }));
  });
});
