import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Award, FileText, Shield, AlertTriangle, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDate } from '../utils';

const schema = z.object({
  certificateId: z.string().min(3, 'Enter a valid Certificate ID or Verification Code'),
});
type FormData = z.infer<typeof schema>;

// Mock verified certificate data
const MOCK_CERTIFICATES: Record<string, object> = {
  'SIT-CERT-501': {
    found: true,
    valid: true,
    type: 'CERTIFICATE',
    domain: 'COMPUTER_SCIENCE_ENGINEERING',
    studentName: 'Student Demo',
    program: 'Full Stack Web Development Internship',
    issuedAt: '2026-10-02T00:00:00Z',
    certificateNumber: 'STATS-2026-CSE-0849',
    expiresAt: null,
    verificationCode: 'SIT-CERT-501',
  },
  'SIT-OF-501': {
    found: true,
    valid: true,
    type: 'OFFER_LETTER',
    domain: 'COMPUTER_SCIENCE_ENGINEERING',
    studentName: 'Student Demo',
    program: 'Full Stack Web Developer Intern',
    issuedAt: '2026-09-24T00:00:00Z',
    certificateNumber: 'STATS/OL/2026/CSE/0104',
    expiresAt: null,
    verificationCode: 'SIT-OF-501',
  },
  'SIT2221': {
    found: true,
    valid: true,
    type: 'CERTIFICATE',
    domain: 'WEB_DEVELOPMENT',
    studentName: 'Tanushree Gaikwad',
    program: 'Web Development Internship',
    issuedAt: '2026-06-30T00:00:00Z',
    certificateNumber: 'SIT2221',
    expiresAt: null,
    verificationCode: 'VRF-SIT2221',
  },
  'SI-CERT-2024-001': {
    found: true,
    valid: true,
    type: 'CERTIFICATE',
    domain: 'COMPUTER_SCIENCE_ENGINEERING',
    studentName: 'Rohan Mehta',
    program: 'Web Development Internship',
    issuedAt: '2024-11-15T00:00:00Z',
    expiresAt: null,
    verificationCode: 'VRF-ABC123XY',
  },
  'VRF-ABC123XY': {
    found: true,
    valid: true,
    type: 'CERTIFICATE',
    domain: 'COMPUTER_SCIENCE_ENGINEERING',
    studentName: 'Rohan Mehta',
    program: 'Web Development Internship',
    issuedAt: '2024-11-15T00:00:00Z',
    expiresAt: null,
    verificationCode: 'VRF-ABC123XY',
  },
  'SI-OL-2024-001': {
    found: true,
    valid: true,
    type: 'OFFER_LETTER',
    domain: 'CIVIL_ENGINEERING',
    studentName: 'Arjun Singh',
    program: 'Civil Engineering Internship',
    issuedAt: '2024-10-01T00:00:00Z',
    expiresAt: null,
    verificationCode: 'VRF-CIVIL001',
  },
};

import { verificationService } from '../services/verificationService';

export default function CertificateVerificationPage() {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<null | { found: boolean; valid?: boolean; data?: any }>(null);
  const [searched, setSearched] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const query = data.certificateId.trim().toUpperCase();
    try {
      const res = await verificationService.verifyCertificate(query);
      if (res && (res.verified || res.studentName || res.verificationCode)) {
        const isValid = res.verified !== false && res.status !== 'REVOKED';
        setResult({
          found: true,
          valid: isValid,
          data: {
            ...res,
            valid: isValid,
            type: res.type || 'CERTIFICATE',
            domain: res.domain || 'COMPUTER_SCIENCE_ENGINEERING',
            studentName: res.studentName,
            program: res.programTitle,
            issuedAt: res.issueDate,
            verificationCode: res.verificationCode,
            certificateNumber: res.certificateNumber,
            grade: res.grade,
            partnerName: res.partnerName,
          },
        });
      } else {
        const cert = (MOCK_CERTIFICATES as any)[query];
        if (cert) {
          const isMockValid = cert.valid !== false;
          setResult({ found: true, valid: isMockValid, data: { ...cert, valid: isMockValid } });
        } else {
          setResult({ found: false });
        }
      }
    } catch {
      const cert = (MOCK_CERTIFICATES as any)[query];
      if (cert) {
        const isMockValid = cert.valid !== false;
        setResult({ found: true, valid: isMockValid, data: { ...cert, valid: isMockValid } });
      } else {
        setResult({ found: false });
      }
    }
    setSearched(true);
  };

  useEffect(() => {
    const urlId = searchParams.get('id') || searchParams.get('code');
    if (urlId) {
      setValue('certificateId', urlId);
      onSubmit({ certificateId: urlId });
    }
  }, [searchParams]);

  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CERTIFICATE: 'Internship Certificate',
      OFFER_LETTER: 'Offer Letter',
      COMPLETION_LETTER: 'Completion Letter',
    };
    return labels[type] || type;
  };

  const getDomainLabel = (domain: string) => {
    const labels: Record<string, string> = {
      COMPUTER_SCIENCE_ENGINEERING: 'Computer Science & Engineering',
      CIVIL_ENGINEERING: 'Civil Engineering',
      WEB_DEVELOPMENT: 'Web Development',
      COURSE: 'Course Certificate',
    };
    return labels[domain] || domain;
  };

  const isDocValid = Boolean(result?.data?.valid ?? result?.valid);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="page-hero">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="container-xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Shield size={30} className="text-white" />
            </div>
            <div className="section-tag border border-white/20 bg-white/10 text-white/90 mx-auto w-fit mb-6">
              <CheckCircle size={14} /> Verification Portal
            </div>
            <h1 className="heading-xl text-white mb-4">Certificate Verification</h1>
            <p className="body-lg text-white/70 max-w-2xl mx-auto">
              Verify the authenticity of any certificate, offer letter, or completion letter issued by STATS INNOTECH.
              Enter the Certificate ID or Verification Code below.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Verification Form */}
      <div className="container-md py-12 sm:py-16 md:py-20 pb-24 sm:pb-28 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card p-8 mb-8"
        >
          <h2 className="heading-sm text-brand-dark text-center mb-6">Enter Certificate Details</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto">
            <div className="form-group mb-4">
              <label className="form-label" htmlFor="cert-id">
                Certificate ID or Verification Code
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="cert-id"
                  type="text"
                  placeholder="e.g. SIT-CERT-501 or SIT-OF-501"
                  className={`form-input pl-10 text-center font-mono uppercase ${errors.certificateId ? 'border-red-400' : ''}`}
                  {...register('certificateId')}
                />
              </div>
              {errors.certificateId && <p className="form-error justify-center">{errors.certificateId.message}</p>}
            </div>

            <button
              type="submit"
              id="verify-submit"
              disabled={isSubmitting}
              className="btn-primary w-full btn-lg justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield size={18} /> Verify Document
                </span>
              )}
            </button>
          </form>

          {/* Demo IDs */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl max-w-lg mx-auto">
            <p className="text-xs font-semibold text-blue-700 mb-2">Example Verification Codes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-xs text-blue-600">
              <span className="cursor-pointer hover:underline" onClick={() => { setValue('certificateId', 'SIT-CERT-501'); onSubmit({ certificateId: 'SIT-CERT-501' }); }}>
                📌 SIT-CERT-501 (Certificate)
              </span>
              <span className="cursor-pointer hover:underline" onClick={() => { setValue('certificateId', 'SIT-OF-501'); onSubmit({ certificateId: 'SIT-OF-501' }); }}>
                📌 SIT-OF-501 (Offer Letter)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Result */}
        {searched && result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {result.found && result.data ? (
              <div className={`card p-8 border-2 ${isDocValid ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex flex-col items-center text-center mb-8">
                  {isDocValid ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle size={40} className="text-green-500" />
                      </div>
                      <h3 className="text-2xl font-black text-green-700 mb-2">Document Verified ✓</h3>
                      <p className="text-green-600/80 text-sm">
                        This document is authentic and was issued by STATS INNOTECH.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <XCircle size={40} className="text-red-500" />
                      </div>
                      <h3 className="text-2xl font-black text-red-700 mb-2">Document Invalid</h3>
                      <p className="text-red-600/80 text-sm">This document has been revoked or is no longer valid.</p>
                    </>
                  )}
                </div>

                {/* Document Details */}
                <div className="bg-gray-50 rounded-2xl p-6 max-w-lg mx-auto">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                      {result.data.type === 'CERTIFICATE' ? (
                        <Award size={20} className="text-brand-blue" />
                      ) : (
                        <FileText size={20} className="text-brand-blue" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark">{getDocTypeLabel(result.data.type)}</p>
                      <p className="text-xs text-brand-slate">{getDomainLabel(result.data.domain)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Holder Name', value: result.data.studentName },
                      { label: 'Program', value: result.data.program },
                      { label: 'Domain', value: getDomainLabel(result.data.domain) },
                      { label: 'Issue Date', value: formatDate(result.data.issuedAt) },
                      { label: 'Document Type', value: getDocTypeLabel(result.data.type) },
                      { label: 'Verification Code', value: result.data.verificationCode },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-4">
                        <span className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide shrink-0">{label}</span>
                        <span className="text-sm font-medium text-brand-dark text-right font-mono">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">
                      Verified by STATS INNOTECH Certification Authority
                    </p>
                    <a
                      href={
                        result.data.type === 'OFFER_LETTER'
                          ? `/api/documents/offer-letter/download?ref=${encodeURIComponent(result.data.verificationCode || result.data.certificateNumber || '')}`
                          : `/api/documents/certificate/download?certNo=${encodeURIComponent(result.data.certificateNumber || result.data.verificationCode || '')}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary btn-sm flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                    >
                      <Download size={14} /> Download Verified Document
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-8 border-2 border-red-200 text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <XCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-red-700 mb-2">Not Found</h3>
                <p className="text-red-600/80 text-sm max-w-md mx-auto">
                  No document found with the provided ID or verification code. Please check the ID and try again.
                </p>
                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl max-w-md mx-auto">
                  <div className="flex items-start gap-2 text-sm text-amber-700">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <p>
                      If you believe this is an error, please contact us at{' '}
                      <strong>info@statsinnotech.com</strong> with the certificate details.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}


        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            {
              icon: Award,
              title: 'CSE Certificate',
              description: 'Issued to students who successfully complete Computer Science internship programs.',
              color: 'text-brand-blue bg-brand-blue/10',
            },
            {
              icon: FileText,
              title: 'Offer Letter',
              description: 'Issued upon internship approval — official 2-page template for all domains.',
              color: 'text-amber-600 bg-amber-100',
            },
            {
              icon: CheckCircle,
              title: 'Completion Letter',
              description: 'Issued to Civil Engineering students upon successful completion with AN Survey Consultant.',
              color: 'text-green-600 bg-green-100',
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon size={22} />
              </div>
              <h4 className="font-bold text-brand-dark mb-2">{item.title}</h4>
              <p className="text-sm text-brand-slate/70 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
