import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';

export default function AdminMembers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'members', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (search) params.set('search', search);
      return (await adminApi.get(`/api/admin/members?${params}`)).data;
    },
    placeholderData: prev => prev,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues: { isActive: true, isFeatured: false, displayOrder: 1 } });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'members'] });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v !== '' && v !== undefined) fd.append(k, String(v)); });
      if (photoFile) fd.append('photo', photoFile);
      if (editing) return adminApi.put(`/api/admin/members/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return adminApi.post('/api/admin/members', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { invalidate(); closeForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/api/admin/members/${id}`),
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const openEdit = (m) => {
    setEditing(m);
    const fields = ['fullName', 'businessCategory', 'businessName', 'workExperience', 'ideaSince', 'serviceArea', 'officeLocation', 'biography'];
    fields.forEach(f => setValue(f, m[f] || ''));
    setValue('dateOfBirth', m.dateOfBirth ? m.dateOfBirth.split('T')[0] : '');
    setValue('numberOfBranches', m.numberOfBranches ? String(m.numberOfBranches) : '');
    setValue('isFeatured', m.isFeatured); setValue('isActive', m.isActive); setValue('displayOrder', m.displayOrder);
    setShowForm(true);
  };

  const closeForm = () => { setEditing(null); setShowForm(false); setPhotoFile(null); reset({ isActive: true, isFeatured: false, displayOrder: 1 }); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Members</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 transition-colors">
          <Plus size={15} /> Add Member
        </button>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-idea-muted" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search members…" className="w-full pl-9 pr-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
        </div>
        {data?.meta && <span className="text-sm text-idea-muted self-center">{data.meta.total} members</span>}
      </div>

      <div className="bg-white border border-idea-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-idea-ivory border-b border-idea-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Member</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted hidden md:table-cell">Business</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted hidden lg:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-idea-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-idea-border">
            {isLoading ? Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="animate-pulse"><td className="px-4 py-3" colSpan={5}><div className="h-3 bg-gray-100 rounded w-1/2" /></td></tr>
            )) : data?.data.map(m => (
              <tr key={m.id} className="hover:bg-idea-ivory/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={m.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&size=32&background=0B1220&color=C8A96B`} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <p className="font-medium text-idea-navy">{m.fullName}</p>
                      {m.isFeatured && <span className="text-xs text-idea-gold">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-idea-muted hidden md:table-cell">{m.businessName || '—'}</td>
                <td className="px-4 py-3 text-idea-muted hidden lg:table-cell">{m.businessCategory || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{m.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(m)} className="p-1.5 text-idea-muted hover:text-idea-navy border border-transparent hover:border-idea-border rounded transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(m.id)} className="p-1.5 text-idea-muted hover:text-red-600 border border-transparent hover:border-red-200 rounded transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && data?.data.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-idea-muted">No members found.</td></tr>
            )}
          </tbody>
        </table>
        {data && data.meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 px-4 py-3 border-t border-idea-border">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs border border-idea-border rounded hover:border-idea-navy disabled:opacity-40">← Prev</button>
            <span className="px-3 py-1.5 text-xs text-idea-muted">Page {page}/{data.meta.totalPages}</span>
            <button disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs border border-idea-border rounded hover:border-idea-navy disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-idea-navy">{editing ? 'Edit' : 'Add'} Member</h2>
              <button onClick={closeForm}><X size={18} className="text-idea-muted" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Full Name *</label>
                  <input {...register('fullName', { required: true })} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">Required</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Date of Birth</label>
                  <input {...register('dateOfBirth')} type="date" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Business Name</label>
                  <input {...register('businessName')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Business Category</label>
                  <input {...register('businessCategory')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Work Experience</label>
                  <input {...register('workExperience')} placeholder="e.g. 10" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">IDEA Since</label>
                  <input {...register('ideaSince')} placeholder="e.g. 2018" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Branches</label>
                  <input {...register('numberOfBranches')} type="number" min={0} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Service Area</label>
                  <input {...register('serviceArea')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Office Location</label>
                  <input {...register('officeLocation')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Biography</label>
                <textarea {...register('biography')} rows={3} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Profile Photo</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhotoFile(e.target.files?.[0] || null)} className="w-full text-sm text-idea-muted file:mr-3 file:py-1.5 file:px-3 file:border file:border-idea-border file:rounded file:text-xs file:bg-white file:cursor-pointer" />
              </div>
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Display Order</label>
                  <input {...register('displayOrder', { valueAsNumber: true })} type="number" min={1} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('isActive')} type="checkbox" className="w-4 h-4 accent-idea-navy" />
                  <span className="text-sm text-idea-navy">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 accent-idea-gold" />
                  <span className="text-sm text-idea-navy">Featured</span>
                </label>
              </div>
              {saveMutation.isError && <p className="text-red-500 text-sm">Error saving. Please try again.</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 py-2.5 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 disabled:opacity-60">
                  {saveMutation.isPending ? 'Saving…' : editing ? 'Update Member' : 'Create Member'}
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
            <h3 className="font-heading font-bold text-idea-navy mb-2">Delete Member?</h3>
            <p className="text-idea-muted text-sm mb-5">This will permanently delete the member and all associated data.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="flex-1 py-2 bg-red-600 text-white text-sm font-semibold rounded disabled:opacity-60">
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
