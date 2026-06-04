import { create } from 'zustand';

type AuthState = {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, username?: string) => void;
  logout: () => void;
};

const savedToken = localStorage.getItem('cms_token');
const savedUsername = localStorage.getItem('cms_username');

export const useAuthStore = create<AuthState>((set) => ({
  token: savedToken,
  username: savedUsername,
  isAuthenticated: Boolean(savedToken),
  login: (token, username = 'admin') => {
    localStorage.setItem('cms_token', token);
    localStorage.setItem('cms_username', username);
    set({ token, username, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_username');
    set({ token: null, username: null, isAuthenticated: false });
  },
}));
