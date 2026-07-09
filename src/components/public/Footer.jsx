import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/publicApi';
import logo from '@/assets/idea-logo.png';

export default function Footer() {
  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await publicApi.get('/api/public/settings');
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <footer className="bg-idea-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-xl inline-block shadow-sm">
                <img src={logo} alt="IDEA" className="h-16 w-auto object-contain" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{data?.['site.footer.description'] || 'A trusted business networking community.'}</p>
            <div className="flex gap-4 mt-4">
              {data?.['social.linkedin'] && <a href={data['social.linkedin']} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-idea-gold text-sm">LinkedIn</a>}
              {data?.['social.instagram'] && <a href={data['social.instagram']} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-idea-gold text-sm">Instagram</a>}
              {data?.['social.facebook'] && <a href={data['social.facebook']} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-idea-gold text-sm">Facebook</a>}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[['Home', '/'], ['Members', '/members'], ['Events', '/events'], ['About', '/about'], ['Contact', '/contact']].map(([l, h]) => (
                <li key={h}><Link to={h} className="hover:text-idea-gold transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              {data?.['contact.phone'] && <li>{data['contact.phone']}</li>}
              {data?.['contact.email'] && <li>{data['contact.email']}</li>}
              {data?.['contact.address'] && <li className="leading-relaxed">{data['contact.address']}</li>}
              {data?.['contact.hours'] && <li className="text-white/60">{data['contact.hours']}</li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/40">
          © {new Date().getFullYear()} IDEA Business Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
