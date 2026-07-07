import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function AdminTestimonials() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: async () => (await adminApi.get('/api/admin/testimonials')).data.data,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { quote: '', author: '', role: '', business: '', displayOrder: 1, isActive: true }
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editing) {
        return adminApi.put(`/api/admin/testimonials/${editing.id}`, payload);
      }
      return adminApi.post('/api/admin/testimonials', payload);
    },
    onSuccess: () => { invalidate(); closeForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/api/admin/testimonials/${id}`),
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const openEdit = (t) => {
    setEditing(t);
    setValue('quote', t.quote);
    setValue('author', t.author);
    setValue('role', t.role || '');
    setValue('business', t.business || '');
    setValue('displayOrder', t.displayOrder);
    setValue('isActive', t.isActive);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
    reset({ quote: '', author: '', role: '', business: '', displayOrder: 1, isActive: true });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Testimonials</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 transition-colors">
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      <div className="bg-white border border-idea-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-idea-ivory border-b border-idea-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Quote</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted hidden md:table-cell">Role / Business</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-idea-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-idea-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-2/3" /></td>
                </tr>
              ))
            ) : data?.map(t => (
              <tr key={t.id} className="hover:bg-idea-ivory/30 transition-colors">
                <td className="px-4 py-3 max-w-xs md:max-w-md">
                  <p className="line-clamp-2 text-idea-navy italic">“{t.quote}”</p>
                </td>
                <td className="px-4 py-3 font-semibold text-idea-navy">{t.author}</td>
                <td className="px-4 py-3 text-idea-muted hidden md:table-cell">
                  {t.role || '—'} {t.business ? `at ${t.business}` : ''}
                </td>
                <td className="px-4 py-3 text-idea-muted">{t.displayOrder}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {t.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(t)} className="p-1.5 text-idea-muted hover:text-idea-navy border border-transparent hover:border-idea-border rounded"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(t.id)} className="p-1.5 text-idea-muted hover:text-red-600 border border-transparent hover:border-red-200 rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && (!data || data.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-idea-muted">No testimonials found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-idea-navy">{editing ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={closeForm}><X size={18} className="text-idea-muted" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Quote *</label>
                <textarea {...register('quote', { required: true })} rows={4} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" placeholder="Enter quote..." />
                {errors.quote && <p className="text-red-500 text-xs mt-1">Quote content is required</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Author Name *</label>
                  <input {...register('author', { required: true })} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" placeholder="e.g. John Doe" />
                  {errors.author && <p className="text-red-500 text-xs mt-1">Author name is required</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Author Role</label>
                  <input {...register('role')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" placeholder="e.g. CEO" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Business/Company</label>
                  <input {...register('business')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" placeholder="e.g. Tech Corp" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Display Order</label>
                  <input {...register('displayOrder', { valueAsNumber: true })} type="number" min={1} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input {...register('isActive')} type="checkbox" className="w-4 h-4 accent-idea-navy" />
                <span className="text-sm text-idea-navy">Active (visible on website)</span>
              </label>
              {saveMutation.isError && <p className="text-red-500 text-sm">Error saving. Please try again.</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 py-2.5 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 disabled:opacity-60">
                  {saveMutation.isPending ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeForm} className="px-6 py-2.5 border border-idea-border rounded text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-heading font-bold text-idea-navy mb-2">Delete Testimonial?</h3>
            <p className="text-idea-muted text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="flex-1 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 disabled:opacity-60">
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-idea-border rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
