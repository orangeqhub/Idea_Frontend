import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '../../services/adminApi';
import { useState, useEffect } from 'react';

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
  const [carouselUrls, setCarouselUrls] = useState(['']);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'content'],
    queryFn: async () => (await adminApi.get('/admin/content')).data.data,
  });

  useEffect(() => {
    if (data?.['hero.carousel']) {
      setCarouselUrls(data['hero.carousel'].split(',').map(url => url.trim()));
    } else {
      setCarouselUrls(['']);
    }
  }, [data]);

  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (updates) => adminApi.put('/admin/content', { updates }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['content'] }); qc.invalidateQueries({ queryKey: ['admin', 'content'] }); setSaved(true); setTimeout(() => setSaved(false), 3000); },
  });

  const onSaveSubmit = (d) => {
    d['hero.carousel'] = carouselUrls.filter(u => u.trim() !== '').join(',');
    mutation.mutate(d);
  };

  if (isLoading) return <div className="text-idea-muted text-sm animate-pulse">Loading content…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-idea-navy">Website Content</h1>
        {saved && <span className="text-green-600 text-sm font-medium">✓ Saved</span>}
      </div>

      <form onSubmit={handleSubmit(onSaveSubmit)} className="space-y-5 max-w-2xl">
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

        <div className="border border-idea-border/60 rounded-lg p-4 bg-idea-navy/[0.01]">
          <label className="text-xs font-semibold text-idea-navy mb-2 block flex justify-between items-center">
            <span>Hero Carousel Images</span>
            <button type="button" onClick={() => setCarouselUrls([...carouselUrls, ''])} className="text-[10px] bg-idea-navy text-white px-2 py-0.5 rounded hover:bg-idea-gold hover:text-idea-navy font-bold uppercase tracking-wider transition-colors duration-200">
              + Add Image URL
            </button>
          </label>
          <div className="space-y-2">
            {carouselUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input 
                  value={url} 
                  onChange={e => {
                    const copy = [...carouselUrls];
                    copy[idx] = e.target.value;
                    setCarouselUrls(copy);
                  }}
                  placeholder="https://images.unsplash.com/... or /uploads/..." 
                  className="flex-1 px-3 py-2 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" 
                />
                <label className="cursor-pointer bg-idea-navy/[0.04] border border-idea-border hover:bg-idea-navy hover:text-white px-3 py-2 rounded text-xs font-semibold transition-all duration-200 flex-shrink-0 flex items-center gap-1">
                  <span>Upload</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const fd = new FormData();
                      fd.append('file', file);
                      
                      try {
                        const response = await adminApi.post('/admin/media', fd, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        if (response.data?.success && response.data?.data?.url) {
                          const copy = [...carouselUrls];
                          copy[idx] = response.data.data.url;
                          setCarouselUrls(copy);
                        }
                      } catch (err) {
                        console.error('File upload failed', err);
                        alert('Upload failed. Please try again.');
                      }
                    }}
                  />
                </label>
                {carouselUrls.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setCarouselUrls(carouselUrls.filter((_, i) => i !== idx))} 
                    className="px-3 py-2 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 text-xs border border-idea-border rounded transition-all duration-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {mutation.isError && <p className="text-red-500 text-sm">Error saving. Please try again.</p>}
        <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 disabled:opacity-60">
          {mutation.isPending ? 'Saving…' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
}
