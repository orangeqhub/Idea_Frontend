import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { publicApi } from '../../services/publicApi';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function HeadTable() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [businessLogoFile, setBusinessLogoFile] = useState(null);
  const [businessGalleryFiles, setBusinessGalleryFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [youtubeUrls, setYoutubeUrls] = useState(['']);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'head-table'],
    queryFn: async () => (await adminApi.get('/api/admin/head-table')).data.data,
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ['admin', 'chapters-list'],
    queryFn: async () => (await publicApi.get('/api/public/chapters')).data.data,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues: { isActive: true, displayOrder: 1, chapterId: '', businessDescription: '' } });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'head-table'] });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v !== '' && v !== undefined) fd.append(k, String(v)); });
      if (photoFile) fd.append('photo', photoFile);
      if (businessLogoFile) fd.append('businessLogo', businessLogoFile);
      if (businessGalleryFiles && businessGalleryFiles.length > 0) {
        businessGalleryFiles.forEach(file => fd.append('businessGallery', file));
      }
      fd.append('existingGallery', existingGallery.join(','));

      if (editing) return adminApi.put(`/api/admin/head-table/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return adminApi.post('/api/admin/head-table', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { invalidate(); closeForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/api/admin/head-table/${id}`),
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
    setValue('whatsappNumber', m.whatsappNumber || '');
    setValue('chapterId', m.chapterId || '');
    setValue('businessDescription', m.businessDescription || '');
    setYoutubeUrls(m.youtubeUrl ? m.youtubeUrl.split(',') : ['']);
    setExistingGallery(m.businessGallery ? m.businessGallery.split(',').filter(Boolean) : []);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
    setPhotoFile(null);
    setBusinessLogoFile(null);
    setBusinessGalleryFiles([]);
    setExistingGallery([]);
    reset({ isActive: true, displayOrder: 1, dateOfBirth: '', workExperience: '', ideaSince: '', numberOfBranches: '', serviceArea: '', officeLocation: '', biography: '', youtubeUrl: '', facebookUrl: '', instagramUrl: '', linkedinUrl: '', whatsappNumber: '', chapterId: '', businessDescription: '' });
    setYoutubeUrls(['']);
  };

  const onSaveSubmit = (d) => {
    d.youtubeUrl = youtubeUrls.filter(u => u.trim() !== '').join(',');
    saveMutation.mutate(d);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Head Table</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 transition-colors">
          <Plus size={15} /> Add Member
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data?.map(m => (
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
          {(!data || data.length === 0) && <p className="col-span-5 text-center py-10 text-idea-muted">No head table members yet.</p>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-idea-navy">{editing ? 'Edit' : 'Add'} Head Table Member</h2>
              <button onClick={closeForm}><X size={18} className="text-idea-muted" /></button>
            </div>
            <form onSubmit={handleSubmit(onSaveSubmit)} className="space-y-4">
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
              </div>
              <div className="border border-idea-border/60 rounded-lg p-3 bg-idea-navy/[0.01]">
                <label className="text-xs font-semibold text-idea-navy mb-2 block flex justify-between items-center">
                  <span>YouTube Videos</span>
                  <button type="button" onClick={() => setYoutubeUrls([...youtubeUrls, ''])} className="text-[10px] bg-idea-navy text-white px-2 py-0.5 rounded hover:bg-idea-gold hover:text-idea-navy font-bold uppercase tracking-wider transition-colors duration-200">
                    + Add YouTube Video
                  </button>
                </label>
                <div className="space-y-2">
                  {youtubeUrls.map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        value={url} 
                        onChange={e => {
                          const copy = [...youtubeUrls];
                          copy[idx] = e.target.value;
                          setYoutubeUrls(copy);
                        }}
                        placeholder="https://youtube.com/watch?v=..." 
                        className="flex-1 px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" 
                      />
                      {youtubeUrls.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => setYoutubeUrls(youtubeUrls.filter((_, i) => i !== idx))} 
                          className="px-3 py-2 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 text-xs border border-idea-border rounded transition-all duration-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">WhatsApp Number</label>
                  <input {...register('whatsappNumber')} placeholder="e.g. 919876543210 (include country code without +)" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Chapter</label>
                  <select {...register('chapterId')} className="w-full px-3 py-2 border border-idea-border rounded text-sm bg-white focus:outline-none focus:border-idea-navy">
                    <option value="">No Chapter (General)</option>
                    {chapters.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">About Business</label>
                <textarea {...register('businessDescription')} placeholder="Tell us about the business, products, or services…" rows={3} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Profile Photo (Max 10MB)</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhotoFile(e.target.files?.[0] || null)} className="w-full text-sm text-idea-muted file:mr-3 file:py-1.5 file:px-3 file:border file:border-idea-border file:rounded file:text-xs file:bg-white file:cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Business Logo (Max 10MB)</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setBusinessLogoFile(e.target.files?.[0] || null)} className="w-full text-sm text-idea-muted file:mr-3 file:py-1.5 file:px-3 file:border file:border-idea-border file:rounded file:text-xs file:bg-white file:cursor-pointer" />
                </div>
              </div>
              <div className="border border-idea-border/60 rounded-lg p-3 bg-idea-navy/[0.01]">
                <label className="text-xs font-semibold text-idea-navy mb-2 block">Business Gallery (Max 8 Images)</label>
                <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e => setBusinessGalleryFiles(Array.from(e.target.files || []))} className="w-full text-sm text-idea-muted file:mr-3 file:py-1.5 file:px-3 file:border file:border-idea-border file:rounded file:text-xs file:bg-white file:cursor-pointer" />
                {existingGallery.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold text-idea-navy uppercase tracking-wider mb-2">Existing Images</p>
                    <div className="flex flex-wrap gap-2">
                      {existingGallery.map((url, i) => (
                        <div key={i} className="relative group/img w-16 h-16 rounded border border-idea-border overflow-hidden">
                          <img src={url} className="w-full h-full object-cover" alt="" />
                          <button type="button" onClick={() => setExistingGallery(existingGallery.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 text-white font-semibold flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 text-[10px]">
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {businessGalleryFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold text-idea-navy uppercase tracking-wider mb-2">New Images to Upload</p>
                    <ul className="text-xs text-idea-muted list-disc list-inside">
                      {businessGalleryFiles.map((file, i) => <li key={i} className="truncate">{file.name}</li>)}
                    </ul>
                  </div>
                )}
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
            <h3 className="font-heading font-bold text-idea-navy mb-2">Delete Member?</h3>
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
