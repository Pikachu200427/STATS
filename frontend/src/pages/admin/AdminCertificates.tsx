import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Plus, Search, Download, Send,
  X, RefreshCw, UploadCloud, FileCheck, Trash2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Certificate, Student } from '../../types';
import toast from 'react-hot-toast';

export default function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INTERNSHIP' | 'COURSE_COMPLETION'>('ALL');
  const [isIssueOpen, setIsIssueOpen] = useState(false);

  // Quick Upload / Replace modal state
  const [replaceModalCert, setReplaceModalCert] = useState<Certificate | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replaceSendEmail, setReplaceSendEmail] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [certType, setCertType] = useState('INTERNSHIP');
  const [certTitle, setCertTitle] = useState('Full Stack Web Development Internship');
  const [certDomain, setCertDomain] = useState('CSE');
  const [certGrade, setCertGrade] = useState('Grade A+ (Distinction)');
  const [manualFile, setManualFile] = useState<File | null>(null);
  const [sendEmailOnIssue, setSendEmailOnIssue] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const data = await adminService.getStudents();
      setStudents(data);
      return data;
    } catch (err) {
      console.error('Failed to load students:', err);
      toast.error('Failed to load students list');
      return [];
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [certsData, studentsData] = await Promise.allSettled([
        adminService.getCertificates(),
        adminService.getStudents(),
      ]);

      if (certsData.status === 'fulfilled') setCerts(certsData.value);
      if (studentsData.status === 'fulfilled') {
        setStudents(studentsData.value);
      } else {
        console.warn('Students load failed during init:', studentsData.reason);
      }
    } catch {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenIssueModal = async () => {
    setIsIssueOpen(true);
    if (students.length === 0) {
      await fetchStudents();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = certs.filter((c) => {
    const studentName = c.student?.user
      ? `${c.student.user.firstName || ''} ${c.student.user.lastName || ''}`.trim()
      : (c.student?.studentId || 'Student');
    const certNo = c.certificateNumber || '';
    const vCode = c.verificationCode || '';
    const title = c.title || '';

    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      certNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !certTitle) {
      toast.error('Student and certificate title are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const issued = await adminService.issueCertificate({
        studentId: selectedStudentId,
        type: certType,
        title: certTitle,
        domain: certDomain,
        grade: certGrade,
        file: manualFile || undefined,
        sendEmail: sendEmailOnIssue,
      });

      setCerts([issued, ...certs]);
      setIsIssueOpen(false);
      setManualFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (manualFile) {
        toast.success(`Custom certificate uploaded & emailed to student!`);
      } else {
        toast.success(`Certificate ${issued.certificateNumber} registered. You can upload the custom PDF document anytime.`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadReplacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceModalCert || !replaceFile) {
      toast.error('Please select a certificate file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const updated = await adminService.uploadCertificateDocument(
        replaceModalCert.id,
        replaceFile,
        replaceSendEmail
      );

      setCerts(certs.map((c) => (c.id === updated.id ? updated : c)));
      setReplaceModalCert(null);
      setReplaceFile(null);
      toast.success(`Certificate document uploaded successfully${replaceSendEmail ? ' and emailed to student' : ''}!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload certificate');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <Award size={22} className="text-brand-blue" /> Certificate Issuance & Upload Registry
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Upload custom designed certificates (PDF / Image) and dispatch directly to students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="btn-secondary btn-sm flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleOpenIssueModal}
            className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> Issue & Upload Certificate
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          {(['ALL', 'INTERNSHIP', 'COURSE_COMPLETION'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type === 'ALL' ? 'All Credentials' : type === 'INTERNSHIP' ? 'Internships' : 'Course Certs'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, Cert ID, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-9 py-1.5 text-xs w-full"
          />
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading certificate records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Award size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No certificates found</p>
            <p className="text-xs text-slate-400 mt-1">Click 'Issue & Upload Certificate' to upload your custom document.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap">Certificate ID</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Student Name</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Program Title</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Type</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Verification Code</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((c) => {
                  const studentName = c.student?.user
                    ? `${c.student.user.firstName || ''} ${c.student.user.lastName || ''}`.trim()
                    : (c.student?.studentId || 'Student');
                  const hasCustomFile = Boolean(c.pdfPath);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-dark whitespace-nowrap align-middle">
                        {c.certificateNumber}
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-bold text-slate-900 text-sm leading-tight">{studentName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{c.student?.user?.email || c.student?.studentId || 'Student Email'}</div>
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-semibold text-slate-800 leading-tight">{c.title}</div>
                        <div className="text-xs text-amber-600 font-medium mt-0.5">{c.grade || 'Verified Completion'}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                        <span className="badge-blue text-xs font-bold px-2.5 py-1 rounded-full">
                          {c.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap align-middle">
                        <span className="inline-flex items-center bg-blue-50 text-brand-blue px-2.5 py-1 rounded-md border border-blue-200 text-xs">
                          {c.verificationCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplaceModalCert(c);
                              setReplaceFile(null);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5 border border-emerald-200"
                            title="Upload / Replace Certificate"
                          >
                            <UploadCloud size={13} /> {hasCustomFile ? 'Replace File' : 'Upload File'}
                          </button>

                          {hasCustomFile ? (
                            <a
                              href={`/api/documents/certificates/${c.id}/download`}
                              download
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5 border border-blue-200"
                              title="Download Uploaded Certificate"
                            >
                              <Download size={13} /> Download
                            </a>
                          ) : (
                            <span
                              className="px-3 py-1.5 text-xs font-medium text-slate-300 cursor-not-allowed inline-flex items-center gap-1.5"
                              title="Upload a file first to enable download"
                            >
                              <Download size={13} /> Download
                            </span>
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

      {/* ═══════════════ ISSUE NEW CERTIFICATE MODAL ═══════════════ */}
      <AnimatePresence>
        {isIssueOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-brand-dark">Issue & Upload Certificate</h3>
                  <p className="text-xs text-slate-500">Attach your manually designed certificate PDF/Image</p>
                </div>
                <button onClick={() => setIsIssueOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleIssue} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">Select Student *</label>
                    <button
                      type="button"
                      onClick={() => fetchStudents()}
                      disabled={loadingStudents}
                      className="text-[11px] text-brand-blue hover:underline flex items-center gap-1 font-medium"
                    >
                      <RefreshCw size={11} className={loadingStudents ? 'animate-spin' : ''} />
                      {loadingStudents ? 'Refreshing...' : `Refresh students (${students.length})`}
                    </button>
                  </div>
                  <select
                    required
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="form-input form-select text-xs"
                    disabled={loadingStudents}
                  >
                    <option value="">
                      {loadingStudents
                        ? '⏳ Loading registered students...'
                        : students.length === 0
                        ? '⚠️ No students found in database'
                        : `-- Choose Recipient Student (${students.length} available) --`}
                    </option>
                    {students.map((s) => {
                      const name = s.user
                        ? `${s.user.firstName || ''} ${s.user.lastName || ''}`.trim()
                        : s.studentId;
                      const email = s.user?.email ? ` • ${s.user.email}` : '';
                      const college = s.college ? ` - ${s.college}` : '';
                      return (
                        <option key={s.id} value={s.id}>
                          {name} ({s.studentId}{email}{college})
                        </option>
                      );
                    })}
                  </select>
                  {students.length === 0 && !loadingStudents && (
                    <div className="mt-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between">
                      <span>No students found in database.</span>
                      <button
                        type="button"
                        onClick={() => fetchStudents()}
                        className="font-bold underline text-amber-900 ml-2"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Certificate Type</label>
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="form-input form-select text-xs"
                    >
                      <option value="INTERNSHIP">Internship Completion</option>
                      <option value="COURSE_COMPLETION">Course Completion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                    <select
                      value={certDomain}
                      onChange={(e) => setCertDomain(e.target.value)}
                      className="form-input form-select text-xs"
                    >
                      <option value="CSE">CSE / Software</option>
                      <option value="CIVIL">Civil Surveying</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Program / Course Title *</label>
                  <input
                    type="text"
                    required
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    className="form-input text-xs"
                    placeholder="e.g. Web Development Internship"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade / Distinction Note</label>
                  <input
                    type="text"
                    value={certGrade}
                    onChange={(e) => setCertGrade(e.target.value)}
                    className="form-input text-xs"
                    placeholder="Grade A+ (Distinction)"
                  />
                </div>

                {/* File Upload Box */}
                <div className="pt-2">
                  <label className="block font-semibold text-slate-800 mb-1">
                    Upload Your Certificate Document (PDF / Image) *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                      manualFile
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-brand-blue bg-slate-50/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setManualFile(e.target.files[0]);
                        }
                      }}
                    />
                    {manualFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                          <FileCheck size={24} className="text-emerald-600 shrink-0" />
                          <div className="truncate max-w-[260px]">
                            <p className="font-bold text-slate-800 text-xs truncate">{manualFile.name}</p>
                            <p className="text-[10px] text-slate-500">{(manualFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setManualFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud size={26} className="mx-auto text-brand-blue" />
                        <p className="font-semibold text-slate-700 text-xs">
                          Click to select or drag your custom certificate file
                        </p>
                        <p className="text-[10px] text-slate-400">PDF, PNG, JPG up to 50MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Dispatch Checkbox */}
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="send-cert-email-check"
                    checked={sendEmailOnIssue}
                    onChange={(e) => setSendEmailOnIssue(e.target.checked)}
                    className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <label htmlFor="send-cert-email-check" className="text-[11px] text-slate-700 cursor-pointer">
                    <span className="font-bold text-brand-dark">Send official certificate email to student with attachment</span>
                    <p className="text-slate-500 mt-0.5">
                      Attaches the certificate file directly to the email and provides verification links.
                    </p>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsIssueOpen(false)}
                    className="btn-secondary btn-sm"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary btn-sm flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Saving & Uploading...</span>
                    ) : (
                      <>
                        <Send size={14} /> Issue & Upload Certificate
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════ UPLOAD / REPLACE CERTIFICATE MODAL ═══════════════ */}
      <AnimatePresence>
        {replaceModalCert && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-brand-dark">Upload / Replace Certificate</h3>
                  <p className="text-xs font-mono text-slate-500">{replaceModalCert.certificateNumber}</p>
                </div>
                <button onClick={() => setReplaceModalCert(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadReplacement} className="space-y-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student:</span>
                    <span className="font-bold text-slate-800">
                      {replaceModalCert.student?.user
                        ? `${replaceModalCert.student.user.firstName} ${replaceModalCert.student.user.lastName}`
                        : 'Student'}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-500">Title:</span>
                    <span className="font-semibold text-slate-800">{replaceModalCert.title}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Select Certificate Document (PDF / Image) *
                  </label>
                  <div
                    onClick={() => replaceFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                      replaceFile
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-brand-blue bg-slate-50/50'
                    }`}
                  >
                    <input
                      ref={replaceFileInputRef}
                      type="file"
                      required
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setReplaceFile(e.target.files[0]);
                        }
                      }}
                    />
                    {replaceFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                          <FileCheck size={24} className="text-emerald-600 shrink-0" />
                          <div className="truncate max-w-[240px]">
                            <p className="font-bold text-slate-800 text-xs truncate">{replaceFile.name}</p>
                            <p className="text-[10px] text-slate-500">{(replaceFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setReplaceFile(null);
                            if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud size={28} className="mx-auto text-brand-blue" />
                        <p className="font-semibold text-slate-700 text-xs">
                          Click to browse and upload certificate
                        </p>
                        <p className="text-[10px] text-slate-400">PDF, PNG, JPG up to 50MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="replace-cert-email-check"
                    checked={replaceSendEmail}
                    onChange={(e) => setReplaceSendEmail(e.target.checked)}
                    className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <label htmlFor="replace-cert-email-check" className="text-[11px] text-slate-700 cursor-pointer">
                    <span className="font-bold text-brand-dark">Send updated document via email to student</span>
                    <p className="text-slate-500 mt-0.5">
                      Attaches the newly uploaded certificate file directly to the student's email.
                    </p>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReplaceModalCert(null)}
                    className="btn-secondary btn-sm"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !replaceFile}
                    className="btn-primary btn-sm flex items-center gap-1.5"
                  >
                    {isUploading ? (
                      <span>Uploading...</span>
                    ) : (
                      <>
                        <UploadCloud size={14} /> Upload & Save Certificate
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
