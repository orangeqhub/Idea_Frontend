import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/publicApi';
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';

const STATUS_STYLE = {
  UPCOMING: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
  POSTPONED: 'bg-yellow-100 text-yellow-800',
};

export default function EventDetail() {
  const { slug } = useParams();

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => (await publicApi.get(`/api/public/events/${slug}`)).data.data,
    enabled: !!slug,
  });

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-idea-muted animate-pulse">Loading…</div>;
  if (isError || !event) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 className="font-heading text-2xl font-bold text-idea-navy">Event not found</h2>
      <Link to="/events" className="mt-4 inline-flex items-center gap-1 text-idea-navy text-sm underline">← Back to Events</Link>
    </div>
  );

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

  return (
    <div className="bg-white">
      <div className="bg-idea-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/events" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Events
          </Link>
        </div>
      </div>

      {event.coverImageUrl && (
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[event.status]}`}>{event.status}</span>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-idea-navy">{event.title}</h1>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-idea-ivory rounded-lg border border-idea-border">
            <Calendar size={18} className="text-idea-gold mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-idea-muted">Date</p>
              <p className="text-sm font-medium text-idea-navy">{formatDate(event.startDateTime)}</p>
              {event.endDateTime && <p className="text-xs text-idea-muted mt-0.5">to {formatDate(event.endDateTime)}</p>}
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-idea-ivory rounded-lg border border-idea-border">
            <Clock size={18} className="text-idea-gold mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-idea-muted">Time (IST)</p>
              <p className="text-sm font-medium text-idea-navy">{formatTime(event.startDateTime)}</p>
              {event.endDateTime && <p className="text-xs text-idea-muted mt-0.5">to {formatTime(event.endDateTime)}</p>}
            </div>
          </div>
          {event.venue && (
            <div className="flex items-start gap-3 p-4 bg-idea-ivory rounded-lg border border-idea-border sm:col-span-2">
              <MapPin size={18} className="text-idea-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-idea-muted">Venue</p>
                <p className="text-sm font-medium text-idea-navy">{event.venue}</p>
              </div>
            </div>
          )}
        </div>

        {event.shortDescription && <p className="mt-8 text-idea-muted leading-relaxed text-lg">{event.shortDescription}</p>}
        {event.fullDescription && (
          <div className="mt-8">
            <h2 className="font-heading text-xl font-bold text-idea-navy mb-4">Event Details</h2>
            <div className="prose prose-sm max-w-none text-idea-muted leading-relaxed whitespace-pre-line">{event.fullDescription}</div>
          </div>
        )}

        {event.agenda && (
          <div className="mt-10 p-6 bg-idea-ivory rounded-lg border border-idea-border">
            <h2 className="font-heading text-xl font-bold text-idea-navy mb-4">Agenda</h2>
            <div className="text-idea-muted text-sm leading-relaxed whitespace-pre-line">{event.agenda}</div>
          </div>
        )}

        {event.speakers && (
          <div className="mt-8">
            <h2 className="font-heading text-xl font-bold text-idea-navy mb-4">Speakers</h2>
            <div className="text-idea-muted text-sm leading-relaxed whitespace-pre-line">{event.speakers}</div>
          </div>
        )}

        {(event.registrationLink || event.contactDetails) && (
          <div className="mt-10 flex flex-wrap gap-4">
            {event.registrationLink && (
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-idea-navy text-white font-semibold rounded hover:bg-idea-navy-2 transition-colors">
                Register Now <ExternalLink size={15} />
              </a>
            )}
            {event.contactDetails && <p className="text-sm text-idea-muted flex items-center gap-2"><span className="font-medium text-idea-navy">Contact:</span> {event.contactDetails}</p>}
          </div>
        )}

        {event.gallery && event.gallery.length > 0 && (
          <div className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-idea-navy mb-6">Event Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.gallery.map((img) => (
                <div key={img.id} className="rounded-lg overflow-hidden border border-idea-border">
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
