import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await adminApi.get('/admin/auth/me');
      return res.data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => adminApi.post('/admin/auth/logout'),
    onSettled: () => {
      localStorage.removeItem('adminToken');
      qc.clear();
      navigate('/admin/login');
    },
  });
}
