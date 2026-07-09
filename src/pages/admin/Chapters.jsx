import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { publicApi } from '../../services/publicApi';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

export default function AdminChapters() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['admin', 'chapters'],
    queryFn: async () => (await publicApi.get('/api/public/chapters')).data.data,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { name: '' }
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'chapters'] });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const fd = new FormData();
      fd.append('name', formData.name);
      if (logoFile) {
        fd.append('logo', logoFile);
      }
      if (editing) {
        return adminApi.put(`/api/admin/chapters/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      return adminApi.post('/api/admin/chapters', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { invalidate(); closeForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/api/admin/chapters/${id}`),
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const openEdit = (c) => {
    setEditing(c);
    setValue('name', c.name);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
    setLogoFile(null);
    reset({ name: '' });
  };

  const onSubmit = (d) => {
    saveMutation.mutate(d);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Chapters</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 transition-colors">
          <Plus size={15} /> Add Chapter
        </button>
      </div>

      <div className="bg-white border border-idea-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-idea-ivory border-b border-idea-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-idea-muted">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-idea-muted">Chapter Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-idea-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-idea-border">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-1/3" /></td>
                </tr>
              ))
            ) : chapters.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-idea-muted text-sm">No chapters created yet. Click "Add Chapter" to begin.</td>
              </tr>
            ) : chapters.map(c => (
              <tr key={c.id} className="hover:bg-idea-ivory/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {c.logoUrl ? (
                    <img src={c.logoUrl} alt={c.name} className="h-10 w-10 object-contain rounded border border-idea-border" />
                  ) : (
                    <div className="h-10 w-10 bg-idea-navy text-idea-gold font-bold flex items-center justify-center rounded text-xs">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-idea-navy">{c.name}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-idea-navy hover:bg-gray-100 rounded transition-colors" title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg border border-idea-border max-w-md w-full shadow-2xl p-6 relative">
            <button onClick={closeForm} className="absolute right-4 top-4 p-1 text-idea-muted hover:text-idea-navy hover:bg-gray-100 rounded transition-colors">
              <X size={18} />
            </button>
            <h2 className="font-heading text-lg font-bold text-idea-navy mb-4">
              {editing ? 'Edit Chapter' : 'Add New Chapter'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Chapter Name *</label>
                <input {...register('name', { required: 'Name is required' })} placeholder="e.g. Guntur Rocket" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Chapter Logo (Max 10MB)</label>
                <div className="flex items-center gap-3">
                  {editing?.logoUrl && !logoFile && (
                    <img src={editing.logoUrl} alt="Current" className="h-10 w-10 object-contain rounded border border-idea-border" />
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-idea-border hover:border-idea-gold rounded text-sm text-idea-muted hover:text-idea-navy cursor-pointer transition-all">
                    <Upload size={14} />
                    <span className="truncate">{logoFile ? logoFile.name : 'Choose Logo Image…'}</span>
                    <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeForm} className="px-4 py-2 border border-idea-border text-idea-navy text-sm font-semibold rounded hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 transition-colors disabled:opacity-50">
                  {saveMutation.isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-idea-border max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-heading font-bold text-idea-navy text-lg mb-2">Delete Chapter?</h3>
            <p className="text-idea-muted text-sm mb-6">Are you sure you want to delete this chapter? This action is permanent and associated members will lose their chapter affiliation.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-idea-border text-idea-navy text-sm font-semibold rounded hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
