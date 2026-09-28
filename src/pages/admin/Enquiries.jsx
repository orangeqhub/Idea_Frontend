import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { X, ChevronDown } from 'lucide-react';

const STATUS_OPTS = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED', 'ARCHIVED'];
const STATUS_COLOR = {
  NEW: 'bg-red-100 text-red-700', CONTACTED: 'bg-blue-100 text-blue-700',
  FOLLOW_UP: 'bg-yellow-100 text-yellow-700', CONVERTED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600', ARCHIVED: 'bg-gray-100 text-gray-400',
};

export default function AdminEnquiries() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'enquiries', page, typeFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (typeFilter) params.set('type', typeFilter);
      if (statusFilter) params.set('status', statusFilter);
      return (await adminApi.get(`/admin/enquiries?${params}`)).data;
    },
    placeholderData: prev => prev,
  });

  const { register, handleSubmit } = useForm();

  const invalidate = () => { qc.invalidateQueries({ queryKey: ['admin', 'enquiries'] }); qc.invalidateQueries({ queryKey: ['admin', 'overview'] }); };

  const updateMutation = useMutation({
    mutationFn: ({ id, d }) => adminApi.patch(`/admin/enquiries/${id}`, d),
    onSuccess: (res) => { invalidate(); setSelected(res.data.data); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/admin/enquiries/${id}`),
    onSuccess: () => { invalidate(); setSelected(null); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Enquiries</h1>
        {data?.meta && <span className="text-sm text-idea-muted">{data.meta.total} total</span>}
      </div>

      <div className="flex gap-3 mb-4">
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy text-idea-muted">
          <option value="">All Types</option>
          <option value="MEMBERSHIP">Membership</option>
          <option value="CONTACT">Contact</option>
        </select>
        <div className="relative">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="appearance-none px-3 pr-8 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy text-idea-muted">
            <option value="">All Statuses</option>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-idea-muted pointer-events-none" />
        </div>
      </div>

      <div className="bg-white border border-idea-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-idea-ivory border-b border-idea-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted hidden md:table-cell">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-idea-muted hidden lg:table-cell">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-idea-muted">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-idea-border">
            {isLoading ? Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}><td colSpan={6} className="px-4 py-3 animate-pulse"><div className="h-3 bg-gray-100 rounded w-1/2" /></td></tr>
            )) : data?.data.map(e => (
              <tr key={e.id} className="hover:bg-idea-ivory/30 cursor-pointer" onClick={() => setSelected(e)}>
                <td className="px-4 py-3">
                  <p className="font-medium text-idea-navy">{e.fullName}</p>
                  {e.businessName && <p className="text-xs text-idea-muted">{e.businessName}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs bg-idea-ivory px-2 py-0.5 rounded">{e.enquiryType}</span></td>
                <td className="px-4 py-3 text-idea-muted text-xs hidden md:table-cell">{e.phone || e.email || '—'}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[e.status]}`}>{e.status}</span></td>
                <td className="px-4 py-3 text-xs text-idea-muted hidden lg:table-cell">{new Date(e.submittedAt).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 text-right"><button className="text-xs text-idea-navy underline">View</button></td>
              </tr>
            ))}
            {!isLoading && data?.data.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-idea-muted">No enquiries found.</td></tr>}
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

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-lg mt-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-idea-navy">Enquiry Details</h2>
              <button onClick={() => setSelected(null)}><X size={18} className="text-idea-muted" /></button>
            </div>
            <div className="space-y-2 text-sm mb-6">
              <div className="grid grid-cols-2 gap-2">
                {[['Name', selected.fullName], ['Type', selected.enquiryType], ['Phone', selected.phone], ['Email', selected.email], ['Business', selected.businessName], ['Category', selected.businessCategory], ['City', selected.city], ['Preferred Contact', selected.preferredContact]].filter(([, v]) => v).map(([l, v]) => (
                  <div key={l}><p className="text-xs text-idea-muted">{l}</p><p className="font-medium text-idea-navy">{v}</p></div>
                ))}
              </div>
              {selected.subject && <div><p className="text-xs text-idea-muted mt-2">Subject</p><p className="text-idea-navy">{selected.subject}</p></div>}
              {selected.message && <div><p className="text-xs text-idea-muted mt-2">Message</p><p className="text-idea-muted leading-relaxed">{selected.message}</p></div>}
              <p className="text-xs text-idea-muted mt-2">Submitted: {new Date(selected.submittedAt).toLocaleString('en-IN')}</p>
            </div>

            <form onSubmit={handleSubmit(d => updateMutation.mutate({ id: selected.id, d }))} className="space-y-4 pt-4 border-t border-idea-border">
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Status</label>
                <select {...register('status')} defaultValue={selected.status} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy">
                  {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-idea-navy mb-1 block">Internal Notes</label>
                <textarea {...register('internalNotes')} defaultValue={selected.internalNotes || ''} rows={3} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={updateMutation.isPending} className="flex-1 py-2 bg-idea-navy text-white text-sm font-semibold rounded disabled:opacity-60">
                  {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => { if (confirm('Delete this enquiry?')) deleteMutation.mutate(selected.id); }} className="px-4 py-2 border border-red-200 text-red-600 text-sm rounded hover:bg-red-50">Delete</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
