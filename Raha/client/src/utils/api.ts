import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import {
  mockAuthAPI,
  mockUserAPI,
  mockWalletAPI,
  mockSubscriptionAPI,
  mockGroupAPI,
} from './mockAPI.ts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'; // Default to true

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API functions - use mock or real based on environment
export const authAPI = USE_MOCK ? mockAuthAPI : {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = USE_MOCK ? mockUserAPI : {
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, data: Record<string, string>) => api.patch(`/users/${id}`, data),
};

export const walletAPI = USE_MOCK ? mockWalletAPI : {
  topup: (amount: number) => api.post('/wallet/topup', { amount }),
  withdraw: (amount: number) => api.post('/wallet/withdraw', { amount }),
  getTransactions: () => api.get('/wallet/transactions'),
};

export const subscriptionAPI = USE_MOCK ? mockSubscriptionAPI : {
  getAll: () => api.get('/subscriptions'),
  create: (data: Record<string, string | number>) => api.post('/subscriptions', data),
};

export const groupAPI = USE_MOCK ? mockGroupAPI : {
  getAll: () => api.get('/groups'),
  create: (data: { subscriptionId: string }) => api.post('/groups', data),
  getById: (id: string) => api.get(`/groups/${id}`),
  join: (id: string) => api.post(`/groups/${id}/join`),
  pay: (id: string) => api.post(`/groups/${id}/pay`),
};