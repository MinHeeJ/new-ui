import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 15000 });

const unwrap = (res) => {
  const body = res.data;
  if (body && typeof body === 'object' && 'code' in body) {
    if (body.code === 200) return body.data;
    throw new Error(body.message || '요청 처리 중 오류가 발생했습니다.');
  }
  return body;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_username');
      if (!window.location.pathname.startsWith('/login')) window.location.href = '/login';
    }
    const message = error.response?.data?.message || error.message || 'API 요청 실패';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
};

export const folderApi = {
  getRoots: (portalMode = false) => api.get('/folders/root', { params: { portalMode } }).then(unwrap),
  getChildren: (folderCode, portalMode = false) => api.get(`/folders/${folderCode}/children`, { params: { portalMode } }).then(unwrap),
  create: (payload) => api.post('/folders', payload).then(unwrap),
  update: (folderCode, payload) => api.put(`/folders/${folderCode}`, payload).then(unwrap),
  delete: (folderCode) => api.delete(`/folders/${folderCode}`).then(unwrap),
};

export const articleApi = {
  getDetail: (articleCode) => api.get(`/articles/${articleCode}`).then(unwrap),
  create: (payload) => api.post('/articles', payload).then(unwrap),
  update: (articleCode, payload) => api.put(`/articles/${articleCode}`, payload).then(unwrap),
  delete: (articleCode) => api.delete(`/articles/${articleCode}`).then(unwrap),
  publish: (articleCode) => api.put(`/articles/${articleCode}/publish`).then(unwrap),
  offline: (articleCode) => api.put(`/articles/${articleCode}/offline`).then(unwrap),
};

export const searchApi = {
  search: (keyword = '', portalMode = false) => api.get('/search', { params: { keyword, portalMode } }).then(unwrap),
};

export const attachmentApi = {
  upload: (formData) => api.post('/attachments', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap),
  download: (id) => api.get(`/attachments/${id}/download`, { responseType: 'blob' }).then((res) => res.data),
};

export default api;
