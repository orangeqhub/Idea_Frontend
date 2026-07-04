import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/publicApi';
import { ArrowLeft, MapPin, Briefcase, Building2, Calendar, Globe } from 'lucide-react';

export default function MemberDetail() {
  const { slug } = useParams();

  const { data: member, isLoading, isError } = useQuery({
    queryKey: ['member', slug],
    queryFn: async () => (await publicApi.get(`/api/public/members/${slug}`)).data.data,
    enabled: !!slug,
  });

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-idea-muted animate-pulse">Loading…</div>;
  if (isError || !member) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 className="font-heading text-2xl font-bold text-idea-navy">Member not found</h2>
      <Link to="/members" className="mt-4 inline-flex items-center gap-1 text-idea-navy text-sm underline">← Back to Members</Link>
    </div>
  );

  const details = [
    { icon: Building2, label: 'Business', value: member.businessName },
    { icon: Briefcase, label: 'Category', value: member.businessCategory },
    { icon: MapPin, label: 'Service Area', value: member.serviceArea },
    { icon: Globe, label: 'Office Location', value: member.officeLocation },
    { icon: Calendar, label: 'IDEA Since', value: member.ideaSince },
    { icon: Globe, label: 'Work Experience', value: member.workExperience ? `${member.workExperience} years` : null },
    { icon: Building2, label: 'Branches', value: member.numberOfBranches ? `${member.numberOfBranches} location${member.numberOfBranches > 1 ? 's' : ''}` : null },
  ].filter(d => d.value);

  return (
    <div className="bg-white">
      <div className="bg-idea-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/members" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Members
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <div className="relative rounded-lg overflow-hidden aspect-square border border-idea-border shadow-lg">
              <img src={member.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&size=400&background=0B1220&color=C8A96B`} alt={member.fullName} className="w-full h-full object-cover" />
              {member.isFeatured && <span className="absolute top-3 right-3 bg-idea-gold text-white text-xs font-bold px-2 py-1 rounded">Featured Member</span>}
            </div>
            {member.age && (
              <div className="mt-4 p-4 bg-idea-ivory rounded-lg border border-idea-border">
                <p className="text-xs text-idea-muted">Age</p>
                <p className="font-heading text-xl font-bold text-idea-navy">{member.age} years</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-idea-navy">{member.fullName}</h1>
            {member.businessName && <p className="mt-1 text-idea-gold font-medium">{member.businessName}</p>}
            {member.businessCategory && <span className="inline-block mt-2 text-xs bg-idea-ivory border border-idea-border text-idea-navy px-3 py-1 rounded-full">{member.businessCategory}</span>}

            {member.biography && (
              <div className="mt-6">
                <h2 className="font-heading font-semibold text-idea-navy mb-2">About</h2>
                <p className="text-idea-muted leading-relaxed">{member.biography}</p>
              </div>
            )}

            {details.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-idea-ivory rounded-lg border border-idea-border">
                    <Icon size={16} className="text-idea-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-idea-muted">{label}</p>
                      <p className="text-sm font-medium text-idea-navy">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {member.gallery && member.gallery.length > 0 && (
          <div className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-idea-navy mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {member.gallery.map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-idea-border">
                  <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {img.caption && <p className="px-3 py-2 text-xs text-idea-muted">{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
