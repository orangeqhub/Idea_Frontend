import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { Search } from 'lucide-react';

export default function Members() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  // Fetch active Head Table members
  const { data: heads = [], isLoading: isHeadLoading } = useQuery({
    queryKey: ['head-table'],
    queryFn: async () => (await publicApi.get('/api/public/head-table')).data.data
  });

  // Fetch active Coordinator members
  const { data: coordinators = [], isLoading: isCoordLoading } = useQuery({
    queryKey: ['coordinators'],
    queryFn: async () => (await publicApi.get('/api/public/coordinators')).data.data
  });

  // Fetch paginated directory members
  const { data, isLoading } = useQuery({
    queryKey: ['members', page, search, category],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '12' });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const res = await publicApi.get(`/api/public/members?${params}`);
      return res.data;
    },
    placeholderData: prev => prev,
  });

  const categories = ['Technology', 'Finance', 'Healthcare', 'Real Estate', 'Education', 'Manufacturing', 'Retail', 'Food & Beverage', 'Legal', 'Marketing'];
  const handleSearch = (e) => { e.preventDefault(); setPage(1); };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-idea-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Our Members</h1>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">Connect with professionals and entrepreneurs across diverse industries.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Leadership Team (Head Table) Section */}
        {!isHeadLoading && heads.length > 0 && (
          <div>
            <div className="border-b border-idea-border pb-4 mb-8">
              <h2 className="font-heading text-2xl font-bold text-idea-navy">Leadership Team</h2>
              <p className="text-idea-muted text-sm mt-1">Meet the executive committee guiding IDEA Guntur.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {heads.map(m => (
                <Link key={m.id} to={`/members/${m.slug}`} className="group text-center block">
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 border border-idea-border shadow-theme-card group-hover:shadow-theme-card-hover group-hover:border-idea-gold group-hover:-translate-y-1 transition-all duration-300">
                    <img src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&size=200&background=0B1220&color=C8A96B`} alt={m.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <h3 className="font-heading font-bold text-black text-lg group-hover:text-idea-navy transition-colors duration-300 leading-snug">{m.fullName}</h3>
                  <p className="text-idea-gold text-xs font-semibold uppercase tracking-wider mt-1.5">{m.designation}</p>
                  <p className="text-idea-muted text-sm font-medium mt-0.5">{m.businessName}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Coordinators Section */}
        {!isCoordLoading && coordinators.length > 0 && (
          <div>
            <div className="border-b border-idea-border pb-4 mb-8">
              <h2 className="font-heading text-2xl font-bold text-idea-navy">Chapter Coordinators</h2>
              <p className="text-idea-muted text-sm mt-1">Dedicated members managing our chapter events and operations.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {coordinators.map(m => (
                <Link key={m.id} to={`/members/${m.slug}`} className="group text-center block">
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 border border-idea-border shadow-theme-card group-hover:shadow-theme-card-hover group-hover:border-idea-gold group-hover:-translate-y-1 transition-all duration-300">
                    <img src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&size=200&background=0B1220&color=C8A96B`} alt={m.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <h3 className="font-heading font-bold text-black text-lg group-hover:text-idea-navy transition-colors duration-300 leading-snug">{m.fullName}</h3>
                  <p className="text-idea-gold text-xs font-semibold uppercase tracking-wider mt-1.5">{m.designation}</p>
                  <p className="text-idea-muted text-sm font-medium mt-0.5">{m.businessName}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Directory Members (without photo) Section */}
        <div>
          <div className="border-b border-idea-border pb-4 mb-6">
            <h2 className="font-heading text-2xl font-bold text-idea-navy">Members Directory</h2>
            <p className="text-idea-muted text-sm mt-1">Search and connect with all active business network members.</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-idea-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members, businesses…" className="w-full pl-10 pr-4 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
            </div>
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="py-2.5 px-3 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy text-idea-muted min-w-[180px]">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" className="px-5 py-2.5 bg-idea-navy text-white text-sm font-semibold rounded hover:bg-idea-navy-2 transition-colors">Search</button>
          </form>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-idea-border rounded-2xl p-4 min-h-[220px] flex flex-col justify-between">
                  <div className="bg-gray-100 rounded-xl p-4 flex-1 mb-4" />
                  <div className="h-6 bg-gray-100 rounded w-1/3 mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {data?.meta && <p className="text-sm text-idea-muted mb-4">{data.meta.total} member{data.meta.total !== 1 ? 's' : ''} found</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data?.data.map(m => (
                  <Link key={m.id} to={`/members/${m.slug}`} className="group bg-white rounded-2xl border border-idea-border shadow-theme-card hover:shadow-theme-card-hover hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col justify-between min-h-[220px]">
                    <div className="bg-idea-navy/[0.03] rounded-xl p-4 flex-1 mb-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading font-bold text-black text-lg group-hover:text-idea-navy transition-colors duration-300 leading-snug">{m.fullName}</h3>
                        {m.businessName && <p className="text-idea-muted text-xs font-semibold uppercase tracking-wider mt-1.5">{m.businessName}</p>}
                      </div>
                      {m.businessCategory && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="text-[10px] bg-idea-navy/[0.06] text-idea-navy font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            {m.businessCategory}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="font-heading font-bold text-black text-sm group-hover:text-idea-navy transition-colors duration-300">View Profile</span>
                      <div className="bg-idea-navy/[0.03] text-idea-navy group-hover:bg-idea-navy group-hover:text-white p-2 rounded-lg transition-all duration-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {data && data.meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-sm border border-idea-border rounded hover:border-idea-navy disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
                  <span className="px-4 py-2 text-sm text-idea-muted">Page {data.meta.page} of {data.meta.totalPages}</span>
                  <button disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-sm border border-idea-border rounded hover:border-idea-navy disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
                </div>
              )}
              {data?.data.length === 0 && (
                <div className="text-center py-20 text-idea-muted">
                  <p className="text-lg font-medium">No members found</p>
                  <button onClick={() => { setSearch(''); setCategory(''); setPage(1); }} className="mt-4 text-sm text-idea-navy underline">Clear filters</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
