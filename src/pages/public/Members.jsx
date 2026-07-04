import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { Search } from 'lucide-react';

export default function Members() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-lg aspect-square mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {data?.meta && <p className="text-sm text-idea-muted mb-4">{data.meta.total} member{data.meta.total !== 1 ? 's' : ''} found</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {data?.data.map(m => (
                <Link key={m.id} to={`/members/${m.slug}`} className="group border border-idea-border rounded-lg overflow-hidden hover:shadow-md hover:border-idea-gold transition-all">
                  <div className="relative overflow-hidden aspect-square">
                    <img src={m.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&size=300&background=0B1220&color=C8A96B`} alt={m.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    {m.isFeatured && <span className="absolute top-2 right-2 bg-idea-gold text-white text-xs font-bold px-2 py-0.5 rounded">Featured</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-idea-navy text-sm">{m.fullName}</h3>
                    {m.businessName && <p className="text-idea-muted text-xs mt-0.5">{m.businessName}</p>}
                    {m.businessCategory && <span className="inline-block mt-2 text-xs bg-idea-ivory text-idea-navy px-2 py-0.5 rounded-full">{m.businessCategory}</span>}
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
  );
}
