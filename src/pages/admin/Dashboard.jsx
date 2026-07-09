import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { Users, CalendarDays, MessageSquare, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => (await adminApi.get('/admin/overview')).data.data,
  });

  const stats = [
    { label: 'Total Members', value: data?.totalMembers, sub: `${data?.activeMembers} active`, icon: Users, color: 'bg-blue-50 text-blue-600', to: '/admin/members' },
    { label: 'Events', value: data?.totalEvents, sub: `${data?.upcomingEvents} upcoming`, icon: CalendarDays, color: 'bg-green-50 text-green-600', to: '/admin/events' },
    { label: 'Enquiries', value: data?.totalEnquiries, sub: `${data?.newEnquiries} new`, icon: MessageSquare, color: 'bg-orange-50 text-orange-600', to: '/admin/enquiries' },
    { label: 'Featured Members', value: data?.featuredMembers, sub: 'on homepage', icon: TrendingUp, color: 'bg-purple-50 text-purple-600', to: '/admin/members' },
  ];

  const STATUS_COLOR = { NEW: 'bg-red-100 text-red-700', CONTACTED: 'bg-blue-100 text-blue-700', FOLLOW_UP: 'bg-yellow-100 text-yellow-700', CONVERTED: 'bg-green-100 text-green-700', CLOSED: 'bg-gray-100 text-gray-700', ARCHIVED: 'bg-gray-100 text-gray-500' };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-idea-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} to={s.to} className="bg-white p-5 rounded-lg border border-idea-border hover:border-idea-gold hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-idea-muted">{s.label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={15} />
              </div>
            </div>
            {isLoading ? <div className="h-7 bg-gray-100 rounded animate-pulse w-12" /> : <p className="font-heading text-2xl font-bold text-idea-navy">{s.value ?? '—'}</p>}
            <p className="text-xs text-idea-muted mt-1">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-idea-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-idea-border">
            <h2 className="font-heading font-semibold text-idea-navy">Recent Members</h2>
            <Link to="/admin/members" className="text-xs text-idea-navy underline">View All</Link>
          </div>
          <div className="divide-y divide-idea-border">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="px-5 py-3 animate-pulse"><div className="h-3 bg-gray-100 rounded w-1/2" /></div>) :
              data?.recentMembers.map(m => (
                <div key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-idea-navy">{m.fullName}</p>
                    {m.businessName && <p className="text-xs text-idea-muted">{m.businessName}</p>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{m.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-idea-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-idea-border">
            <h2 className="font-heading font-semibold text-idea-navy">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs text-idea-navy underline">View All</Link>
          </div>
          <div className="divide-y divide-idea-border">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="px-5 py-3 animate-pulse"><div className="h-3 bg-gray-100 rounded w-1/2" /></div>) :
              data?.recentEnquiries.map(e => (
                <div key={e.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-idea-navy">{e.fullName}</p>
                    <p className="text-xs text-idea-muted">{e.enquiryType}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[e.status] || 'bg-gray-100 text-gray-600'}`}>{e.status}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
