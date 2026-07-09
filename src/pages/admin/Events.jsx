import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const STATUS_COLOR = {
  UPCOMING: 'bg-green-100 text-green-700', COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700', POSTPONED: 'bg-yellow-100 text-yellow-700',
};

export default function AdminEvents() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'events', page],
    queryFn: async () => (await adminApi.get(`/admin/events?page=${page}&pageSize=20`)).data,
    placeholderData: prev => prev,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues: { status: 'UPCOMING', isPublished: false } });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'events'] });

  const saveMutation = useMutation({
    mutationFn: async (d) => {
      const fd = new FormData();
      Object.entries(d).forEach(([k, v]) => { if (v !== '' && v !== undefined) fd.append(k, String(v)); });
      if (coverFile) fd.append('cover', coverFile);
      if (editing) return adminApi.put(`/admin/events/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return adminApi.post('/admin/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { invalidate(); closeForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/admin/events/${id}`),
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const toLocal = (iso) => iso ? iso.replace('Z', '').slice(0, 16) : '';

  const openEdit = (e) => {
    setEditing(e);
    setValue('title', e.title); setValue('shortDescription', e.shortDescription || ''); setValue('fullDescription', e.fullDescription || '');
    setValue('startDateTime', toLocal(e.startDateTime)); setValue('endDateTime', toLocal(e.endDateTime || ''));
    setValue('venue', e.venue || ''); setValue('status', e.status); setValue('agenda', e.agenda || '');
    setValue('speakers', e.speakers || ''); setValue('registrationLink', e.registrationLink || '');
    setValue('contactDetails', e.contactDetails || ''); setValue('isPublished', e.isPublished);
    setShowForm(true);
  };

  const closeForm = () => { setEditing(null); setShowForm(false); setCoverFile(null); reset({ status: 'UPCOMING', isPublished: false }); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Events</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2">
          <Plus size={15} /> Add Event
        </button>
      </div>

      <div className="bg-white border border-idea-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-idea-ivory border-b border-idea-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Event</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted hidden md:table-cell">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Published</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-idea-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-idea-border">
            {isLoading ? Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}><td colSpan={5} className="px-4 py-3 animate-pulse"><div className="h-3 bg-gray-100 rounded w-1/2" /></td></tr>
            )) : data?.data.map(e => (
              <tr key={e.id} className="hover:bg-idea-ivory/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {e.coverImageUrl && <img src={e.coverImageUrl} alt="" className="w-10 h-8 object-cover rounded flex-shrink-0" />}
                    <p className="font-medium text-idea-navy line-clamp-1">{e.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-idea-muted hidden md:table-cell text-xs">{new Date(e.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[e.status]}`}>{e.status}</span></td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs ${e.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{e.isPublished ? 'Yes' : 'Draft'}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(e)} className="p-1.5 text-idea-muted hover:text-idea-navy border border-transparent hover:border-idea-border rounded"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(e.id)} className="p-1.5 text-idea-muted hover:text-red-600 border border-transparent hover:border-red-200 rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && data?.data.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-idea-muted">No events found.</td></tr>}
          </tbody>
        </table>
        {data && data.meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 px-4 py-3 border-t border-idea-border">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs border border-idea-border rounded disabled:opacity-40">← Prev</button>
            <span className="px-3 py-1.5 text-xs text-idea-muted">Page {page}/{data.meta.totalPages}</span>
            <button disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs border border-idea-border rounded disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-idea-navy">{editing ? 'Edit' : 'Add'} Event</h2>
              <button onClick={closeForm}><X size={18} className="text-idea-muted" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Title *</label>
                <input {...register('title', { required: true })} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                {errors.title && <p className="text-red-500 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Short Description</label>
                <textarea {...register('shortDescription')} rows={2} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Full Description</label>
                <textarea {...register('fullDescription')} rows={4} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Start Date &amp; Time *</label>
                  <input {...register('startDateTime', { required: true })} type="datetime-local" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                  {errors.startDateTime && <p className="text-red-500 text-xs mt-1">Required</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">End Date &amp; Time</label>
                  <input {...register('endDateTime')} type="datetime-local" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Venue</label>
                  <input {...register('venue')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Status</label>
                  <select {...register('status')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy">
                    <option value="UPCOMING">Upcoming</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="POSTPONED">Postponed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Agenda</label>
                <textarea {...register('agenda')} rows={3} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Speakers</label>
                  <input {...register('speakers')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">Registration Link</label>
                  <input {...register('registrationLink')} type="url" className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Contact Details</label>
                <input {...register('contactDetails')} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Cover Image (Max 10MB)</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="w-full text-sm text-idea-muted file:mr-3 file:py-1.5 file:px-3 file:border file:border-idea-border file:rounded file:text-xs file:bg-white file:cursor-pointer" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('isPublished')} type="checkbox" className="w-4 h-4 accent-idea-navy" />
                <span className="text-sm text-idea-navy">Published (visible to public)</span>
              </label>
              {saveMutation.isError && <p className="text-red-500 text-sm">Error saving. Please try again.</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 py-2.5 bg-idea-navy text-white text-sm font-semibold rounded disabled:opacity-60">
                  {saveMutation.isPending ? 'Saving…' : editing ? 'Update Event' : 'Create Event'}
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
            <h3 className="font-heading font-bold text-idea-navy mb-2">Delete Event?</h3>
            <p className="text-idea-muted text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="flex-1 py-2 bg-red-600 text-white text-sm font-semibold rounded disabled:opacity-60">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-idea-border rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
