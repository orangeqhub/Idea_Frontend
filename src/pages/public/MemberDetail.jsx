import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/publicApi';
import { 
  ArrowLeft, MapPin, Briefcase, Building2, Calendar, Globe, 
  Facebook, Instagram, Linkedin, Youtube, Mail, Trophy, 
  Users, Clock, Smile, User, Star 
} from 'lucide-react';

export default function MemberDetail() {
  const { slug } = useParams();

  const { data: member, isLoading, isError } = useQuery({
    queryKey: ['member', slug],
    queryFn: async () => (await publicApi.get(`/api/public/members/${slug}`)).data.data,
    enabled: !!slug,
  });

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-idea-muted animate-pulse font-heading text-lg">Loading Profile…</div>;
  if (isError || !member) return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h2 className="font-heading text-3xl font-bold text-idea-navy">Profile Not Found</h2>
      <Link to="/members" className="mt-6 inline-flex items-center gap-1.5 text-idea-gold hover:text-idea-navy text-sm font-semibold transition-colors underline">← Back to Members Directory</Link>
    </div>
  );

  const detailList = [
    { icon: User, label: 'Name', value: member.fullName },
    { icon: Star, label: 'Role', value: member.designation || 'Active Member' },
    { icon: Building2, label: 'Company', value: member.businessName },
    { icon: Briefcase, label: 'Category', value: member.businessCategory },
    { icon: MapPin, label: 'Location', value: member.officeLocation || member.serviceArea },
    { icon: Clock, label: 'Experience', value: member.workExperience ? `${member.workExperience} Years` : null },
    { icon: Calendar, label: 'Idea Since', value: member.ideaSince },
    { icon: Building2, label: 'Branches', value: member.numberOfBranches ? `${member.numberOfBranches} Location${member.numberOfBranches > 1 ? 's' : ''}` : null },
  ].filter(item => item.value);

  const stats = [
    member.workExperience && { icon: Clock, value: `${member.workExperience}+`, label: 'Years Experience' },
    member.numberOfBranches && { icon: Building2, value: String(member.numberOfBranches), label: member.numberOfBranches > 1 ? 'Branches' : 'Branch' },
    member.ideaSince && { icon: Calendar, value: String(member.ideaSince), label: 'Idea Since' },
    { icon: Smile, value: '100%', label: 'Commitment' },
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-br from-white via-idea-ivory/30 to-idea-ivory/60 min-h-screen">
      <div className="bg-idea-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/members" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft size={15} /> Back to Members
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-idea-navy tracking-wide animate-fade-in">Profile</h1>
          <p className="text-idea-muted text-sm mt-2 font-medium">{member.caption || `I'm a ${member.designation || 'Member'}`}</p>
        </div>

        {/* Three Column Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Column 1: Profile Sidebar Photo Card (Left) */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-b from-idea-navy via-idea-navy-2 to-idea-navy text-white rounded-[32px] p-8 flex flex-col items-center text-center shadow-[0_16px_40px_rgba(11,18,32,0.22)] relative overflow-hidden group border border-white/10 hover:border-idea-gold/30 transition-all duration-500 hover:shadow-[0_20px_48px_rgba(200,169,107,0.25)]">
              {/* Glowing accent backdrops */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-idea-gold/10 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-150 duration-700"></div>
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-150 duration-700"></div>
              
              {/* Image with zoom and border glow */}
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white group-hover:border-idea-gold shadow-lg mx-auto mb-6 bg-white/10 flex-shrink-0 transition-colors duration-500">
                <img src={member.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&size=300&background=F7F4EE&color=0B1220`} alt={member.fullName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              
              <p className="text-idea-gold text-xs font-bold tracking-widest uppercase mb-1.5 transition-all group-hover:tracking-wider duration-300">Hello, I'm</p>
              <h2 className="font-heading text-2xl font-bold uppercase mb-4 tracking-wide text-white leading-snug group-hover:text-idea-gold transition-colors duration-300">{member.fullName}</h2>
              
              <div className="w-10 h-0.5 bg-white/40 mb-6 mx-auto group-hover:w-16 transition-all duration-300"></div>
              
              <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
                {member.caption || member.designation || member.businessCategory || 'Active IDEA Guntur Member'}
              </p>

              <div className="w-full h-px bg-white/10 mb-6"></div>

              {/* White circular social buttons with hover pop */}
              <div className="flex gap-4 justify-center">
                {member.facebookUrl && (
                  <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-idea-navy hover:bg-idea-gold hover:-translate-y-1 hover:shadow-md transition-all duration-300" title="Facebook">
                    <Facebook size={15} />
                  </a>
                )}
                {member.instagramUrl && (
                  <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-idea-navy hover:bg-idea-gold hover:-translate-y-1 hover:shadow-md transition-all duration-300" title="Instagram">
                    <Instagram size={15} />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-idea-navy hover:bg-idea-gold hover:-translate-y-1 hover:shadow-md transition-all duration-300" title="LinkedIn">
                    <Linkedin size={15} />
                  </a>
                )}
                {member.youtubeUrl && (
                  <a href={member.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-idea-navy hover:bg-idea-gold hover:-translate-y-1 hover:shadow-md transition-all duration-300" title="YouTube">
                    <Youtube size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: About me & Stats Grid (Center) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="group/title inline-block">
                <h2 className="font-heading text-xl font-bold text-idea-navy">About me</h2>
                <div className="w-8 group-hover/title:w-full h-1 bg-idea-gold mt-1.5 rounded transition-all duration-300"></div>
              </div>
              <p className="text-idea-muted text-sm leading-relaxed mt-5 whitespace-pre-line font-medium">
                {member.biography || `${member.fullName} is an active and verified business member of the IDEA Guntur chapter, contributing to the business growth and collaborative opportunities within our network.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white border border-idea-border/80 rounded-2xl p-4 text-center shadow-[0_4px_12px_rgba(11,18,32,0.02)] hover:shadow-[0_12px_24px_rgba(200,169,107,0.18)] hover:border-idea-gold hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[110px] group/stat">
                    <div className="w-9 h-9 rounded-full bg-idea-navy/[0.04] text-idea-navy group-hover/stat:scale-110 group-hover/stat:bg-idea-gold group-hover/stat:text-white transition-all duration-300 flex items-center justify-center mb-2.5 shadow-sm border border-idea-border/30">
                      <Icon size={16} />
                    </div>
                    <div className="font-heading font-bold text-idea-navy text-xl leading-tight group-hover/stat:scale-105 transition-transform">{stat.value}</div>
                    <div className="text-[10px] text-idea-muted font-bold tracking-wide uppercase mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-2">
              <a href={`mailto:info@ideaguntur.org?subject=Contacting%20${encodeURIComponent(member.fullName)}`} className="inline-flex items-center gap-2 px-7 py-3 border-2 border-idea-navy text-idea-navy hover:bg-idea-navy hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(11,18,32,0.2)] rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm">
                <Mail size={15} className="animate-bounce" /> CONTACT ME
              </a>
            </div>
          </div>

          {/* Column 3: Details (Right) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-idea-border/80 shadow-[0_4px_16px_rgba(11,18,32,0.02)]">
            <div className="group/title inline-block">
              <h2 className="font-heading text-xl font-bold text-idea-navy">Details</h2>
              <div className="w-8 group-hover/title:w-full h-1 bg-idea-gold mt-1.5 rounded transition-all duration-300"></div>
            </div>
            
            <div className="mt-8 space-y-5">
              {detailList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-4 items-center group/item hover:translate-x-1 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-idea-navy/[0.04] text-idea-navy group-hover/item:bg-idea-gold group-hover/item:text-white group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300 flex items-center justify-center flex-shrink-0 shadow-sm border border-idea-border/40">
                      <Icon size={18} className="stroke-[2.5px] transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-idea-muted font-bold tracking-wide uppercase">{item.label}</p>
                      <p className="text-sm font-semibold text-idea-navy group-hover/item:text-idea-gold transition-colors truncate" title={item.value}>{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {(member.facebookUrl || member.instagramUrl || member.linkedinUrl || member.youtubeUrl) && (
              <div className="mt-10 pt-6 border-t border-idea-border/60 flex gap-4">
                {member.facebookUrl && (
                  <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-idea-muted hover:text-idea-gold transition-colors">
                    <Facebook size={18} />
                  </a>
                )}
                {member.instagramUrl && (
                  <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-idea-muted hover:text-idea-gold transition-colors">
                    <Instagram size={18} />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-idea-muted hover:text-idea-gold transition-colors">
                    <Linkedin size={18} />
                  </a>
                )}
                {member.youtubeUrl && (
                  <a href={member.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-idea-muted hover:text-idea-gold transition-colors">
                    <Youtube size={18} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {member.gallery && member.gallery.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-bold text-idea-navy mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {member.gallery.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-idea-border shadow-sm group">
                  <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {img.caption && <p className="px-3 py-2 text-xs text-idea-muted font-medium bg-white border-t border-idea-border">{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
