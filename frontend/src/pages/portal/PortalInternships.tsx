import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase, Clock, MapPin, CheckCircle, ArrowRight, Building2,
  FileText, Award, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import type { InternshipApplication } from '../../types';
import { formatDateShort } from '../../utils';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Under Review', class: 'bg-amber-100 text-amber-800 border-amber-200' },
  APPROVED: { label: 'Approved ✓', class: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  REJECTED: { label: 'Not Selected', class: 'bg-rose-100 text-rose-800 border-rose-200' },
  ACTIVE: { label: 'Active', class: 'bg-blue-100 text-blue-800 border-blue-200' },
  COMPLETED: { label: 'Completed', class: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function PortalInternships() {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDomain, setFilterDomain] = useState<'ALL' | 'CSE' | 'CIVIL'>('ALL');

  useEffect(() => {
    let mounted = true;
    async function loadApplications() {
      try {
        setIsLoading(true);
        const data = await studentService.getApplications();
        if (mounted) {
          setApplications(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Failed to load applications:', err);
          setError(err?.response?.data?.message || 'Failed to load internship applications');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadApplications();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-brand-slate">Loading your internship applications...</p>
      </div>
    );
  }

  const filtered = applications.filter((app) => {
    if (filterDomain === 'ALL') return true;
    const domain = app.internship?.domain || 'CSE';
    return domain.toUpperCase() === filterDomain;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark">My Internships</h1>
          <p className="text-sm text-brand-slate mt-1">
            {applications.length} submitted application{applications.length !== 1 ? 's' : ''} across CSE and Civil Engineering.
          </p>
        </div>
        <Link to="/internships" className="btn-primary btn-sm self-start">
          <Briefcase size={15} /> Apply for Internship
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'CSE', 'CIVIL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterDomain(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterDomain === tab
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'ALL' ? 'All Tracks' : tab === 'CSE' ? '💻 CSE / IT' : '🏗️ Civil Engineering'}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((app, i) => {
            const intern = app.internship;
            const isCivil = intern?.domain === 'CIVIL';
            const isApproved = app.status === 'APPROVED';

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`card p-6 border-l-4 ${isCivil ? 'border-l-amber-500' : 'border-l-brand-blue'} shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isCivil ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'}`}>
                    {isCivil ? (
                      <Building2 size={26} />
                    ) : (
                      <Briefcase size={26} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`badge text-xs font-bold border px-2.5 py-0.5 ${STATUS_MAP[app.status]?.class || 'bg-slate-100 text-slate-700'}`}>
                        {STATUS_MAP[app.status]?.label || app.status}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isCivil ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                        {intern?.domain || 'CSE'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {app.applicationId}
                      </span>
                    </div>

                    <h3 className="font-bold text-brand-dark text-lg">
                      {intern?.title || 'Industrial Internship'}
                    </h3>

                    {intern?.shortDescription && (
                      <p className="text-xs text-brand-slate mt-1 line-clamp-2">
                        {intern.shortDescription}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-brand-slate/70">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={12} /> Duration: {app.preferredDuration || intern?.duration || '8 Weeks'}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin size={12} /> Mode: {app.preferredMode || intern?.mode || 'Remote Online'}
                      </span>
                      <span className="flex items-center gap-1">
                        Applied: {formatDateShort(app.appliedAt)}
                      </span>
                      {app.reviewedAt && (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          Reviewed: {formatDateShort(app.reviewedAt)}
                        </span>
                      )}
                    </div>

                    {/* Stipend Details */}
                    {intern?.stipendAmount && (
                      <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center gap-2">
                        <Sparkles size={13} className="text-amber-500 shrink-0" />
                        <span><strong>Grant / Stipend:</strong> {intern.stipendAmount}</span>
                      </div>
                    )}

                    {/* Documents Ready Status */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-100">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${isApproved ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {isApproved ? <CheckCircle size={14} className="text-emerald-600" /> : <Clock size={14} />}
                        Offer Letter {isApproved ? 'Generated & Ready' : 'Pending Review'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Award size={14} className="text-amber-500" />
                        Completion Certificate (Issued on milestone completion)
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 self-start sm:self-center">
                    {isApproved && (
                      <Link
                        to="/portal/offer-letters"
                        className="btn-primary btn-sm flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <FileText size={14} /> View Offer Letter
                      </Link>
                    )}
                    <Link
                      to={`/internships/${intern?.slug || ''}`}
                      className="btn btn-sm bg-white hover:bg-slate-50 border border-slate-200 text-brand-dark text-xs flex items-center justify-center gap-1"
                    >
                      Track Details <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4 text-cyan-600">
            <Briefcase size={28} />
          </div>
          <h3 className="font-bold text-brand-dark mb-1">
            {filterDomain === 'ALL'
              ? 'No Internship Applications Yet'
              : `No ${filterDomain} Applications Found`}
          </h3>
          <p className="text-sm text-brand-slate/70 max-w-sm mx-auto mb-6">
            Apply for certified CSE and Civil Engineering industrial internships with live mentors.
          </p>
          <Link to="/internships" className="btn-primary btn-sm inline-flex">
            Explore Internships <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

