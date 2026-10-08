import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Plus, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  ArrowRight, X, Send, Loader2, Sparkles, HelpCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { studentService } from '../../services/studentService';
import type { SupportQuery } from '../../types';
import { formatDateShort } from '../../utils';

const schema = z.object({
  category: z.string().min(1, 'Select a query category'),
  priority: z.string().min(1, 'Select priority'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(15, 'Message must be at least 15 characters'),
});
type FormData = z.infer<typeof schema>;


const CATEGORIES = [
  { value: 'INTERNSHIP', label: 'Internship & Cohort' },
  { value: 'COURSE', label: 'Course Curriculum & Access' },
  { value: 'DOCUMENTS', label: 'Offer Letter & Certificate' },
  { value: 'PAYMENT', label: 'Payment & Stipend Inquiries' },
  { value: 'TECHNICAL', label: 'Technical / Lab Environment' },
  { value: 'OTHER', label: 'General Assistance' },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'RESOLVED') {
    return (
      <span className="badge-green text-xs font-bold px-2.5 py-0.5 flex items-center gap-1">
        <CheckCircle size={11} /> Resolved
      </span>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <span className="badge-amber text-xs font-bold px-2.5 py-0.5 flex items-center gap-1">
        <Clock size={11} /> In Progress
      </span>
    );
  }
  return (
    <span className="badge-blue text-xs font-bold px-2.5 py-0.5 flex items-center gap-1">
      <AlertCircle size={11} /> Open
    </span>
  );
}

export default function PortalQueries() {
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'new'>('list');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'INTERNSHIP',
      priority: 'MEDIUM',
      subject: '',
      message: '',
    },
  });

  const loadQueries = async () => {
    try {
      setIsLoading(true);
      const data = await studentService.getQueries();
      setQueries(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load queries:', err);
      setError(err?.response?.data?.message || 'Failed to load support queries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const created = await studentService.submitQuery({
        category: data.category,
        subject: data.subject,
        message: data.message,
        priority: data.priority,
      });
      toast.success('Your query was submitted successfully! Our tech support will respond promptly. 📬');
      setQueries([created, ...queries]);
      setExpandedId(created.id);
      reset();
      setView('list');
    } catch (err: any) {
      console.error('Failed to submit query:', err);
      toast.error(err?.response?.data?.message || 'Failed to submit query. Please try again.');
    }
  };

  const handleQuickTopic = (topic: string, cat: string) => {
    setValue('subject', topic);
    setValue('category', cat);
    setView('new');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark">Support & Help Desk</h1>
          <p className="text-sm text-brand-slate mt-1">
            Direct communication channel with technical mentors, admins, and support coordinators.
          </p>
        </div>
        <button
          onClick={() => setView(view === 'new' ? 'list' : 'new')}
          className={`btn btn-sm self-start ${view === 'new' ? 'btn-ghost' : 'btn-primary'}`}
        >
          {view === 'new' ? (
            <><X size={15} /> Cancel</>
          ) : (
            <><Plus size={15} /> New Ticket</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      {/* New Query Form */}
      <AnimatePresence>
        {view === 'new' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card p-6 shadow-md border-brand-blue/30"
          >
            <h2 className="font-bold text-brand-dark mb-4 flex items-center gap-2 text-base">
              <MessageSquare size={18} className="text-brand-blue" /> Submit a Technical or Support Ticket
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label text-xs">Category *</label>
                  <select className={`form-input form-select text-xs ${errors.category ? 'border-red-400' : ''}`} {...register('category')}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {errors.category && <p className="form-error text-[11px]">{errors.category.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Priority</label>
                  <select className="form-input form-select text-xs" {...register('priority')}>
                    <option value="LOW">Low (General question)</option>
                    <option value="MEDIUM">Medium (Standard request)</option>
                    <option value="HIGH">High (Urgent blocker / submission)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Subject / Issue Summary *</label>
                <input
                  type="text"
                  placeholder="e.g. Question regarding Kafka Consumer Milestone or Offer Letter verification"
                  className={`form-input text-xs ${errors.subject ? 'border-red-400' : ''}`}
                  {...register('subject')}
                />
                {errors.subject && <p className="form-error text-[11px]">{errors.subject.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Detailed Description *</label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue with code snippets, error messages, or questions in detail..."
                  className={`form-input resize-none text-xs ${errors.message ? 'border-red-400' : ''}`}
                  {...register('message')}
                />
                {errors.message && <p className="form-error text-[11px]">{errors.message.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="btn btn-sm btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary btn-sm text-xs">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting Ticket...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Send size={14} /> Submit Ticket
                    </span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Queries */}
      <div className="space-y-3">
        <h2 className="font-bold text-brand-dark text-sm flex items-center gap-2">
          <MessageSquare size={16} className="text-brand-blue" /> Your Active & Past Tickets ({queries.length})
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            <p className="text-xs">Loading support tickets...</p>
          </div>
        ) : queries.length > 0 ? (
          <div className="space-y-3">
            {queries.map((q) => {
              const isExpanded = expandedId === q.id;
              const catObj = CATEGORIES.find(c => c.value === q.category);
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-5 hover:border-brand-blue/30 transition-all duration-200 cursor-pointer shadow-sm"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <StatusBadge status={q.status} />
                        <span className="badge-blue text-xs font-semibold">
                          {catObj?.label || q.category}
                        </span>
                        {q.priority && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            q.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {q.priority}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto sm:ml-0">
                          {formatDateShort(q.createdAt)}
                        </span>
                      </div>

                      <h3 className="font-bold text-brand-dark text-sm">{q.subject}</h3>

                      {/* Snippet / Expanded Details */}
                      <p className={`text-xs text-slate-600 mt-1 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {q.message}
                      </p>

                      {/* Admin Response Thread */}
                      {q.adminReply && (
                        <div className="mt-3.5 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-emerald-900 font-bold text-[11px]">
                            <span className="flex items-center gap-1.5">
                              💬 Academic & Tech Coordinator Response
                            </span>
                            {q.repliedAt && (
                              <span className="font-normal text-emerald-700 text-[10px]">
                                {formatDateShort(q.repliedAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-emerald-950 font-sans leading-relaxed pt-1">
                            {q.adminReply}
                          </p>
                        </div>
                      )}
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1 shrink-0">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <MessageSquare size={32} className="text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-brand-dark mb-1">No Support Tickets Yet</h3>
            <p className="text-xs text-brand-slate max-w-sm mx-auto mb-4">
              Have questions regarding course access, internship start dates, or document verification? Submit your ticket anytime.
            </p>
            <button onClick={() => setView('new')} className="btn-primary btn-sm inline-flex">
              <Plus size={14} /> Submit Query
            </button>
          </div>
        )}
      </div>

      {/* Quick Help Topics */}
      <div className="card p-6 shadow-sm">
        <h3 className="font-bold text-brand-dark mb-3 text-sm flex items-center gap-2">
          <HelpCircle size={15} className="text-brand-blue" /> Frequently Asked Questions & Quick Help
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { text: 'How do I download and print my internship offer letter?', cat: 'DOCUMENTS' },
            { text: 'When will I receive my milestone completion certificate?', cat: 'DOCUMENTS' },
            { text: 'How do third-party recruiters verify my credentials?', cat: 'DOCUMENTS' },
            { text: 'How to request a change in internship project batch?', cat: 'INTERNSHIP' },
          ].map((topic) => (
            <button
              key={topic.text}
              onClick={() => handleQuickTopic(topic.text, topic.cat)}
              className="flex items-center gap-2 p-3 text-left rounded-xl text-xs text-brand-slate hover:text-brand-blue hover:bg-blue-50/50 border border-slate-100 transition-colors"
            >
              <ArrowRight size={13} className="text-brand-blue shrink-0" />
              <span>{topic.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

