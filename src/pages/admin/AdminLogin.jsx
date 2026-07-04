import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import { useAuth } from '../../hooks/useAuth';
import logo from '@/assets/idea-guntur-rocket-logo.jpg';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { data: auth, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => { if (auth) navigate('/admin', { replace: true }); }, [auth, navigate]);

  const mutation = useMutation({
    mutationFn: (data) => adminApi.post('/api/admin/auth/login', data),
    onSuccess: (res) => {
      if (res.data?.data?.token) {
        localStorage.setItem('adminToken', res.data.data.token);
      }
      navigate('/admin', { replace: true });
    },
  });

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-idea-navy flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <img src={logo} alt="IDEA Guntur Rocket" className="h-24 w-auto object-contain" />
            <span className="font-heading text-2xl font-bold text-idea-navy">IDEA</span>
          </div>
          <p className="mt-2 text-sm text-idea-muted">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-idea-navy mb-1">Email Address</label>
            <input {...register('email', { required: 'Email is required' })} type="email" autoComplete="email" className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" placeholder="admin@idea.in" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-idea-navy mb-1">Password</label>
            <input {...register('password', { required: 'Password is required' })} type="password" autoComplete="current-password" className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {mutation.isError && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
              Invalid credentials. Please try again.
            </p>
          )}

          <button type="submit" disabled={mutation.isPending} className="w-full py-3 bg-idea-navy text-white font-semibold rounded hover:bg-idea-navy-2 transition-colors disabled:opacity-60">
            {mutation.isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
