import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Upcoming', value: 'UPCOMING' },
];

const STATUS_STYLE = {
  UPCOMING: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
  POSTPONED: 'bg-yellow-100 text-yellow-800',
};

export default function Events() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['events', status, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '9' });
      if (status) params.set('status', status);
      const res = await publicApi.get(`/public/events?${params}`);
      return res.data;
    },
    placeholderData: prev => prev,
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-idea-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">IDEA Events</h1>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">Stay connected through our professional events, seminars, and programmes.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {STATUS_TABS.map(t => (
            <button key={t.value} onClick={() => { setStatus(t.value); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${status === t.value ? 'bg-idea-navy text-white' : 'bg-idea-ivory text-idea-navy hover:bg-idea-gold/10'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse border border-idea-border rounded-lg overflow-hidden">
                <div className="h-44 bg-gray-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {data?.meta && <p className="text-sm text-idea-muted mb-4">{data.meta.total} event{data.meta.total !== 1 ? 's' : ''}</p>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data.map(e => (
                <Link key={e.id} to={`/events/${e.slug}`} className="group border border-idea-border rounded-lg overflow-hidden hover:shadow-md hover:border-idea-gold transition-all">
                  <div className="relative h-44 overflow-hidden">
                    <img src={e.coverImageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=300&fit=crop'} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded ${STATUS_STYLE[e.status]}`}>{e.status}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-idea-navy text-base line-clamp-2">{e.title}</h3>
                    <div className="mt-2 text-xs text-idea-muted space-y-1">
                      <p>📅 {new Date(e.startDateTime).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      {e.venue && <p>📍 {e.venue}</p>}
                    </div>
                    {e.shortDescription && <p className="mt-2 text-sm text-idea-muted line-clamp-2">{e.shortDescription}</p>}
                    <span className="mt-3 inline-flex items-center text-xs font-semibold text-idea-navy border-b border-idea-navy group-hover:text-idea-gold group-hover:border-idea-gold transition-colors">Read More →</span>
                  </div>
                </Link>
              ))}
            </div>

            {data && data.meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-sm border border-idea-border rounded hover:border-idea-navy disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
                <span className="px-4 py-2 text-sm text-idea-muted">Page {page} of {data.meta.totalPages}</span>
                <button disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-sm border border-idea-border rounded hover:border-idea-navy disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
              </div>
            )}

            {data?.data.length === 0 && (
              <div className="text-center py-20 text-idea-muted">
                <p className="text-lg font-medium">No events found</p>
                <button onClick={() => { setStatus(''); setPage(1); }} className="mt-4 text-sm text-idea-navy underline">View all events</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
