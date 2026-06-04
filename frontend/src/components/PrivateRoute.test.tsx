import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import PrivateRoute from './PrivateRoute';
import { useAuthStore } from '../store/auth-store';

describe('PrivateRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, username: null, isAuthenticated: false });
  });

  it('인증된 사용자는 보호된 자식 화면을 볼 수 있다', () => {
    useAuthStore.setState({ token: 'token', username: 'admin', isAuthenticated: true });

    render(<MemoryRouter><PrivateRoute><div>관리자 콘텐츠</div></PrivateRoute></MemoryRouter>);

    expect(screen.getByText('관리자 콘텐츠')).toBeInTheDocument();
  });

  it('인증되지 않은 사용자는 /login으로 리다이렉트된다', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<PrivateRoute><div>관리자 콘텐츠</div></PrivateRoute>} />
          <Route path="/login" element={<div>로그인 화면</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('로그인 화면')).toBeInTheDocument();
    expect(screen.queryByText('관리자 콘텐츠')).not.toBeInTheDocument();
  });
});
