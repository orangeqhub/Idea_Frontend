import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { Users, TrendingUp, Globe, Calendar, ArrowRight } from 'lucide-react';

export default function About() {
  const { data: content } = useQuery({ queryKey: ['content'], queryFn: async () => (await publicApi.get('/api/public/content')).data.data, staleTime: 10 * 60 * 1000 });

  const values = [
    { icon: Users, title: 'Community First', desc: content?.['about.value1'] || 'We believe in the power of community. IDEA is built on trust, mutual support, and professional solidarity.' },
    { icon: TrendingUp, title: 'Business Growth', desc: content?.['about.value2'] || 'Our members grow their businesses through referrals, collaborations, and shared knowledge.' },
    { icon: Globe, title: 'Diverse Network', desc: content?.['about.value3'] || 'IDEA brings together professionals from all industries and backgrounds to create a rich, diverse network.' },
    { icon: Calendar, title: 'Regular Events', desc: content?.['about.value4'] || 'Consistent touchpoints through weekly, monthly, and annual events keep the network active and energised.' },
  ];

  return (
    <div className="bg-white">
      <div className="bg-idea-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">About IDEA</h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">{content?.['about.subtitle'] || 'A trusted business networking community built on relationships, trust, and mutual growth.'}</p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-idea-navy">Our Story</h2>
              <div className="mt-6 space-y-4 text-idea-muted leading-relaxed">
                <p>{content?.['about.story1'] || 'IDEA was founded by a group of passionate entrepreneurs who believed that business success thrives in a connected community. Starting with a small group of local business owners, IDEA has grown into a thriving network of professionals across diverse industries.'}</p>
                <p>{content?.['about.story2'] || 'The network was established on the principle that when one business grows, all businesses in the network benefit. This philosophy of collective success has made IDEA one of the most sought-after business networking communities in the region.'}</p>
              </div>
            </div>
            <div>
              <img src={content?.['about.image'] || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700&h=500&fit=crop'} alt="IDEA Story" className="w-full h-80 object-cover rounded-lg shadow-lg border border-idea-border" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-idea-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-idea-navy">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white p-6 rounded-lg border border-idea-border shadow-sm hover:shadow-md hover:border-idea-gold transition-all">
                <div className="w-10 h-10 bg-idea-navy/5 rounded-lg flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-idea-gold" />
                </div>
                <h3 className="font-heading font-bold text-idea-navy">{v.title}</h3>
                <p className="mt-2 text-sm text-idea-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{ label: 'Members', val: content?.['stats.members'] || '150+' }, { label: 'Business Categories', val: content?.['stats.categories'] || '25+' }, { label: 'Events Hosted', val: content?.['stats.events'] || '50+' }, { label: 'Years Active', val: content?.['stats.years'] || '5+' }].map(s => (
              <div key={s.label} className="p-6 bg-idea-ivory rounded-lg border border-idea-border">
                <p className="font-heading text-4xl font-bold text-idea-navy">{s.val}</p>
                <p className="mt-2 text-sm text-idea-muted font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-idea-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Ready to Join IDEA?</h2>
          <p className="mt-4 text-white/70">Be part of a growing community of business professionals.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="/#membership" className="inline-flex items-center gap-2 px-6 py-3 bg-idea-gold text-white font-semibold rounded hover:bg-idea-gold/90 transition-colors">
              Apply for Membership <ArrowRight size={16} />
            </a>
            <Link to="/contact" className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded hover:border-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
