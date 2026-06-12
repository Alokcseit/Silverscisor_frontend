// src/hooks/useAdmin.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../store/adminSlice';
import axios from 'axios';

const ADMIN_API = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5003/api/admin';

const adminApi = axios.create({ baseURL: ADMIN_API });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const useAdminLogin = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (credentials) => adminApi.post('/auth/login', credentials),
    onSuccess: (res) => dispatch(setAdmin(res.data.data))
  });
};

// Overview
export const useOverview = () => useQuery({
  queryKey: ['admin', 'overview'],
  queryFn: () => adminApi.get('/analytics/overview').then(r => r.data.data),
  staleTime: 5 * 60 * 1000,
  retry: 1
});

// Revenue
export const useRevenue = (period = '30') => useQuery({
  queryKey: ['admin', 'revenue', period],
  queryFn: () => adminApi.get(`/analytics/revenue?period=${period}`).then(r => r.data.data),
  staleTime: 10 * 60 * 1000
});

// Salons
export const useAdminSalons = (params = {}) => useQuery({
  queryKey: ['admin', 'salons', params],
  queryFn: () => adminApi.get('/salons', { params }).then(r => r.data)
});

export const usePendingApplications = () => useQuery({
  queryKey: ['admin', 'applications'],
  queryFn: () => adminApi.get('/salons/applications').then(r => r.data)
});

export const useApproveSalon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ salonId, note }) => adminApi.put(`/salons/${salonId}/approve`, { note }),
    onSuccess: () => {
      qc.invalidateQueries(['admin', 'salons']);
      qc.invalidateQueries(['admin', 'applications']);
    }
  });
};

export const useBlockSalon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ salonId, reason }) => adminApi.put(`/salons/${salonId}/block`, { reason }),
    onSuccess: () => qc.invalidateQueries(['admin', 'salons'])
  });
};

// Users
export const useAdminUsers = (params = {}) => useQuery({
  queryKey: ['admin', 'users', params],
  queryFn: () => adminApi.get('/users', { params }).then(r => r.data)
});

export const useBlockUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }) => adminApi.put(`/users/${userId}/block`, { reason }),
    onSuccess: () => qc.invalidateQueries(['admin', 'users'])
  });
};

export const useUnblockUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }) => adminApi.put(`/users/${userId}/unblock`),
    onSuccess: () => qc.invalidateQueries(['admin', 'users'])
  });
};

// Subscriptions
export const useAdminSubscriptions = (params = {}) => useQuery({
  queryKey: ['admin', 'subscriptions', params],
  queryFn: () => adminApi.get('/subscriptions', { params }).then(r => r.data)
});

export const useUpdatePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ salonId, plan, reason, tokensToAdd }) =>
      adminApi.put(`/subscriptions/${salonId}/plan`, { plan, reason, tokensToAdd }),
    onSuccess: () => qc.invalidateQueries(['admin', 'subscriptions'])
  });
};

export const useAddTokens = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ salonId, tokens, reason }) =>
      adminApi.post(`/subscriptions/${salonId}/tokens`, { tokens, reason }),
    onSuccess: () => qc.invalidateQueries(['admin', 'subscriptions'])
  });
};

// System
export const useSystemHealth = () => useQuery({
  queryKey: ['admin', 'health'],
  queryFn: () => adminApi.get('/system/health').then(r => r.data.data),
  refetchInterval: 30 * 1000,
  retry: 1
});

export const useSystemLogs = (params = {}) => useQuery({
  queryKey: ['admin', 'logs', params],
  queryFn: () => adminApi.get('/system/logs', { params }).then(r => r.data)
});