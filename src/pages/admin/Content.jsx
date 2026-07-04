import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { useState } from 'react';

const CONTENT_FIELDS = [
  { key: 'hero.label', label: 'Hero Label', type: 'text' },
  { key: 'hero.heading', label: 'Hero Heading', type: 'text' },
  { key: 'hero.description', label: 'Hero Description', type: 'textarea' },
  { key: 'hero.cta1.label', label: 'Hero CTA 1 Label', type: 'text' },
  { key: 'hero.cta2.label', label: 'Hero CTA 2 Label', type: 'text' },
  { key: 'about.preview', label: 'About Preview (Home)', type: 'textarea' },
  { key: 'about.subtitle', label: 'About Page Subtitle', type: 'text' },
  { key: 'about.story1', label: 'About Story Para 1', type: 'textarea' },
  { key: 'about.story2', label: 'About Story Para 2', type: 'textarea' },
  { key: 'stats.members', label: 'Stats: Members', type: 'text' },
  { key: 'stats.categories', label: 'Stats: Categories', type: 'text' },
  { key: 'stats.events', label: 'Stats: Events', type: 'text' },
  { key: 'stats.years', label: 'Stats: Years Active', type: 'text' },
];

export default function AdminContent() {
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'content'],
    queryFn: async () => (await adminApi.get('/api/admin/content')).data.data,
  });

  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (updates) => adminApi.put('/api/admin/content', { updates }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['content'] }); qc.invalidateQueries({ queryKey: ['admin', 'content'] }); setSaved(true); setTimeout(() => setSaved(false), 3000); },
  });

  if (isLoading) return <div className="text-idea-muted text-sm animate-pulse">Loading content…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Website Content</h1>
        {saved && <span className="text-green-600 text-sm font-medium">✓ Saved</span>}
      </div>

      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5 max-w-2xl">
        {CONTENT_FIELDS.map(f => (
          <div key={f.key}>
            <label className="text-xs font-medium text-idea-navy mb-1 block">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea {...register(f.key)} defaultValue={data?.[f.key] || ''} rows={3} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-y" />
            ) : (
              <input {...register(f.key)} defaultValue={data?.[f.key] || ''} className="w-full px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
            )}
          </div>
        ))}
        {mutation.isError && <p className="text-red-500 text-sm">Error saving. Please try again.</p>}
        <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 disabled:opacity-60">
          {mutation.isPending ? 'Saving…' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
}
