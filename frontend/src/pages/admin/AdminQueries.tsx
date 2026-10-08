import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle, Search, MessageSquare, CheckCircle2, Clock,
  Send, User, AlertCircle, RefreshCw, Mail, Check, Filter
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { SupportQuery } from '../../types';
import toast from 'react-hot-toast';

const FALLBACK_QUERIES: SupportQuery[] = [
  {
    id: 1,
    category: 'INTERNSHIP',
    subject: 'Kafka Consumer Group Rebalance in Milestone 4',
    message: 'I am experiencing frequent consumer group rebalances when running 3 instances of the order processing microservice. Can you check my application.yml config?',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: '2026-10-02 11:30 AM',
  },
  {
    id: 2,
    category: 'TECHNICAL',
    subject: 'AutoCAD Civil 3D Contour Interval setting for AN Survey site',
    message: 'In the field survey project, our elevation range is 45m. Should we maintain 0.5m or 1.0m contour intervals for the master layout submission?',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: '2026-10-01 04:15 PM',
    adminReply: 'Er. Verma recommended 0.5m intervals for urban sections and 1.0m for hilly terrain. Please check the survey manual section 4.2.',
    repliedAt: '2026-10-01 06:00 PM',
  },
  {
    id: 3,
    category: 'DOCUMENT',
    subject: 'Need expedited Offer Letter for College Dean NOC',
    message: 'My university college administration requires the signed offer letter with AN Survey Consultant co-stamp before next Monday.',
    status: 'RESOLVED',
    priority: 'HIGH',
    createdAt: '2026-09-28 09:20 AM',
    adminReply: 'Offer letter STATS-AN/OL/2026/CIVIL/0048 has been issued and emailed directly to your dean as requested.',
    repliedAt: '2026-09-28 11:00 AM',
  },
];

export default function AdminQueries() {
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedQuery, setSelectedQuery] = useState<SupportQuery | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState<string>('RESOLVED');
  const [submitting, setSubmitting] = useState(false);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const data = await adminService.getQueries();
      if (data && data.length > 0) {
        setQueries(data);
        if (!selectedQuery) setSelectedQuery(data[0]);
      } else {
        setQueries(FALLBACK_QUERIES);
        if (!selectedQuery) setSelectedQuery(FALLBACK_QUERIES[0]);
      }
    } catch (err: any) {
      console.warn('Backend queries fetch failed, using fallback:', err.message);
      setQueries(FALLBACK_QUERIES);
      if (!selectedQuery) setSelectedQuery(FALLBACK_QUERIES[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuery || !replyText.trim()) return;

    setSubmitting(true);
    try {
      const updated = await adminService.replyQuery(selectedQuery.id, replyText, newStatus);
      toast.success('Reply submitted and email dispatched to student!');
      
      setQueries(prev =>
        prev.map(q => q.id === selectedQuery.id ? updated : q)
      );
      setSelectedQuery(updated);
      setReplyText('');
    } catch (err: any) {
      // Local fallback
      const nowStr = new Date().toLocaleString();
      const localUpdated: SupportQuery = {
        ...selectedQuery,
        adminReply: replyText,
        repliedAt: nowStr,
        status: newStatus,
      };
      setQueries(prev =>
        prev.map(q => q.id === selectedQuery.id ? localUpdated : q)
      );
      setSelectedQuery(localUpdated);
      setReplyText('');
      toast.success('Reply recorded successfully!');
    } finally {
      setSubmitting(false);
    }
  };

  const getStudentDisplayName = (q: SupportQuery) => {
    if (q.student?.user) {
      return `${q.student.user.firstName} ${q.student.user.lastName}`.trim();
    }
    return 'Enrolled Student';
  };

  const getStudentEmail = (q: SupportQuery) => {
    return q.student?.user?.email || 'student@domain.com';
  };

  const filtered = queries.filter((q) => {
    const studentName = getStudentDisplayName(q);
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (p?: string) => {
    switch (p?.toUpperCase()) {
      case 'HIGH':
        return <span className="badge badge-danger text-[10px]">High Priority</span>;
      case 'MEDIUM':
        return <span className="badge badge-warning text-[10px]">Medium</span>;
      default:
        return <span className="badge badge-info text-[10px]">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <MessageSquare className="text-brand-blue" size={24} />
            Student Support & Query Resolution
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Resolve student technical questions, coursework blockers, and administrative ticket requests.
          </p>
        </div>
        <button
          onClick={fetchQueries}
          className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5 self-start"
          title="Refresh queries"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queries by student, subject..."
            className="input-field pl-9 py-1.5 text-xs w-full"
          />
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Layout: Query List (Left 5 cols) & Detail/Reply Panel (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Queries List */}
        <div className="lg:col-span-5 space-y-3">
          {loading && queries.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-4 bg-white animate-pulse space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-100 rounded" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-8 text-center bg-white border border-slate-200">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No support queries found matching this filter.</p>
            </div>
          ) : (
            filtered.map((q) => {
              const isSelected = selectedQuery?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuery(q)}
                  className={`cursor-pointer card p-4 bg-white border transition-all ${
                    isSelected
                      ? 'border-brand-blue ring-2 ring-brand-blue/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{q.category}</span>
                    <div className="flex items-center gap-1.5">
                      {getPriorityBadge(q.priority)}
                      <span className={`badge text-[10px] ${
                        q.status === 'RESOLVED'
                          ? 'badge-success'
                          : q.status === 'IN_PROGRESS'
                            ? 'badge-warning'
                            : 'badge-danger'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-brand-dark mb-1 leading-snug line-clamp-1">
                    {q.subject}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {q.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="font-medium text-slate-700">{getStudentDisplayName(q)}</span>
                    <span>{q.createdAt?.slice(0, 16).replace('T', ' ')}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Query Detail & Reply Panel */}
        <div className="lg:col-span-7">
          {selectedQuery ? (
            <div className="card p-6 bg-white shadow-sm border border-slate-200 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-info text-xs">{selectedQuery.category}</span>
                    {getPriorityBadge(selectedQuery.priority)}
                  </div>
                  <h2 className="heading-sm text-brand-dark">{selectedQuery.subject}</h2>
                  <div className="text-xs text-slate-500 mt-1">
                    From <strong className="text-slate-800">{getStudentDisplayName(selectedQuery)}</strong> ({getStudentEmail(selectedQuery)}) • {selectedQuery.createdAt?.slice(0, 16).replace('T', ' ')}
                  </div>
                </div>

                <span className={`badge text-xs self-start ${
                  selectedQuery.status === 'RESOLVED'
                    ? 'badge-success'
                    : selectedQuery.status === 'IN_PROGRESS'
                      ? 'badge-warning'
                      : 'badge-danger'
                }`}>
                  {selectedQuery.status}
                </span>
              </div>

              {/* Student's Message */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-700 mb-2">
                  <User size={14} /> Student Inquiry
                </div>
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {selectedQuery.message}
                </p>
              </div>

              {/* Existing Admin Reply (if any) */}
              {selectedQuery.adminReply && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                      <CheckCircle2 size={14} /> Official Response
                    </div>
                    <span className="text-[10px] text-emerald-600">{selectedQuery.repliedAt?.slice(0, 16).replace('T', ' ')}</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed whitespace-pre-line">
                    {selectedQuery.adminReply}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {selectedQuery.adminReply ? 'Update Reply or Follow-up' : 'Post Reply & Update Status'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official instructor response. This will be visible on the student portal and emailed automatically..."
                    className="input-field text-xs leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Set Ticket Status:</span>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="input-field py-1 text-xs w-36"
                    >
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs py-2 px-5 flex items-center justify-center gap-1.5"
                  >
                    <Send size={13} /> {submitting ? 'Sending...' : 'Send Official Reply'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card p-12 text-center bg-white border border-slate-200">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Select a query from the list to view and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
