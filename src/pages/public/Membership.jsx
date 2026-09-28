import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { publicApi } from '../../services/publicApi';
import { CheckCircle, Upload, X, Shield } from 'lucide-react';

const inputCls = 'w-full px-3.5 py-2.5 border border-idea-border rounded-md text-sm focus:outline-none focus:border-idea-navy focus:ring-1 focus:ring-idea-navy/20 bg-white placeholder:text-idea-muted/60 transition-colors';
const labelCls = 'block text-xs font-semibold text-idea-navy/70 uppercase tracking-wide mb-1.5';
const errorCls = 'text-red-500 text-xs mt-1';

function FileUploadField({ label, name, accept, preview, onFile, onClear, optional }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  function handleDrop(e) {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }

  return (
    <div>
      <p className={labelCls}>{label}{optional && <span className="ml-1 text-idea-muted normal-case font-normal tracking-normal">(optional)</span>}</p>
      {preview ? (
        <div className="flex items-center gap-3 p-3 border border-idea-border rounded-md bg-idea-ivory">
          <img src={preview.url} alt="preview" className="w-10 h-10 object-cover rounded" />
          <span className="text-sm text-idea-navy flex-1 truncate">{preview.name}</span>
          <button type="button" onClick={onClear} className="text-idea-muted hover:text-red-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-5 text-center cursor-pointer transition-colors ${drag ? 'border-idea-navy bg-idea-navy/5' : 'border-idea-border hover:border-idea-navy/40'}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={20} className="mx-auto mb-2 text-idea-muted" />
          <p className="text-sm text-idea-muted"><span className="font-medium text-idea-navy">Click to upload</span> or drag & drop</p>
          <p className="text-xs text-idea-muted/70 mt-1">PNG, JPG — max 5 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => e.target.files[0] && onFile(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
}

export default function Membership() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId]         = useState('');
  const [firmLogo,  setFirmLogo]  = useState(null);
  const [memberPhoto, setMemberPhoto] = useState(null);
  const [submitterName, setSubmitterName] = useState('');

  const mutation = useMutation({
    mutationFn: async (data) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => v && fd.append(k, v));
      if (firmLogo?.file)   fd.append('firmLogo',    firmLogo.file);
      if (memberPhoto?.file) fd.append('memberPhoto', memberPhoto.file);
      const res = await publicApi.post('/membership/submit', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: (res, data) => {
      setRefId(res.data.refId);
      setSubmitterName(data.fullName?.split(' ')[0] || 'Applicant');
      setSubmitted(true);
      reset();
      setFirmLogo(null);
      setMemberPhoto(null);
    }
  });

  function handleFile(file, type) {
    if (file.size > 5 * 1024 * 1024) return;
    const url = URL.createObjectURL(file);
    if (type === 'logo')  setFirmLogo({ file, url, name: file.name });
    else                  setMemberPhoto({ file, url, name: file.name });
  }

  if (submitted) {
    return (
      <div className="bg-idea-ivory min-h-screen">
        <div className="bg-idea-navy py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Membership Application</h1>
            <p className="mt-4 text-white/70">IDEA Guntur — Industrial Development & Entrepreneurs Association</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-idea-navy mb-3">Thank you, {submitterName}!</h2>
          <p className="text-idea-muted leading-relaxed mb-6">
            Your IDEA Membership application has been successfully submitted. Our team will review your details and reach out to you at the earliest.
          </p>
          <div className="inline-block px-6 py-2.5 bg-idea-navy/5 border border-idea-border rounded-full text-sm font-semibold text-idea-navy tracking-wider mb-8">
            Reference: {refId}
          </div>
          <p className="text-xs text-idea-muted mb-6">Please save your reference number for future correspondence with the IDEA Guntur office.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 border border-idea-border rounded-md text-sm font-medium text-idea-navy hover:bg-idea-navy hover:text-white transition-colors"
          >
            ← Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-idea-ivory min-h-screen">
      {/* Hero */}
      <div className="bg-idea-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white/80 mb-4">
            <Shield size={12} /> Official Member Portal
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Membership Application</h1>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            Join the Industrial Development and Entrepreneurs Association of Guntur. Complete the form below to begin your membership journey.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-idea-border shadow-theme-card overflow-hidden">
          <div className="px-6 py-5 border-b border-idea-border">
            <h2 className="font-heading text-xl font-bold text-idea-navy">Membership Application Form</h2>
            <p className="text-xs text-idea-muted mt-1">Fields marked <span className="text-red-500">*</span> are required</p>
          </div>

          <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="p-6 space-y-8">
            {/* Personal Information */}
            <section>
              <h3 className="font-heading text-base font-semibold text-idea-navy mb-4 pb-2 border-b border-idea-border/60">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                  <input {...register('fullName', { required: 'Full name is required' })} placeholder="e.g. Ramya Krishna Komma" className={inputCls} />
                  {errors.fullName && <p className={errorCls}>{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" {...register('dateOfBirth', { required: 'Date of birth is required' })} className={inputCls} />
                  {errors.dateOfBirth && <p className={errorCls}>{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                  <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} placeholder="name@email.com" className={inputCls} />
                  {errors.email && <p className={errorCls}>{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" {...register('mobile', { required: 'Mobile is required', pattern: { value: /^\d{10}$/, message: 'Enter a valid 10-digit number' } })} placeholder="10-digit mobile number" className={inputCls} />
                  {errors.mobile && <p className={errorCls}>{errors.mobile.message}</p>}
                </div>
              </div>
            </section>

            {/* Business Information */}
            <section>
              <h3 className="font-heading text-base font-semibold text-idea-navy mb-4 pb-2 border-b border-idea-border/60">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Name of Business <span className="text-red-500">*</span></label>
                  <input {...register('businessName', { required: 'Business name is required' })} placeholder="e.g. AuxoGene Aqua Pvt Ltd" className={inputCls} />
                  {errors.businessName && <p className={errorCls}>{errors.businessName.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Products & Services <span className="text-red-500">*</span></label>
                  <textarea
                    {...register('products', { required: 'Products & services are required' })}
                    rows={3}
                    placeholder="e.g. Bleaching, Lime, Sodium Hypochlorite, Aquaculture Medicines, Minerals & Feed"
                    className={`${inputCls} resize-none`}
                  />
                  {errors.products && <p className={errorCls}>{errors.products.message}</p>}
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <h3 className="font-heading text-base font-semibold text-idea-navy mb-4 pb-2 border-b border-idea-border/60">Address</h3>
              <div>
                <label className={labelCls}>Full Address <span className="text-red-500">*</span></label>
                <textarea
                  {...register('address', { required: 'Address is required', minLength: { value: 10, message: 'Please enter a complete address' } })}
                  rows={3}
                  placeholder="Door No., Street, Area, City, PIN Code"
                  className={`${inputCls} resize-none`}
                />
                {errors.address && <p className={errorCls}>{errors.address.message}</p>}
              </div>
            </section>

            {/* Referral */}
            <section>
              <h3 className="font-heading text-base font-semibold text-idea-navy mb-1 pb-2 border-b border-idea-border/60">
                Referral Details <span className="text-xs text-idea-muted font-normal normal-case">Optional</span>
              </h3>
              <p className="text-xs text-idea-muted mb-4">If you were referred by an existing IDEA member, please provide their details.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name of Member Referred</label>
                  <input {...register('referredBy')} placeholder="Referring member's name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Referral Mobile Number</label>
                  <input type="tel" {...register('referralMobile')} placeholder="Referrer's mobile number" className={inputCls} />
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section>
              <h3 className="font-heading text-base font-semibold text-idea-navy mb-1 pb-2 border-b border-idea-border/60">
                Attachments <span className="text-xs text-idea-muted font-normal normal-case">Optional</span>
              </h3>
              <p className="text-xs text-idea-muted mb-4">Upload your firm logo and a recent passport-size photograph if available.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <FileUploadField
                  label="Firm Logo"
                  name="firmLogo"
                  accept="image/*"
                  preview={firmLogo}
                  onFile={f => handleFile(f, 'logo')}
                  onClear={() => setFirmLogo(null)}
                  optional
                />
                <FileUploadField
                  label="Latest Photograph"
                  name="memberPhoto"
                  accept="image/*"
                  preview={memberPhoto}
                  onFile={f => handleFile(f, 'photo')}
                  onClear={() => setMemberPhoto(null)}
                  optional
                />
              </div>
            </section>

            {mutation.isError && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-md">
                Submission failed. Please try again or contact the IDEA Guntur office.
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-idea-border/60">
              <p className="text-xs text-idea-muted">All information is treated with strict confidentiality.</p>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-8 py-3 bg-idea-gold text-white font-semibold rounded-md hover:bg-idea-gold/90 transition-colors disabled:opacity-60 text-sm"
              >
                {mutation.isPending ? 'Submitting…' : 'Submit Application →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
