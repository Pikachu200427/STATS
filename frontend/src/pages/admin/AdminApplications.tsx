import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ClipboardList, Search, Filter, CheckCircle, XCircle, Clock,
  Eye, FileText, Briefcase, Building2, RefreshCw, X,
  ExternalLink, Send, ArrowRight
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { InternshipApplication } from '../../types';
import toast from 'react-hot-toast';

export default function AdminApplications() {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [reviewingApp, setReviewingApp] = useState<InternshipApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await adminService.getApplications();
      const sorted = [...data].sort((a, b) => {
        const timeA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
        const timeB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
        if (timeA && timeB && timeA !== timeB) return timeB - timeA;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
      setApplications(sorted);
    } catch {
      toast.error('Failed to load applications from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (id: number | string, newStatus: string, notes?: string) => {
    try {
      const updated = await adminService.reviewApplication(id, newStatus, notes);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success(`Application marked as ${newStatus}`);
      setReviewingApp(null);
      setReviewNotes('');
    } catch {
      toast.error('Failed to update application status');
    }
  };

  const filtered = applications.filter((a) => {
    const studentName = a.student?.user
      ? `${a.student.user.firstName} ${a.student.user.lastName}`
      : a.student?.studentId || '';
    const email = a.student?.user?.email || '';
    const program = a.internship?.title || '';
    const domain = a.internship?.domain || '';

    const matchSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      program.toLowerCase().includes(search.toLowerCase()) ||
      (a.applicationId || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchDomain = domainFilter === 'ALL' || domain.toUpperCase() === domainFilter.toUpperCase();

    return matchSearch && matchStatus && matchDomain;
  });

  const counts = {
    PENDING: applications.filter((a) => a.status === 'PENDING').length,
    APPROVED: applications.filter((a) => a.status === 'APPROVED').length,
    REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <ClipboardList size={22} className="text-brand-blue" /> Internship Candidate Applications
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Review applicant qualifications, Statement of Purpose, and issue official offer letters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadApplications}
            disabled={loading}
            className="btn-secondary btn-sm flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <Link to="/admin/offer-letters" className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm">
            <FileText size={14} /> Issue Offer Letter
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { status: 'PENDING', label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200/60' },
          { status: 'APPROVED', label: 'Accepted Candidates', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' },
          { status: 'REJECTED', label: 'Declined Submissions', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200/60' },
        ].map((item) => (
          <button
            key={item.status}
            onClick={() => setStatusFilter(statusFilter === item.status ? 'ALL' : item.status)}
            className={`p-4 rounded-xl border text-left transition-all ${item.bg} ${
              statusFilter === item.status ? 'ring-2 ring-brand-blue shadow-xs' : 'hover:shadow-xs'
            }`}
          >
            <div className={`text-2xl font-black ${item.color}`}>
              {counts[item.status as keyof typeof counts]}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, ID, email, or track..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input form-select min-w-[140px] text-xs"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="form-input form-select min-w-[140px] text-xs"
          >
            <option value="ALL">All Domains</option>
            <option value="CSE">CSE Tracks</option>
            <option value="CIVIL">Civil Surveying</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading candidate applications...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No applications match current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Internship Program</th>
                  <th className="py-3.5 px-4">Domain</th>
                  <th className="py-3.5 px-4">Preferred Duration</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Decision Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => {
                  const studentName = a.student?.user
                    ? `${a.student.user.firstName} ${a.student.user.lastName}`
                    : a.student?.studentId || 'Applicant';
                  const initials = studentName.split(' ').map((n) => n[0]).join('').slice(0, 2);
                  const isCivil = (a.internship?.domain || '').toUpperCase() === 'CIVIL';

                  return (
                    <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-gradient-light text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-brand-dark text-sm leading-tight">{studentName}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {a.student?.user?.email || a.student?.studentId} • {a.student?.college || 'College'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{a.internship?.title || 'Program'}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">#{a.applicationId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCivil
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {isCivil ? 'CIVIL (AN Survey)' : 'CSE DOMAIN'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {a.preferredDuration || '2 Months'} ({a.preferredMode || 'Online'})
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            a.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : a.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {a.status === 'APPROVED' && <CheckCircle size={12} />}
                          {a.status === 'REJECTED' && <XCircle size={12} />}
                          {a.status === 'PENDING' && <Clock size={12} />}
                          {a.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setReviewingApp(a);
                              setReviewNotes(a.reviewNotes || '');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors flex items-center gap-1"
                          >
                            <Eye size={13} /> Review
                          </button>
                          {a.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(a.id, 'APPROVED')}
                                className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Quick Approve"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(a.id, 'REJECTED')}
                                className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                                title="Quick Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewingApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Candidate Evaluation</h3>
                  <p className="text-xs text-amber-300 font-mono mt-0.5">#{reviewingApp.applicationId}</p>
                </div>
                <button onClick={() => setReviewingApp(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto text-xs">
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student:</span>
                    <strong className="text-slate-800">
                      {reviewingApp.student?.user
                        ? `${reviewingApp.student.user.firstName} ${reviewingApp.student.user.lastName}`
                        : 'Student'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">College:</span>
                    <span className="text-slate-700">{reviewingApp.student?.college || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Program:</span>
                    <span className="text-slate-800 font-semibold">{reviewingApp.internship?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stipend Scheme:</span>
                    <span className="text-emerald-700 font-medium">
                      {reviewingApp.internship?.stipendAmount || 'Performance-based'}
                    </span>
                  </div>
                </div>

                {reviewingApp.statementOfPurpose && (
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Statement of Purpose / Pitch</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 leading-relaxed">
                      {reviewingApp.statementOfPurpose}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {reviewingApp.resumeUrl && (
                    <a
                      href={reviewingApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary btn-sm flex items-center gap-1.5"
                    >
                      <FileText size={13} /> View Resume <ExternalLink size={11} />
                    </a>
                  )}
                  {reviewingApp.githubUrl && (
                    <a
                      href={reviewingApp.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary btn-sm flex items-center gap-1.5"
                    >
                      <ExternalLink size={13} /> GitHub Profile
                    </a>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mentor Feedback & Administrative Review Notes
                  </label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Provide constructive feedback, interview remarks, or joining instructions..."
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => setReviewingApp(null)} className="btn-secondary btn-sm">
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(reviewingApp.id, 'REJECTED', reviewNotes)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(reviewingApp.id, 'APPROVED', reviewNotes)}
                    className="btn-primary btn-sm flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} /> Approve Candidate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
