import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { publicApi } from '../../services/publicApi';
import { useState } from 'react';
import { ArrowRight, Users, Calendar, TrendingUp, Globe } from 'lucide-react';

export default function Home() {
  const { data: content } = useQuery({ queryKey: ['content'], queryFn: async () => (await publicApi.get('/api/public/content')).data.data, staleTime: 10 * 60 * 1000 });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: async () => (await publicApi.get('/api/public/settings')).data.data, staleTime: 10 * 60 * 1000 });
  const { data: headTable } = useQuery({ queryKey: ['head-table'], queryFn: async () => (await publicApi.get('/api/public/head-table')).data.data });
  const { data: eventsRes } = useQuery({ queryKey: ['events', 'home-preview'], queryFn: async () => (await publicApi.get('/api/public/events?status=UPCOMING&pageSize=6')).data });

  const upcomingEvents = eventsRes?.data || [];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center bg-idea-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center w-full">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-idea-gold mb-4">
              {content?.['hero.label'] || 'IDEA Business Network'}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-idea-navy leading-tight">
              {content?.['hero.heading'] || 'Your Business Is Our Business.'}
            </h1>
            <p className="mt-6 text-idea-muted text-lg leading-relaxed max-w-lg">
              {content?.['hero.description'] || 'IDEA brings entrepreneurs, professionals, and business leaders together on one trusted platform.'}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/members" className="inline-flex items-center gap-2 px-6 py-3 bg-idea-navy text-white font-semibold rounded hover:bg-idea-navy-2 transition-colors">
                {content?.['hero.cta1.label'] || 'Explore Members'} <ArrowRight size={16} />
              </Link>
              <a href="#membership" className="inline-flex items-center px-6 py-3 border-2 border-idea-navy text-idea-navy font-semibold rounded hover:bg-idea-navy hover:text-white transition-colors">
                {content?.['hero.cta2.label'] || 'Become a Member'}
              </a>
            </div>
          </div>
          <div className="relative hidden md:block">
            <img
              src={content?.['hero.image'] || 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=900&h=700&fit=crop'}
              alt="Business networking"
              className="w-full h-[520px] object-cover rounded-lg shadow-2xl"
              loading="eager"
            />
            <div className="absolute -bottom-4 -left-4 bg-white border border-idea-border rounded-lg p-4 shadow-lg">
              <p className="text-xs text-idea-muted font-medium">Active Members</p>
              <p className="text-2xl font-bold font-heading text-idea-navy">{settings?.['stats.members'] || '150+'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Head Table */}
      {headTable && headTable.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-idea-navy">Head Table</h2>
              <p className="mt-3 text-idea-muted max-w-xl mx-auto">Meet the leadership team guiding IDEA's vision and community growth.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {headTable.map(m => (
                <div key={m.id} className="group text-center">
                  <div className="relative overflow-hidden rounded-lg aspect-square mb-3 border border-idea-border shadow-sm group-hover:shadow-md group-hover:border-idea-gold transition-all duration-300">
                    <img src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&size=200&background=0B1220&color=C8A96B`} alt={m.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <h3 className="font-heading font-semibold text-idea-navy text-sm">{m.fullName}</h3>
                  <p className="text-idea-gold text-xs font-medium mt-0.5">{m.designation}</p>
                  <p className="text-idea-muted text-xs mt-0.5">{m.businessName}</p>
                  {m.caption && <p className="text-idea-muted text-xs mt-1 italic">{m.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Preview */}
      <section className="py-20 bg-idea-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-idea-navy">IDEA Events</h2>
              <p className="mt-2 text-idea-muted">Stay connected through our events and programmes.</p>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-1 text-sm font-semibold text-idea-navy border-b border-idea-navy hover:text-idea-gold hover:border-idea-gold transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(e => (
              <Link key={e.id} to={`/events/${e.slug}`} className="group bg-white rounded-lg border border-idea-border hover:shadow-md hover:border-idea-gold transition-all overflow-hidden">
                <div className="relative h-44 overflow-hidden">
                  <img src={e.coverImageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=300&fit=crop'} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded ${e.status === 'UPCOMING' ? 'bg-green-100 text-green-800' : e.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>{e.status}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-idea-navy text-base line-clamp-2">{e.title}</h3>
                  <div className="mt-2 text-xs text-idea-muted space-y-1">
                    <p>📅 {new Date(e.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p>🕐 {new Date(e.startDateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    {e.venue && <p>📍 {e.venue}</p>}
                  </div>
                  {e.shortDescription && <p className="mt-2 text-sm text-idea-muted line-clamp-2">{e.shortDescription}</p>}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-idea-navy border-b border-idea-navy">View All Events <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-idea-navy">About IDEA</h2>
              <p className="mt-6 text-idea-muted leading-relaxed">
                {content?.['about.preview'] || 'IDEA is a professional business networking community created to bring entrepreneurs, founders, professionals, and business leaders onto one trusted platform.'}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[{ icon: Users, label: 'Business Connections' }, { icon: TrendingUp, label: 'Community Growth' }, { icon: Globe, label: 'Opportunity Sharing' }, { icon: Calendar, label: 'Professional Events' }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-idea-ivory rounded flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-idea-gold" />
                    </div>
                    <span className="text-sm text-idea-navy font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-idea-border">
                {[{ label: 'Members', val: content?.['stats.members'] || '150+' }, { label: 'Categories', val: content?.['stats.categories'] || '25+' }, { label: 'Events', val: content?.['stats.events'] || '50+' }, { label: 'Years', val: content?.['stats.years'] || '5+' }].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="font-heading text-2xl font-bold text-idea-navy">{s.val}</p>
                    <p className="text-xs text-idea-muted mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-idea-navy border-b-2 border-idea-gold pb-0.5 hover:text-idea-gold transition-colors">
                  Learn More About IDEA <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700&h=500&fit=crop" alt="About IDEA" className="w-full h-[420px] object-cover rounded-lg shadow-lg" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Membership Form */}
      <MembershipSection />
    </div>
  );
}

function MembershipSection() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => publicApi.post('/api/public/enquiries', { ...data, enquiryType: 'MEMBERSHIP' }),
    onSuccess: () => { setSubmitted(true); reset(); },
  });

  return (
    <section id="membership" className="py-20 bg-idea-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="text-white">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Want to Become a Member?</h2>
            <p className="mt-4 text-white/70 leading-relaxed">Join a trusted network of business professionals, introduce your business, connect with potential partners, and become part of a growing entrepreneurial community.</p>
            <ul className="mt-8 space-y-3">
              {['Professional networking opportunities', 'Business visibility and exposure', 'Exclusive event participation', 'Collaboration and partnership opportunities'].map(b => (
                <li key={b} className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="w-5 h-5 bg-idea-gold/20 rounded-full flex items-center justify-center flex-shrink-0 text-idea-gold text-xs font-bold">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="font-heading text-xl font-bold text-idea-navy">Thank You!</h3>
                <p className="mt-2 text-idea-muted">Your membership enquiry has been submitted. We will contact you soon.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-idea-navy underline">Submit another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
                <h3 className="font-heading text-xl font-bold text-idea-navy mb-5">Membership Enquiry</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input {...register('fullName', { required: 'Required' })} placeholder="Full Name *" className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <input {...register('phone', { required: 'Required' })} placeholder="Phone *" className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <input {...register('email')} placeholder="Email Address" type="email" className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                <div className="grid grid-cols-2 gap-4">
                  <input {...register('businessName')} placeholder="Business Name" className="px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                  <input {...register('businessCategory')} placeholder="Business Category" className="px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input {...register('city')} placeholder="City" className="px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                  <select {...register('preferredContact')} className="px-3 py-2.5 border border-idea-border rounded text-sm text-idea-muted focus:outline-none focus:border-idea-navy">
                    <option value="">Preferred Contact</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
                <textarea {...register('message')} placeholder="Message (optional)" rows={3} className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" />
                {mutation.isError && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
                <button type="submit" disabled={mutation.isPending} className="w-full py-3 bg-idea-navy text-white font-semibold rounded hover:bg-idea-navy-2 transition-colors disabled:opacity-60">
                  {mutation.isPending ? 'Submitting…' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
