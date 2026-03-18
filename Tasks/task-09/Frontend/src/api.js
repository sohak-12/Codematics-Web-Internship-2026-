import axios from 'axios';

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor mein 'config.url' ko safe tarike se check karein
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Safely check karein ki URL exist karta hai ya nahi
  const isLoginRequest = config.url && config.url.includes('/auth/login');
  
  if (token && !isLoginRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar server 401 (Unauthorized) bhejta hai
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export const booksAPI = {
  getAll: (search = '') => api.get('/books', { params: { search } }),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export const membersAPI = {
  getAll: (search = '') => api.get('/members', { params: { search } }),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

export const issuesAPI = {
  getAll: () => api.get('/issues'),
  issue: (data) => api.post('/issues', data),
  return: (id) => api.put(`/issues/${id}`),
  delete: (id) => api.delete(`/issues/${id}`) 
};

export const statsAPI = {
  get: () => api.get('/stats'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export default api;
