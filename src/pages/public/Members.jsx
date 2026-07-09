import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { Search } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className={props.className} style={props.style} width={props.size || 24} height={props.size || 24}>
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L32 503l138.2-36.2c32.5 17.7 68.9 27 106.1 27 122.4 0 222-99.6 222-222 0-59.3-23-115.1-64.9-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-81.8 21.4 21.8-79.7-4.4-7c-18.4-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.4 0 101.7-82.9 184.5-184.6 184.5zm100.5-137.5c-5.5-2.7-32.6-16.1-37.7-18-5.1-1.9-8.8-2.7-12.5 2.7-3.7 5.5-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.7-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.5-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.3 5.7 23.6 9.2 31.7 11.8 13.4 4.3 25.6 3.7 35.3 2.2 10.8-1.6 32.6-13.3 37.2-26.2 4.6-12.9 4.6-24 3.2-26.2-1.3-2.2-5-3.5-10.5-6.2z"/>
  </svg>
);

export default function Members() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chapterId = searchParams.get('chapterId') || '';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  // Fetch chapters list
  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters'],
    queryFn: async () => (await publicApi.get('/public/chapters')).data.data
  });

  // Fetch active Head Table members filtered by chapterId
  const { data: heads = [], isLoading: isHeadLoading } = useQuery({
    queryKey: ['head-table', chapterId],
    queryFn: async () => {
      const url = chapterId ? `/public/head-table?chapterId=${chapterId}` : '/public/head-table';
      return (await publicApi.get(url)).data.data;
    }
  });

  // Fetch active Coordinator members filtered by chapterId
  const { data: coordinators = [], isLoading: isCoordLoading } = useQuery({
    queryKey: ['coordinators', chapterId],
    queryFn: async () => {
      const url = chapterId ? `/public/coordinators?chapterId=${chapterId}` : '/public/coordinators';
      return (await publicApi.get(url)).data.data;
    }
  });

  // Fetch paginated directory members filtered by chapterId
  const { data, isLoading } = useQuery({
    queryKey: ['members', page, search, category, chapterId],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '12' });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (chapterId) params.set('chapterId', chapterId);
      const res = await publicApi.get(`/public/members?${params}`);
      return res.data;
    },
    placeholderData: prev => prev,
  });

  const categories = ['Technology', 'Finance', 'Healthcare', 'Real Estate', 'Education', 'Manufacturing', 'Retail', 'Food & Beverage', 'Legal', 'Marketing'];
  const handleSearch = (e) => { e.preventDefault(); setPage(1); };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-idea-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
          {(() => {
            const selectedChapter = chapters.find(c => String(c.id) === String(chapterId));
            if (selectedChapter) {
              return (
                <>
                  {selectedChapter.logoUrl ? (
                    <img src={selectedChapter.logoUrl} alt={selectedChapter.name} className="h-32 w-auto object-contain mb-6 bg-white p-3 rounded-2xl shadow-md" />
                  ) : (
                    <div className="h-16 w-16 bg-idea-gold text-idea-navy font-bold rounded-2xl flex items-center justify-center text-2xl mb-4">
                      {selectedChapter.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <h1 className="font-heading text-4xl md:text-5xl font-bold">Welcome to IDEA {selectedChapter.name} Chapter</h1>
                  <p className="mt-4 text-white/70 max-w-xl mx-auto">Your Business Is Our Business</p>
                </>
              );
            }
            return (
              <>
                <h1 className="font-heading text-4xl md:text-5xl font-bold">Our Members</h1>
                <p className="mt-4 text-white/70 max-w-xl mx-auto">Connect with professionals and entrepreneurs across diverse industries.</p>
              </>
            );
          })()}
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
            <select value={chapterId} onChange={e => { setSearchParams({ chapterId: e.target.value }); setPage(1); }} className="py-2.5 px-3 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy text-idea-muted min-w-[180px]">
              <option value="">All Chapters</option>
              {chapters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
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
                      <div className="flex gap-4 items-center">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading font-bold text-black text-base group-hover:text-idea-navy transition-colors duration-300 leading-snug truncate" title={m.fullName}>{m.fullName}</h3>
                          {m.businessName && <p className="text-idea-muted text-[10px] font-semibold uppercase tracking-wider mt-1 truncate" title={m.businessName}>{m.businessName}</p>}
                        </div>
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
                      <div className="flex gap-2 items-center">
                        {m.whatsappNumber && (
                          <a 
                            href={`https://wa.me/${m.whatsappNumber.replace(/\D/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()} 
                            className="bg-green-50 text-[#25D366] hover:bg-[#25D366] hover:text-white p-2 rounded-lg border border-green-200 transition-all duration-300 flex items-center justify-center"
                            title="Contact on WhatsApp"
                          >
                            <WhatsAppIcon size={14} />
                          </a>
                        )}
                        {m.youtubeUrl && (
                          <a 
                            href={m.youtubeUrl.split(',')[0].trim()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()} 
                            className="bg-red-50 text-[#FF0000] hover:bg-[#FF0000] hover:text-white p-2 rounded-lg border border-red-200 transition-all duration-300 flex items-center justify-center"
                            title="Watch YouTube Video"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                          </a>
                        )}
                        <div className="bg-idea-navy/[0.03] text-idea-navy group-hover:bg-idea-navy group-hover:text-white p-2 rounded-lg transition-all duration-300 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </div>
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
