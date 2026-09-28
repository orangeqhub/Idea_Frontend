import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/idea-logo.png';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-200 bg-white ${scrolled ? 'shadow-md' : 'border-b border-idea-border'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="IDEA" className="h-14 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${location.pathname === l.to ? 'text-idea-navy border-b-2 border-idea-gold pb-0.5' : 'text-idea-muted hover:text-idea-navy'}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href="#membership" className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-idea-navy hover:bg-idea-navy-2 transition-colors rounded">
              Become a Member
            </a>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-idea-navy" aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-idea-border bg-white px-4 pb-4">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`block py-2.5 text-sm font-medium ${location.pathname === l.to ? 'text-idea-navy' : 'text-idea-muted'}`}>
              {l.label}
            </Link>
          ))}
          <a href="#membership" className="mt-3 block text-center py-2 text-sm font-semibold text-white bg-idea-navy rounded">
            Become a Member
          </a>
        </div>
      )}
    </header>
  );
}
