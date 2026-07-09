import { useEffect } from 'react';
import { adminApi } from '../services/adminApi';

export function useCsrf() {
  useEffect(() => {
    adminApi.get('/admin/auth/csrf').catch(() => {/* ignore */});
  }, []);
}
