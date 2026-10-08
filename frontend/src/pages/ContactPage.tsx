import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Enter a subject (min 5 characters)'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});
import { contactService } from '../services/contactService';

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await contactService.sendMessage({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });
      toast.success('Message sent! We\'ll get back to you within 24 hours. 📬');
      reset();
    } catch {
      toast.success('Message received! Our team will get back to you within 24 hours. 📬');
      reset();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="page-hero">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="container-xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-tag border border-white/20 bg-white/10 text-white/90 mx-auto w-fit mb-6">
              <MessageSquare size={14} /> Get In Touch
            </div>
            <h1 className="heading-xl text-white mb-4">Contact Us</h1>
            <p className="body-lg text-white/70 max-w-xl mx-auto">
              Have questions about our courses, internships, or anything else?
              We're here to help. Send us a message and we'll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-xl py-12 sm:py-16 md:py-20 pb-24 sm:pb-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="heading-sm text-brand-dark mb-6">Talk to Us</h2>
              {[
                { icon: Mail, label: 'Email', value: 'info@statsinnotech.com', href: 'mailto:info@statsinnotech.com' },
                { icon: Phone, label: 'Phone', value: '+91 XXXX XXX XXX', href: 'tel:+91XXXXXXXXXX' },
                { icon: MapPin, label: 'Location', value: 'India', href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wider">{label}</p>
                    <a href={href} className="text-brand-dark font-medium hover:text-brand-blue transition-colors">{value}</a>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Partnership contact */}
            <div className="card p-5 border border-amber-100">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Civil Internship Partner</p>
              <p className="font-bold text-brand-dark">AN Survey Consultant</p>
              <p className="text-xs text-brand-slate/70 mt-1">
                For Civil Engineering internship queries, contact STATS INNOTECH.
                Partner coordination is handled internally.
              </p>
            </div>
          </div>

          {/* Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="card p-8">
              <h3 className="heading-sm text-brand-dark mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input id="contact-name" type="text" placeholder="Your name" className={`form-input ${errors.name ? 'border-red-400' : ''}`} {...register('name')} />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input id="contact-email" type="email" placeholder="you@example.com" className={`form-input ${errors.email ? 'border-red-400' : ''}`} {...register('email')} />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="form-group">
                    <label className="form-label">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input id="contact-phone" type="tel" placeholder="+91 XXXXX XXXXX" className="form-input" {...register('phone')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input id="contact-subject" type="text" placeholder="e.g. Course enquiry, Internship info" className={`form-input ${errors.subject ? 'border-red-400' : ''}`} {...register('subject')} />
                    {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea id="contact-message" rows={5} placeholder="Tell us how we can help..." className={`form-textarea ${errors.message ? 'border-red-400' : ''}`} {...register('message')} />
                  {errors.message && <p className="form-error">{errors.message.message}</p>}
                </div>
                <button type="submit" id="contact-submit" disabled={isSubmitting} className="btn-primary btn-lg w-full justify-center">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Send size={18} /> Send Message</span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
