import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '@/assets/idea-guntur-rocket-logo.jpg';
import { LayoutDashboard, Users, CalendarDays, MessageSquare, FileText, Settings, LogOut, Menu, X, Home, TableProperties } from 'lucide-react';
import { useAuth, useLogout } from '../hooks/useAuth';
import { useCsrf } from '../hooks/useCsrf';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Head Table', to: '/admin/head-table', icon: TableProperties },
  { label: 'Members', to: '/admin/members', icon: Users },
  { label: 'Events', to: '/admin/events', icon: CalendarDays },
  { label: 'Enquiries', to: '/admin/enquiries', icon: MessageSquare },
  { label: 'Content', to: '/admin/content', icon: FileText },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { data: auth, isLoading } = useAuth();
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useCsrf();

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-idea-muted">Loading…</div>;
  if (!auth) return <Navigate to="/admin/login" replace />;

  const Sidebar = () => (
    <aside className="w-64 bg-idea-navy text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="IDEA Guntur Rocket" className="h-14 w-auto object-contain" />
          <span className="font-heading text-xl font-bold text-white">IDEA</span>
        </div>
        <p className="text-white/50 text-xs mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${isActive ? 'bg-white/15 text-white font-medium' : 'text-white/65 hover:text-white hover:bg-white/10'}`}>
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/50 mb-3">
          <p className="font-medium text-white/70">{auth.name}</p>
          <p>{auth.email}</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-white/60 hover:text-white border border-white/20 rounded transition-colors">
            <Home size={12} /> Site
          </a>
          <button onClick={() => logout.mutate()} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-white/60 hover:text-white border border-white/20 rounded transition-colors">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex"><Sidebar /></div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex"><Sidebar /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden bg-white border-b border-idea-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-idea-navy"><Menu size={20} /></button>
          <span className="font-heading font-bold text-idea-navy">IDEA Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1 text-idea-navy"><X size={20} /></button>
        </div>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
