import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { publicApi } from '../../services/publicApi';
import { useState, useEffect } from 'react';
import { ArrowRight, Users, Calendar, TrendingUp, Globe } from 'lucide-react';

export default function Home() {
  const { data: content } = useQuery({ queryKey: ['content'], queryFn: async () => (await publicApi.get('/api/public/content')).data.data, staleTime: 10 * 60 * 1000 });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: async () => (await publicApi.get('/api/public/settings')).data.data, staleTime: 10 * 60 * 1000 });
  const { data: chapters = [] } = useQuery({ queryKey: ['chapters'], queryFn: async () => (await publicApi.get('/api/public/chapters')).data.data });
  const { data: headTable } = useQuery({ queryKey: ['head-table'], queryFn: async () => (await publicApi.get('/api/public/head-table')).data.data });
  const { data: testimonials } = useQuery({ queryKey: ['testimonials'], queryFn: async () => (await publicApi.get('/api/public/testimonials')).data.data });
  const { data: eventsRes } = useQuery({ queryKey: ['events', 'home-preview'], queryFn: async () => (await publicApi.get('/api/public/events?status=UPCOMING&pageSize=6')).data });

  const upcomingEvents = eventsRes?.data || [];

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = content?.['hero.carousel'] 
    ? content['hero.carousel'].split(',').map(url => url.trim()) 
    : [content?.['hero.image'] || 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=900&h=700&fit=crop'];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

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
          <div className="relative hidden md:block h-[520px] rounded-lg shadow-2xl overflow-hidden group">
            {slides.map((slide, idx) => (
              <img
                key={idx}
                src={slide}
                alt="Business networking"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            ))}
            
            {slides.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-1.5 z-10 bg-black/35 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-idea-gold w-4' : 'bg-white/60 hover:bg-white'}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute -bottom-4 -left-4 bg-white border border-idea-border rounded-lg p-4 shadow-lg z-10">
              <p className="text-xs text-idea-muted font-medium">Active Members</p>
              <p className="text-2xl font-bold font-heading text-idea-navy">{settings?.['stats.members'] || '150+'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      {chapters && chapters.length > 0 && (
        <section className="py-16 bg-idea-ivory/30 border-b border-idea-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-idea-gold mb-3">IDEA Chapters</span>
            <h2 className="font-heading text-3xl font-bold text-idea-navy">Connect With Our Chapters</h2>
            <p className="mt-2 text-idea-muted text-sm max-w-xl mx-auto">Select a chapter below to view members, leadership teams, and coordinators belonging to that group.</p>
            
            <div className="mt-10 flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {chapters.map(ch => (
                <Link 
                  key={ch.id}
                  to={`/members?chapterId=${ch.id}`} 
                  className="group flex flex-col items-center bg-white border border-idea-border/80 hover:border-idea-gold p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 w-full max-w-[280px]"
                >
                  <div className="w-36 h-36 flex items-center justify-center overflow-hidden">
                    {ch.logoUrl ? (
                      <img src={ch.logoUrl} alt={ch.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-24 h-24 bg-idea-navy text-idea-gold font-bold flex items-center justify-center rounded-3xl text-2xl transition-transform duration-500 group-hover:scale-105">
                        {ch.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="mt-6 font-heading font-extrabold text-idea-navy text-lg group-hover:text-idea-gold transition-colors duration-300">{ch.name}</span>
                  <span className="mt-1 text-[11px] font-bold text-idea-muted uppercase tracking-wider">View Chapter Directory</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Preview */}
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-idea-ivory/60">
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
                    <div className="w-8 h-8 bg-white border border-idea-border/50 rounded flex items-center justify-center flex-shrink-0">
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-idea-gold mb-3">TESTIMONIALS</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-idea-navy">What Our Members Say</h2>
            <p className="mt-3 text-idea-muted max-w-xl mx-auto">Hear from leaders and founders who have grown their businesses through our network.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(testimonials && testimonials.length > 0 ? testimonials : [
              {
                quote: "IDEA has completely transformed how I connect with local business owners. The quality of networking and mutual support in this community is unparalleled.",
                author: "Kalyan Ram",
                role: "CEO, TechVantage",
                business: "IT Consulting"
              },
              {
                quote: "The business exhibitions and speaker sessions have given my brand massive visibility. Highly recommend joining IDEA to any growing founder.",
                author: "Srinivas Rao",
                role: "Founder, GreenLands Developers",
                business: "Real Estate"
              },
              {
                quote: "Through IDEA Guntur, I found three major strategic partners that helped scale our manufacturing operations across South India.",
                author: "Lakshmi Prasanna",
                role: "Managing Director, Sri Krishna Spices",
                business: "Food Processing"
              }
            ]).map((t, idx) => (
              <div key={idx} className="bg-idea-ivory/40 border border-idea-border rounded-lg p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-idea-gold transition-all duration-300">
                <div>
                  <div className="text-idea-gold text-4xl mb-4 font-serif">“</div>
                  <p className="text-idea-navy/90 text-sm leading-relaxed italic">{t.quote}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-idea-border/60">
                  <h4 className="font-heading font-bold text-idea-navy text-sm">{t.author}</h4>
                  {t.role && <p className="text-idea-gold text-xs font-semibold">{t.role}</p>}
                  {t.business && <p className="text-idea-muted text-xs mt-0.5">{t.business}</p>}
                </div>
              </div>
            ))}
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
