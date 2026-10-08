import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Download, CheckCircle, AlertCircle,
  ArrowRight, Shield, Clock, Loader2
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import type { OfferLetter } from '../../types';
import { formatDateShort } from '../../utils';

export default function PortalOfferLetters() {
  const [letters, setLetters] = useState<OfferLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CSE' | 'CIVIL'>('ALL');

  useEffect(() => {
    let mounted = true;
    async function loadLetters() {
      try {
        setIsLoading(true);
        const data = await studentService.getOfferLetters();
        if (mounted) {
          setLetters(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Failed to load offer letters:', err);
          setError(err?.response?.data?.message || 'Failed to load offer letters');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadLetters();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-brand-slate">Loading your offer letters...</p>
      </div>
    );
  }

  const filtered = letters.filter((l) => {
    if (activeTab === 'ALL') return true;
    return l.domain.toUpperCase() === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark">Internship Offer Letters</h1>
          <p className="text-sm text-brand-slate mt-1">
            Official verifiable appointment letters for enrolled technical internship cohorts.
          </p>
        </div>
        <Link to="/verify-certificate" className="btn btn-sm bg-white hover:bg-slate-50 border border-slate-200 text-brand-dark text-xs self-start flex items-center gap-1.5 shadow-sm">
          <Shield size={14} className="text-brand-blue" /> Verify Credential
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      {/* Info Banner */}
      <div className="rounded-2xl p-5 flex gap-4 text-white shadow-md relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 100%)' }}>
        <div className="bg-grid absolute inset-0 opacity-15" />
        <Shield size={24} className="text-cyan-300 shrink-0 mt-0.5 relative" />
        <div className="relative">
          <p className="font-bold text-sm">Official Institutional Appointment Letters</p>
          <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
            Your signed offer letter is uploaded by the administration and sent directly to your registered email. You can download the official document below anytime for college submission, NOC, and records.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'CSE', 'CIVIL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? tab === 'CIVIL'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-brand-blue text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab === 'ALL' ? 'All Offers' : tab === 'CIVIL' ? 'Civil Engineering' : 'CSE / Tech'}
          </button>
        ))}
      </div>

      {/* Letters List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((letter) => {
            const isCivil = letter.domain.toUpperCase() === 'CIVIL';
            const hasDocument = Boolean(letter.pdfPath);

            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 sm:p-6 hover:shadow-md transition-shadow border-l-4"
                style={{ borderLeftColor: isCivil ? '#F59E0B' : '#155EEF' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isCivil ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <FileText size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="badge-green text-xs font-bold px-2 py-0.5 flex items-center gap-1">
                          <CheckCircle size={11} /> {letter.status || 'ISSUED'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isCivil ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                          {letter.domain}
                        </span>
                        {letter.partnerName && (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            Partner: {letter.partnerName}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-brand-dark text-base">{letter.roleTitle}</h3>
                      <p className="text-xs text-brand-slate mt-0.5">
                        Program: <span className="font-medium text-slate-700">{letter.internship?.title || 'Industrial Internship'}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 font-mono">
                        <span>Ref: {letter.referenceNumber}</span>
                        {letter.verificationCode && (
                          <span className="text-brand-blue font-bold">· Code: {letter.verificationCode}</span>
                        )}
                        {letter.issuedDate && <span>· Issued: {formatDateShort(letter.issuedDate)}</span>}
                        {letter.startDate && <span>· Starts: {formatDateShort(letter.startDate)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-center">
                    {hasDocument ? (
                      <a
                        href={`/api/documents/offer-letters/${letter.id}/download`}
                        download
                        className={`btn btn-sm text-xs flex items-center justify-center gap-1.5 shadow-sm ${
                          isCivil ? 'bg-amber-500 text-white hover:bg-amber-600' : 'btn-primary'
                        }`}
                      >
                        <Download size={14} /> Download Offer Letter
                      </a>
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5">
                        <Clock size={13} className="shrink-0" />
                        <span>Document being uploaded by Admin</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-brand-blue">
            <FileText size={28} />
          </div>
          <h3 className="font-bold text-brand-dark mb-1">
            No {activeTab === 'CIVIL' ? 'Civil Engineering' : activeTab === 'CSE' ? 'CSE' : ''} Offer Letters Yet
          </h3>
          <p className="text-sm text-brand-slate/70 max-w-sm mx-auto mb-6">
            Your offer letter is issued upon application review and uploaded by the team.
          </p>
          <Link
            to="/internships"
            className="btn-primary btn-sm inline-flex"
          >
            Apply for Internship <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
