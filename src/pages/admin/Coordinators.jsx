import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function AdminCoordinators() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data: coordinators, isLoading } = useQuery({
    queryKey: ['admin', 'coordinators'],
    queryFn: async () => (await adminApi.get('/api/admin/coordinators')).data.data,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { designation: 'Coordinator', isActive: true, displayOrder: 1 }
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'coordinators'] });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v !== '' && v !== undefined) fd.append(k, String(v)); });
      if (photoFile) fd.append('photo', photoFile);
      if (editing) return adminApi.put(`/api/admin/coordinators/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return adminApi.post('/api/admin/coordinators', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { invalidate(); closeForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/api/admin/coordinators/${id}`),
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const openEdit = (m) => {
    setEditing(m);
    setValue('fullName', m.fullName); setValue('designation', m.designation); setValue('businessName', m.businessName);
    setValue('caption', m.caption || ''); setValue('displayOrder', m.displayOrder); setValue('isActive', m.isActive);
    setValue('dateOfBirth', m.dateOfBirth ? m.dateOfBirth.split('T')[0] : '');
    setValue('workExperience', m.workExperience ? String(m.workExperience) : '');
    setValue('ideaSince', m.ideaSince ? String(m.ideaSince) : '');
    setValue('numberOfBranches', m.numberOfBranches ? String(m.numberOfBranches) : '');
    setValue('serviceArea', m.serviceArea || '');
    setValue('officeLocation', m.officeLocation || '');
    setValue('biography', m.biography || '');
    setValue('youtubeUrl', m.youtubeUrl || '');
    setValue('facebookUrl', m.facebookUrl || '');
    setValue('instagramUrl', m.instagramUrl || '');
    setValue('linkedinUrl', m.linkedinUrl || '');
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
    setPhotoFile(null);
    reset({ designation: 'Coordinator', isActive: true, displayOrder: 1, dateOfBirth: '', workExperience: '', ideaSince: '', numberOfBranches: '', serviceArea: '', officeLocation: '', biography: '', youtubeUrl: '', facebookUrl: '', instagramUrl: '', linkedinUrl: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Chapter Coordinators</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 transition-colors">
          <Plus size={15} /> Add Coordinator
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {coordinators?.map(m => (
            <div key={m.id} className="bg-white border border-idea-border rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
              <div className="relative aspect-square">
                <img src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&background=0B1220&color=C8A96B`} alt={m.fullName} className="w-full h-full object-cover" />
                {!m.isActive && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-xs font-bold">INACTIVE</span></div>}
              </div>
              <div className="p-3">
                <p className="font-semibold text-idea-navy text-xs">{m.fullName}</p>
                <p className="text-idea-gold text-xs">{m.designation}</p>
                <p className="text-idea-muted text-xs mt-0.5">Order: {m.displayOrder}</p>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => openEdit(m)} className="flex-1 py-1 text-xs border border-idea-border rounded hover:border-idea-navy flex items-center justify-center gap-1 text-idea-navy"><Pencil size={11} /> Edit</button>
                  <button onClick={() => setDeleteId(m.id)} className="flex-1 py-1 text-xs border border-red-200 rounded hover:bg-red-50 flex items-center justify-center gap-1 text-red-600"><Trash2 size={11} /> Del</button>
                </div>
              </div>
            </div>
          ))}
          {(!coordinators || coordinators.length === 0) && <p className="col-span-5 text-center py-10 text-idea-muted">No coordinators added yet.</p>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-idea-navy">{editing ? 'Edit' : 'Add'} Coordinator</h2>
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
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Designation *</label>
                  <input {...register('designation', { required: true })} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                  {errors.designation && <p className="text-red-500 text-xs mt-1">Required</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Business Name *</label>
                  <input {...register('businessName', { required: true })} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Date of Birth</label>
                  <input {...register('dateOfBirth')} type="date" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Caption</label>
                <input {...register('caption')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Work Experience (years)</label>
                  <input {...register('workExperience')} placeholder="e.g. 8" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">IDEA Since</label>
                  <input {...register('ideaSince')} placeholder="e.g. 2020" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Facebook URL</label>
                  <input {...register('facebookUrl')} placeholder="https://facebook.com/..." className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Instagram URL</label>
                  <input {...register('instagramUrl')} placeholder="https://instagram.com/..." className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">LinkedIn URL</label>
                  <input {...register('linkedinUrl')} placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">YouTube URL</label>
                  <input {...register('youtubeUrl')} placeholder="https://youtube.com/..." className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Photo (Max 10MB) {editing?.photoUrl && '(leave empty to keep current)'}</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhotoFile(e.target.files?.[0] || null)} className="w-full text-sm text-idea-muted file:mr-3 file:py-1.5 file:px-3 file:border file:border-idea-border file:rounded file:text-xs file:bg-white file:cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Display Order</label>
                  <input {...register('displayOrder', { valueAsNumber: true })} type="number" min={1} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div className="flex items-end gap-2 pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input {...register('isActive')} type="checkbox" className="w-4 h-4 accent-idea-navy" />
                    <span className="text-sm text-idea-navy">Active</span>
                  </label>
                </div>
              </div>
              {saveMutation.isError && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm space-y-1">
                  <p className="font-semibold">Error saving. Please correct the following:</p>
                  <ul className="list-disc pl-4 text-xs space-y-0.5">
                    {saveMutation.error.response?.data?.errors?.map((err, idx) => (
                      <li key={idx}>{err.message || err.msg}</li>
                    )) || <li>An unexpected server error occurred.</li>}
                  </ul>
                </div>
              )}
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
            <h3 className="font-heading font-bold text-idea-navy mb-2">Delete Coordinator?</h3>
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
