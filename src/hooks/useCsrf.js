import { useEffect } from 'react';
import { adminApi } from '../services/adminApi';

export function useCsrf() {
  useEffect(() => {
    adminApi.get('/api/admin/auth/csrf').catch(() => {/* ignore */});
  }, []);
}
