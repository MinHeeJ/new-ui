import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';
import { authApi } from '../api';

vi.mock('../api', () => ({
  authApi: { login: vi.fn() },
}));

function LocationText() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('LoginPage', () => {
  it('username/password 로그인 폼을 렌더링한다', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: '관리자 로그인' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
  });

  it('로그인 성공 시 토큰을 저장하고 /admin으로 이동한다', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ token: 'jwt-token', username: 'root' });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<LocationText />} />
        </Routes>
      </MemoryRouter>
    );

    await user.clear(screen.getByDisplayValue('admin'));
    await user.type(screen.getByRole('textbox'), 'root');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'secret');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => expect(authApi.login).toHaveBeenCalledWith({ username: 'root', password: 'secret' }));
    expect(localStorage.getItem('cms_token')).toBe('jwt-token');
    expect(localStorage.getItem('cms_username')).toBe('root');
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin'));
  });

  it('로그인 실패 시 에러 메시지를 표시한다', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('인증 실패'));
    const user = userEvent.setup();

    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    await user.type(screen.getByPlaceholderText('비밀번호'), 'wrong');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('인증 실패')).toBeInTheDocument();
  });
});
