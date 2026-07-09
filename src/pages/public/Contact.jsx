import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { publicApi } from '../../services/publicApi';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: async () => (await publicApi.get('/public/settings')).data.data, staleTime: 10 * 60 * 1000 });
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => publicApi.post('/public/enquiries', { ...data, enquiryType: 'CONTACT' }),
    onSuccess: () => { setSubmitted(true); reset(); },
  });

  const contactItems = [
    { icon: Phone, label: 'Phone', value: settings?.['contact.phone'] },
    { icon: Mail, label: 'Email', value: settings?.['contact.email'] },
    { icon: MapPin, label: 'Address', value: settings?.['contact.address'] },
    { icon: Clock, label: 'Office Hours', value: settings?.['contact.hours'] },
  ].filter(c => c.value);

  return (
    <div className="bg-white">
      <div className="bg-idea-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">Reach out to us for membership enquiries, event information, or general questions.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-heading text-2xl font-bold text-idea-navy mb-8">Get in Touch</h2>
            {contactItems.length > 0 ? (
              <div className="space-y-6">
                {contactItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-idea-navy/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-idea-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-idea-muted font-medium">{label}</p>
                      <p className="text-idea-navy font-medium mt-0.5 whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-idea-navy/5 rounded-lg flex items-center justify-center"><Mail size={18} className="text-idea-gold" /></div>
                  <div><p className="text-xs text-idea-muted">Email</p><p className="text-idea-navy font-medium">info@idea.in</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-idea-navy/5 rounded-lg flex items-center justify-center"><Phone size={18} className="text-idea-gold" /></div>
                  <div><p className="text-xs text-idea-muted">Phone</p><p className="text-idea-navy font-medium">+91 98765 43210</p></div>
                </div>
              </div>
            )}
          </div>

          <div>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="font-heading text-xl font-bold text-idea-navy">Message Sent!</h3>
                <p className="mt-2 text-idea-muted">Thank you for reaching out. We'll respond within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-idea-navy underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
                <h2 className="font-heading text-2xl font-bold text-idea-navy mb-6">Send a Message</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input {...register('fullName', { required: 'Required' })} placeholder="Full Name *" className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <input {...register('phone')} placeholder="Phone" className="px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                </div>
                <input {...register('email')} placeholder="Email Address" type="email" className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                <input {...register('subject', { required: 'Required' })} placeholder="Subject *" className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy" />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                <textarea {...register('message', { required: 'Required' })} placeholder="Your message *" rows={5} className="w-full px-3 py-2.5 border border-idea-border rounded text-sm focus:outline-none focus:border-idea-navy resize-none" />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                {mutation.isError && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
                <button type="submit" disabled={mutation.isPending} className="w-full py-3 bg-idea-navy text-white font-semibold rounded hover:bg-idea-navy-2 transition-colors disabled:opacity-60">
                  {mutation.isPending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
