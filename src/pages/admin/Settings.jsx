import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { useState } from 'react';

const SETTINGS_FIELDS = [
  { section: 'Contact', fields: [
    { key: 'contact.phone', label: 'Phone' },
    { key: 'contact.email', label: 'Email' },
    { key: 'contact.address', label: 'Address', textarea: true },
    { key: 'contact.hours', label: 'Office Hours' },
  ]},
  { section: 'Social Media', fields: [
    { key: 'social.linkedin', label: 'LinkedIn URL' },
    { key: 'social.instagram', label: 'Instagram URL' },
    { key: 'social.facebook', label: 'Facebook URL' },
    { key: 'social.twitter', label: 'Twitter/X URL' },
  ]},
  { section: 'Site', fields: [
    { key: 'site.name', label: 'Site Name' },
    { key: 'site.footer.description', label: 'Footer Description', textarea: true },
    { key: 'stats.members', label: 'Members Count Display' },
  ]},
];

export default function AdminSettings() {
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => (await adminApi.get('/api/admin/settings')).data.data,
  });

  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (updates) => adminApi.put('/api/admin/settings', { updates }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] }); qc.invalidateQueries({ queryKey: ['admin', 'settings'] });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading) return <div className="text-idea-muted text-sm animate-pulse">Loading settings…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Settings</h1>
        {saved && <span className="text-green-600 text-sm font-medium">✓ Saved</span>}
      </div>

      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-8 max-w-2xl">
        {SETTINGS_FIELDS.map(({ section, fields }) => (
          <div key={section}>
            <h2 className="font-heading font-semibold text-idea-navy mb-4 pb-2 border-b border-idea-border">{section}</h2>
            <div className="space-y-4">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-idea-navy mb-1 block">{f.label}</label>
                  {f.textarea ? (
                    <textarea {...register(f.key)} defaultValue={data?.[f.key] || ''} rows={2} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" />
                  ) : (
                    <input {...register(f.key)} defaultValue={data?.[f.key] || ''} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {mutation.isError && <p className="text-red-500 text-sm">Error saving. Please try again.</p>}
        <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 disabled:opacity-60">
          {mutation.isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
