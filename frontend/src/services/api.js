import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getMeAPI = () => API.get('/auth/me');
export const updatePasswordAPI = (data) => API.put('/auth/password', data);

// Admin
export const getDashboardAPI = () => API.get('/admin/dashboard');
export const getAdminUsersAPI = (params) => API.get('/admin/users', { params });
export const getAdminUserByIdAPI = (id) => API.get(`/admin/users/${id}`);
export const createUserAPI = (data) => API.post('/admin/users', data);
export const getAdminStoresAPI = (params) => API.get('/admin/stores', { params });
export const createStoreAPI = (data) => API.post('/admin/stores', data);

// Stores (Normal User)
export const getStoresAPI = (params) => API.get('/stores', { params });
export const rateStoreAPI = (storeId, data) => API.post(`/stores/${storeId}/rate`, data);

// Owner
export const getOwnerDashboardAPI = () => API.get('/owner/dashboard');

export default API;
