import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/publicApi';
import { 
  ArrowLeft, MapPin, Briefcase, Building2, Calendar, Globe, 
  Facebook, Instagram, Linkedin, Youtube, Mail, Trophy, 
  Users, Clock, Smile, User, Star, Phone 
} from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className={props.className} style={props.style} width={props.size || 24} height={props.size || 24}>
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L32 503l138.2-36.2c32.5 17.7 68.9 27 106.1 27 122.4 0 222-99.6 222-222 0-59.3-23-115.1-64.9-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-81.8 21.4 21.8-79.7-4.4-7c-18.4-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.4 0 101.7-82.9 184.5-184.6 184.5zm100.5-137.5c-5.5-2.7-32.6-16.1-37.7-18-5.1-1.9-8.8-2.7-12.5 2.7-3.7 5.5-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.7-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.5-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.3 5.7 23.6 9.2 31.7 11.8 13.4 4.3 25.6 3.7 35.3 2.2 10.8-1.6 32.6-13.3 37.2-26.2 4.6-12.9 4.6-24 3.2-26.2-1.3-2.2-5-3.5-10.5-6.2z"/>
  </svg>
);

const getYoutubeId = (url) => {
  if (!url) return null;
  const trimmedUrl = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmedUrl.match(regExp);
  return (match && match[2].trim().length === 11) ? match[2].trim() : null;
};

export default function MemberDetail() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { slug } = useParams();

  const { data: member, isLoading, isError } = useQuery({
    queryKey: ['member', slug],
    queryFn: async () => (await publicApi.get(`/public/members/${slug}`)).data.data,
    enabled: !!slug,
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await publicApi.get('/public/settings')).data.data,
    staleTime: 10 * 60 * 1000,
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
    { icon: Phone, label: 'WhatsApp', value: member.whatsappNumber },
  ].filter(item => item.value);

  const stats = [
    member.workExperience && { icon: Clock, value: `${member.workExperience}+`, label: 'Years Experience' },
    member.ideaSince && { icon: Calendar, value: String(member.ideaSince), label: 'Idea Since' },
    member.numberOfBranches && { icon: Building2, value: String(member.numberOfBranches), label: 'Branches' },
    { icon: Smile, value: '100%', label: 'Commitment' },
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-br from-white via-idea-ivory/30 to-idea-ivory/60 min-h-screen pb-24 relative overflow-hidden">
      
      {/* Background blur sphere */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-idea-gold/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Back navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        <Link to="/members" className="group inline-flex items-center gap-2 text-idea-navy/70 hover:text-idea-navy text-sm font-extrabold transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" /> Back to Members
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Sidebar Column - Sticky Profile Details */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
            {/* Main Profile Info Card */}
            <div className="bg-white rounded-3xl border border-idea-border/60 shadow-sm p-6 text-center flex flex-col items-center">
              {/* Circular Photo with Aura */}
              <div className="relative group/photo mb-6">
                <div className="absolute inset-[-8px] rounded-full border border-idea-gold/30 pointer-events-none"></div>
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-idea-ivory relative">
                  <img src={member.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&size=300&background=F7F4EE&color=0B1220`} alt={member.fullName} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-idea-navy leading-none mb-2">{member.fullName}</h2>
              <span className="bg-idea-navy/[0.04] text-idea-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-idea-border/30">
                {member.designation || 'Active Member'}
              </span>

              {member.caption && (
                <p className="text-idea-muted text-xs leading-relaxed italic mb-6 font-medium px-4">
                  "{member.caption}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                <a href={`mailto:${member.slug || 'info'}@ideaguntur.org?subject=Contacting%20${encodeURIComponent(member.fullName)}`} className="flex items-center justify-center gap-2 w-full py-3 bg-idea-navy hover:bg-idea-navy-2 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm">
                  <Mail size={14} /> Contact Member
                </a>
                
                {/* Social Icons inside Profile Card */}
                <div className="flex gap-2 justify-center pt-2">
                  {[
                    { icon: Facebook, label: 'Facebook', href: member.facebookUrl, hoverClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]' },
                    { icon: Instagram, label: 'Instagram', href: member.instagramUrl, hoverClass: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white' },
                    { icon: Youtube, label: 'YouTube', href: member.youtubeUrl, hoverClass: 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]' },
                    { icon: WhatsAppIcon, label: 'WhatsApp', href: member.whatsappNumber ? `https://wa.me/${member.whatsappNumber.replace(/\D/g, '')}` : null, hoverClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]' },
                    { icon: Linkedin, label: 'LinkedIn', href: member.linkedinUrl, hoverClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]' }
                  ].filter(item => item.href).map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-xl bg-idea-navy/[0.03] text-idea-navy border border-idea-border/40 flex items-center justify-center transition-all duration-300 ${social.hoverClass}`} title={social.label}>
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Business Highlight Card */}
            {(member.businessName || member.businessLogoUrl) && (
              <div className="bg-white rounded-3xl border border-idea-border/60 shadow-sm p-6 flex items-center gap-4">
                {member.businessLogoUrl ? (
                  <img src={member.businessLogoUrl} alt={member.businessName} className="h-16 w-16 object-contain bg-white border border-idea-border/80 p-1.5 rounded-2xl shadow-sm flex-shrink-0" />
                ) : (
                  <div className="h-16 w-16 bg-idea-navy text-idea-gold font-bold flex items-center justify-center rounded-2xl text-xl flex-shrink-0">
                    {member.businessName ? member.businessName.substring(0, 2).toUpperCase() : 'CO'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[10px] text-idea-gold font-bold uppercase tracking-wider">Representing</p>
                  <p className="text-idea-navy font-black text-sm uppercase tracking-wide leading-tight truncate mt-0.5">{member.businessName}</p>
                  <p className="text-idea-muted text-[11px] font-semibold mt-0.5">{member.businessCategory}</p>
                </div>
              </div>
            )}

            {/* Quick Professional Stats Card */}
            {stats.length > 0 && (
              <div className="bg-white rounded-3xl border border-idea-border/60 shadow-sm p-6">
                <p className="text-xs font-bold text-idea-navy uppercase tracking-widest mb-4">Quick Facts</p>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-idea-ivory/20 border border-idea-border/50 rounded-2xl p-3 flex flex-col items-center text-center justify-center">
                        <Icon size={16} className="text-idea-gold mb-1" />
                        <span className="font-extrabold text-idea-navy text-xs leading-none">{stat.value}</span>
                        <span className="text-[8px] text-idea-muted font-bold uppercase tracking-wider mt-1">{stat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me Card */}
            {member.biography && (
              <div className="bg-white rounded-3xl border border-idea-border/60 border-l-4 border-l-idea-gold p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-2 right-6 text-idea-gold/5 font-serif text-[120px] pointer-events-none leading-none select-none italic">“</div>
                <h3 className="text-base font-extrabold text-idea-navy uppercase tracking-widest mb-3">About Me</h3>
                <p className="text-idea-muted text-sm leading-relaxed mt-4 whitespace-pre-line font-medium relative z-10">
                  {member.biography}
                </p>
              </div>
            )}

            {/* About Business Card */}
            {member.businessDescription && (
              <div className="bg-white rounded-3xl border border-idea-border/60 border-l-4 border-l-idea-navy p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-2 right-6 text-idea-navy/[0.02] font-serif text-[120px] pointer-events-none leading-none select-none italic">“</div>
                <h3 className="text-base font-extrabold text-idea-navy uppercase tracking-widest mb-3">About Business</h3>
                <p className="text-idea-muted text-sm leading-relaxed mt-4 whitespace-pre-line font-medium relative z-10">
                  {member.businessDescription}
                </p>
              </div>
            )}

            {/* Profile Information (Clean 2-column Grid) */}
            <div className="bg-white rounded-3xl border border-idea-border/60 p-8 shadow-sm">
              <h3 className="text-base font-extrabold text-idea-navy uppercase tracking-widest mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailList.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-idea-ivory/10 border border-idea-border/40 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-idea-navy/5 text-idea-navy flex items-center justify-center flex-shrink-0">
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-idea-muted font-bold uppercase tracking-wider leading-none">{item.label}</p>
                        <p className="text-xs font-bold text-idea-navy mt-1 truncate" title={item.value}>{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* YouTube Featured Videos */}
            {member.youtubeUrl && member.youtubeUrl.split(',').filter(url => getYoutubeId(url)).length > 0 && (
              <div className="bg-white rounded-3xl border border-idea-border/60 p-8 shadow-sm">
                <h3 className="text-base font-extrabold text-idea-navy uppercase tracking-widest mb-6">Featured Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {member.youtubeUrl.split(',').filter(url => getYoutubeId(url)).map((url, idx) => {
                    const videoId = getYoutubeId(url);
                    return (
                      <div key={idx} className="relative rounded-xl overflow-hidden shadow-sm border border-idea-border group/video aspect-video bg-idea-navy">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                          <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="" className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-500 opacity-90" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/video:bg-black/30 transition-colors duration-300">
                            <div className="w-10 h-10 rounded-full bg-idea-gold text-white flex items-center justify-center shadow-lg transform group-hover/video:scale-110 transition-transform duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Business Gallery */}
            {(() => {
              const galleryImages = member.businessGallery ? member.businessGallery.split(',').filter(Boolean) : [];
              if (galleryImages.length === 0) return null;
              return (
                <div className="bg-white rounded-3xl border border-idea-border/60 p-8 shadow-sm">
                  <h3 className="text-base font-extrabold text-idea-navy uppercase tracking-widest mb-6">Business Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {galleryImages.map((imgUrl, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-idea-border shadow-sm group aspect-video cursor-pointer" onClick={() => setSelectedImage(imgUrl)}>
                        <img src={imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center">
            <img src={selectedImage} alt="" className="max-w-full max-h-[80vh] rounded-lg object-contain shadow-2xl" />
            <button onClick={() => setSelectedImage(null)} className="absolute -top-10 right-0 text-white hover:text-idea-gold text-lg font-extrabold transition-colors">Close ×</button>
          </div>
        </div>
      )}
    </div>
  );
}
