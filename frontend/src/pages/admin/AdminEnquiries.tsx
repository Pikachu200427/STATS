import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Search, CheckCircle, Trash2, Eye,
  RefreshCw, X, MessageSquare, Phone, Clock
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { ContactEnquiry } from '../../types';
import toast from 'react-hot-toast';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await adminService.getEnquiries();
      setEnquiries(data);
    } catch {
      toast.error('Failed to load inquiries from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleMarkRead = async (enquiry: ContactEnquiry) => {
    try {
      const updated = await adminService.markEnquiryRead(enquiry.id);
      setEnquiries((prev) => prev.map((e) => (e.id === enquiry.id ? updated : e)));
      toast.success('Inquiry marked as read');
    } catch {
      toast.error('Failed to update inquiry');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await adminService.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      toast.success('Inquiry deleted');
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    } catch {
      toast.error('Failed to delete inquiry');
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <Mail size={22} className="text-brand-blue" /> Contact & Project Enquiries
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Incoming prospective student queries, corporate training requests, and startup software inquiries
          </p>
        </div>
        <button
          onClick={loadEnquiries}
          disabled={loading}
          className="btn-secondary btn-sm flex items-center gap-1.5"
          title="Refresh database"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by sender name, email, subject, or message content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading live inquiries...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No inquiries currently found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((e) => (
              <div
                key={e.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-bold text-brand-dark text-sm">{e.name}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{e.email}</span>
                    {e.phone && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Phone size={11} /> {e.phone}
                        </span>
                      </>
                    )}
                  </div>
                  <h4 className="font-semibold text-xs text-brand-blue mb-1">{e.subject || 'General Inquiry'}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{e.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      setSelectedEnquiry(e);
                      if (!(e as any).read) handleMarkRead(e);
                    }}
                    className="btn-secondary btn-sm flex items-center gap-1"
                  >
                    <Eye size={13} /> View
                  </button>
                  <a
                    href={`mailto:${e.email}?subject=Re: ${encodeURIComponent(e.subject || 'STATS INNOTECH Inquiry')}`}
                    className="btn-primary btn-sm flex items-center gap-1"
                  >
                    <Mail size={13} /> Reply
                  </a>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspection Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">{selectedEnquiry.subject || 'Contact Inquiry'}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">From {selectedEnquiry.name}</p>
                </div>
                <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sender Name:</span>
                    <strong className="text-slate-800">{selectedEnquiry.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email Address:</span>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-brand-blue hover:underline">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  {selectedEnquiry.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone Number:</span>
                      <span className="text-slate-800 font-mono">{selectedEnquiry.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Message Content</label>
                  <div className="p-4 bg-slate-50 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                    {selectedEnquiry.message}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => setSelectedEnquiry(null)} className="btn-secondary btn-sm">
                  Close
                </button>
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.subject || 'STATS INNOTECH')}`}
                  className="btn-primary btn-sm flex items-center gap-1.5"
                >
                  <Mail size={14} /> Send Email Reply
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
