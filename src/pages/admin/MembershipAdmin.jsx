import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/publicApi';
import { LogIn, LogOut, Search, Eye, X, Users, CalendarDays } from 'lucide-react';
import logo from '@/assets/idea-logo.png';

const TOKEN_KEY   = 'membership_admin_token';
const STATIC_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001').replace(/\/api$/, '');

function getToken()   { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } }
function setToken(t)  { try { localStorage.setItem(TOKEN_KEY, t); } catch {} }
function clearToken() { try { localStorage.removeItem(TOKEN_KEY); } catch {} }
function authHdr()    { const t = getToken(); return t ? { Authorization: `Bearer ${t}` } : {}; }

const inputCls = 'w-full px-3.5 py-2.5 border border-idea-border rounded-md text-sm focus:outline-none focus:border-idea-navy focus:ring-1 focus:ring-idea-navy/20 bg-white placeholder:text-idea-muted/60 transition-colors';

/* ── Login ─────────────────────────────────── */
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [err,   setErr]   = useState('');
  const [busy,  setBusy]  = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const res = await publicApi.post('/membership/admin/login', { email, password: pass });
      setToken(res.data.token);
      onLogin();
    } catch {
      setErr('Incorrect email or password. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-idea-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="IDEA International"
            className="h-24 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="font-heading text-3xl font-bold text-idea-navy">Admin Access</h1>
          <p className="text-idea-muted mt-1 text-sm">Sign in to manage membership applications</p>
        </div>
        <div className="bg-white rounded-xl border border-idea-border shadow-theme-card p-8">
          {err && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-md mb-4">{err}</p>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-idea-navy/70 uppercase tracking-wide mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@ideamembership.com" className={inputCls} required autoComplete="username" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-idea-navy/70 uppercase tracking-wide mb-1.5">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••••" className={inputCls} required autoComplete="current-password" />
            </div>
            <button type="submit" disabled={busy} className="w-full py-3 bg-idea-navy text-white font-semibold rounded-md hover:bg-idea-navy-2 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm mt-2">
              <LogIn size={16} /> {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Detail Modal ───────────────────────────── */
function DetailModal({ member, onClose }) {
  const dob = member.dateOfBirth
    ? new Date(member.dateOfBirth + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';
  const submitted = member.createdAt
    ? new Date(member.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

  const fields = [
    ['Full Name',         member.fullName],
    ['Date of Birth',     dob],
    ['Email Address',     member.email],
    ['Mobile Number',     member.mobile],
    ['Application Ref',   member.refId],
    ['Submitted On',      submitted],
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-idea-border sticky top-0 bg-white z-10">
          <h2 className="font-heading text-xl font-bold text-idea-navy flex-1">{member.fullName}</h2>
          <button onClick={onClose} className="text-idea-muted hover:text-idea-navy transition-colors p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Core fields */}
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {fields.map(([l, v]) => (
              <div key={l}>
                <p className="text-xs font-semibold text-idea-muted uppercase tracking-wide">{l}</p>
                <p className="text-sm text-idea-navy mt-0.5">{v || '—'}</p>
              </div>
            ))}

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-idea-muted uppercase tracking-wide">Business Name</p>
              <p className="text-sm text-idea-navy mt-0.5">{member.businessName || '—'}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-idea-muted uppercase tracking-wide">Products &amp; Services</p>
              <p className="text-sm text-idea-navy mt-0.5 whitespace-pre-wrap">{member.products || '—'}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-idea-muted uppercase tracking-wide">Address</p>
              <p className="text-sm text-idea-navy mt-0.5 whitespace-pre-wrap">{member.address || '—'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-idea-muted uppercase tracking-wide">Referred By</p>
              <p className="text-sm text-idea-navy mt-0.5">{member.referredBy || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-idea-muted uppercase tracking-wide">Referral Mobile</p>
              <p className="text-sm text-idea-navy mt-0.5">{member.referralMobile || 'Not provided'}</p>
            </div>
          </div>

          {/* Attachments */}
          {(member.firmLogoUrl || member.memberPhotoUrl) && (
            <div className="flex gap-6 pt-4 border-t border-idea-border/60">
              {member.firmLogoUrl && (
                <div>
                  <p className="text-xs font-semibold text-idea-muted uppercase tracking-wide mb-2">Firm Logo</p>
                  <img
                    src={`${STATIC_BASE}${member.firmLogoUrl}`}
                    alt="Firm Logo"
                    className="w-20 h-20 object-cover rounded-lg border border-idea-border"
                  />
                </div>
              )}
              {member.memberPhotoUrl && (
                <div>
                  <p className="text-xs font-semibold text-idea-muted uppercase tracking-wide mb-2">Photograph</p>
                  <img
                    src={`${STATIC_BASE}${member.memberPhotoUrl}`}
                    alt="Photograph"
                    className="w-20 h-20 object-cover rounded-full border border-idea-border"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-idea-border/60">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm bg-idea-navy text-white rounded-md font-medium hover:bg-idea-navy-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ──────────────────────────────── */
function Dashboard({ onLogout }) {
  const [search, setSearch]           = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [selected, setSelected]       = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['membership-applications', debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({ pageSize: 200 });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await publicApi.get(`/membership/admin/applications?${params}`, { headers: authHdr() });
      return res.data;
    },
    retry: false,
    onError: err => {
      if (err?.response?.status === 401) { clearToken(); onLogout(); }
    },
  });

  const applications = data?.data ?? [];
  const total        = data?.total ?? 0;
  const todayStr     = new Date().toISOString().slice(0, 10);
  const todayCount   = applications.filter(a => a.createdAt?.slice(0, 10) === todayStr).length;
  const weekAgo      = new Date(Date.now() - 7 * 86400000).toISOString();
  const weekCount    = applications.filter(a => a.createdAt >= weekAgo).length;

  return (
    <div className="min-h-screen bg-idea-ivory">
      {/* Header */}
      <div className="bg-idea-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-white">Membership Applications</h1>
            <p className="text-white/60 text-xs mt-0.5">IDEA Guntur — Admin Dashboard</p>
          </div>
          <div className="flex-1" />
          <button onClick={onLogout} className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Applications', value: isLoading ? '—' : total,      icon: Users,        color: 'text-idea-navy' },
            { label: 'Submitted Today',    value: isLoading ? '—' : todayCount,  icon: CalendarDays, color: 'text-idea-gold' },
            { label: 'This Week',          value: isLoading ? '—' : weekCount,   icon: CalendarDays, color: 'text-idea-navy' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-idea-border shadow-theme-card p-4">
              <div className="flex items-center gap-3">
                <Icon size={20} className={color} />
                <div>
                  <p className="text-2xl font-bold text-idea-navy">{value}</p>
                  <p className="text-xs text-idea-muted mt-0.5">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-idea-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, business, mobile or email…"
            className="w-full pl-8 pr-3.5 py-2 border border-idea-border rounded-md text-sm focus:outline-none focus:border-idea-navy bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-idea-border shadow-theme-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-idea-muted">
              <div className="w-5 h-5 border-2 border-idea-gold border-t-transparent rounded-full animate-spin" />
              Loading applications…
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-red-500 text-sm">Failed to load applications. Please refresh.</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <Users size={36} className="mx-auto mb-3 text-idea-muted/40" />
              <p className="font-semibold text-idea-navy">{search ? 'No results found' : 'No applications yet'}</p>
              <p className="text-sm text-idea-muted mt-1">{search ? 'Try a different search term.' : 'Submitted applications will appear here.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-idea-ivory border-b border-idea-border">
                    {['Ref No', 'Full Name', 'Business Name', 'Mobile', 'Email', 'Submitted On', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-idea-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} className="border-b border-idea-border/60 hover:bg-idea-ivory/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-idea-navy">{app.refId}</td>
                      <td className="px-4 py-3 font-semibold text-idea-navy whitespace-nowrap">{app.fullName}</td>
                      <td className="px-4 py-3 text-idea-muted">{app.businessName}</td>
                      <td className="px-4 py-3 text-idea-navy whitespace-nowrap">{app.mobile}</td>
                      <td className="px-4 py-3 text-idea-muted">{app.email}</td>
                      <td className="px-4 py-3 text-idea-muted whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(app)}
                          className="flex items-center gap-1 text-xs text-idea-navy border border-idea-border rounded px-2.5 py-1 hover:bg-idea-ivory transition-colors font-medium"
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && <DetailModal member={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ── Root ───────────────────────────────────── */
export default function MembershipAdmin() {
  const [loggedIn, setLoggedIn] = useState(() => !!getToken());
  if (!loggedIn) return <LoginForm onLogin={() => setLoggedIn(true)} />;
  return <Dashboard onLogout={() => { clearToken(); setLoggedIn(false); }} />;
}
