import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, Download, Clock, CheckCircle, AlertCircle,
  ArrowRight, Shield, Loader2
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import type { Certificate } from '../../types';
import { formatDateShort } from '../../utils';

export default function PortalCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadCertificates() {
      try {
        setIsLoading(true);
        const data = await studentService.getCertificates();
        if (mounted) {
          setCerts(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Failed to load certificates:', err);
          setError(err?.response?.data?.message || 'Failed to load certificates');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadCertificates();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-brand-slate">Loading your credentials...</p>
      </div>
    );
  }

  const filtered = certs.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.certificateNumber.toLowerCase().includes(q) ||
      c.verificationCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark">Certificates & Credentials</h1>
          <p className="text-sm text-brand-slate mt-1">
            Verified internship completion and course completion credentials issued by STATS INNOTECH.
          </p>
        </div>
        <Link
          to="/verify-certificate"
          className="btn btn-sm bg-white hover:bg-slate-50 border border-slate-200 text-brand-dark text-xs self-start flex items-center gap-1.5 shadow-sm"
        >
          <Shield size={14} className="text-brand-blue" /> Public Verification
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      {/* Hero Banner */}
      <div className="rounded-2xl p-5 flex gap-4 text-white shadow-md relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 100%)' }}>
        <div className="bg-grid absolute inset-0 opacity-15" />
        <Award size={24} className="text-cyan-300 shrink-0 mt-0.5 relative" />
        <div className="relative">
          <p className="font-bold text-sm">Official Tamper-Evident Credentials</p>
          <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
            Your certificates are uploaded by administrators upon verified program completion. You can download the official document directly below and verify it using your Certificate ID.
          </p>
        </div>
      </div>

      {/* Certificates List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((cert) => {
            const hasDocument = Boolean(cert.pdfPath);

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 sm:p-6 hover:shadow-md transition-shadow border-l-4 border-l-brand-blue"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                      <Award size={24} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="badge-green text-xs font-bold px-2 py-0.5 flex items-center gap-1">
                          <CheckCircle size={11} /> {cert.status || 'VERIFIED'}
                        </span>
                        <span className="badge-blue text-xs font-semibold">{cert.type}</span>
                        {cert.grade && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            ★ {cert.grade}
                          </span>
                        )}
                        {cert.partnerName && (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            Partner: {cert.partnerName}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-brand-dark text-base">{cert.title}</h3>
                      <p className="text-xs text-brand-slate mt-1 flex items-center gap-1">
                        <Clock size={12} /> Issued on: {formatDateShort(cert.issueDate || cert.createdAt || new Date().toISOString())}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2.5 font-mono text-xs">
                        <span className="text-slate-500">Cert ID: {cert.certificateNumber}</span>
                        <Link
                          to={`/verify-certificate?id=${cert.certificateNumber}`}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 transition-colors flex items-center gap-1"
                          title="Click to test verification"
                        >
                          🔑 {cert.verificationCode}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-center">
                    {hasDocument ? (
                      <a
                        href={`/api/documents/certificates/${cert.id}/download`}
                        download
                        className="btn-primary btn-sm text-xs flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Download size={14} /> Download Certificate
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
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Award size={28} />
          </div>
          <h3 className="font-bold text-brand-dark mb-1">
            {search ? `No certificates matching "${search}"` : 'No Certificates Issued Yet'}
          </h3>
          <p className="text-sm text-brand-slate/70 max-w-sm mx-auto mb-6">
            Complete your technical internship milestones or curriculum modules to earn verified certificates.
          </p>
          {!search && (
            <Link to="/internships" className="btn-primary btn-sm inline-flex">
              Explore Programs <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
