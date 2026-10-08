import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Search, Download, Send,
  X, RefreshCw, UploadCloud, FileCheck, Trash2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { OfferLetter, Student, Internship } from '../../types';
import toast from 'react-hot-toast';

export default function AdminOfferLetters() {
  const [letters, setLetters] = useState<OfferLetter[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState<'ALL' | 'CSE' | 'CIVIL'>('ALL');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  // Quick Upload / Replace modal state
  const [replaceModalLetter, setReplaceModalLetter] = useState<OfferLetter | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replaceSendEmail, setReplaceSendEmail] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Issue modal Form state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>('');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [stipend, setStipend] = useState('Performance-based + ₹10,000 Milestone Grant');
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
      const [lettersData, studentsData, internshipsData] = await Promise.allSettled([
        adminService.getOfferLetters(),
        adminService.getStudents(),
        adminService.getInternships(),
      ]);

      if (lettersData.status === 'fulfilled') setLetters(lettersData.value);
      if (studentsData.status === 'fulfilled') {
        setStudents(studentsData.value);
      } else {
        console.warn('Students load failed during init:', studentsData.reason);
      }
      if (internshipsData.status === 'fulfilled') setInternships(internshipsData.value);
    } catch {
      toast.error('Failed to load offer letters');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGenerateModal = async () => {
    setIsGenerateOpen(true);
    if (students.length === 0) {
      await fetchStudents();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = letters.filter((l) => {
    const studentName = l.student?.user
      ? `${l.student.user.firstName} ${l.student.user.lastName}`
      : 'Candidate';
    const email = l.student?.user?.email || '';
    const ref = l.referenceNumber || '';
    const domain = (l.domain || '').toUpperCase();

    const vCode = l.verificationCode || '';
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = filterDomain === 'ALL' || domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedInternshipId) {
      toast.error('Please select both a candidate student and internship track');
      return;
    }

    setIsSubmitting(true);
    try {
      const issued = await adminService.issueOfferLetter({
        studentId: selectedStudentId,
        internshipId: selectedInternshipId,
        startDate,
        stipend,
        file: manualFile || undefined,
        sendEmail: sendEmailOnIssue,
      });

      setLetters([issued, ...letters]);
      setIsGenerateOpen(false);
      setManualFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (manualFile) {
        toast.success(`Custom offer letter uploaded & emailed to candidate!`);
      } else {
        toast.success(`Offer letter reference ${issued.referenceNumber} created. You can upload the custom PDF document anytime.`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to issue offer letter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadReplacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceModalLetter || !replaceFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const updated = await adminService.uploadOfferLetterDocument(
        replaceModalLetter.id,
        replaceFile,
        replaceSendEmail
      );

      setLetters(letters.map((l) => (l.id === updated.id ? updated : l)));
      setReplaceModalLetter(null);
      setReplaceFile(null);
      toast.success(`Offer letter document uploaded successfully${replaceSendEmail ? ' and emailed to student' : ''}!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload document');
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
            <FileText size={22} className="text-brand-blue" /> Offer Letter Management
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Upload custom designed offer letter documents (PDF / Image) and dispatch to candidates
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
            onClick={handleOpenGenerateModal}
            className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> Issue & Upload Offer Letter
          </button>
        </div>
      </div>

      {/* Domain Filters & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          {(['ALL', 'CSE', 'CIVIL'] as const).map((dom) => (
            <button
              key={dom}
              onClick={() => setFilterDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterDomain === dom
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
            >
              {dom === 'ALL' ? 'All Domains' : dom} ({letters.filter((l) => dom === 'ALL' || (l.domain || '').toUpperCase() === dom).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, ref, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-9 py-1.5 text-xs w-full"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading offer letters registry...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No offer letters found</p>
            <p className="text-xs text-slate-400 mt-1">Click 'Issue & Upload Offer Letter' to attach your custom document.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap">Ref Number</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Verification Code</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Student Name</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Role & Track</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Domain</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((l) => {
                  const studentName = l.student?.user
                    ? `${l.student.user.firstName || ''} ${l.student.user.lastName || ''}`.trim()
                    : (l.student?.studentId || 'Student');
                  const isCivil = (l.domain || '').toUpperCase() === 'CIVIL';
                  const hasCustomFile = Boolean(l.pdfPath);

                  return (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-dark whitespace-nowrap align-middle">
                        {l.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap align-middle">
                        <span className="inline-flex items-center bg-blue-50 text-brand-blue px-2.5 py-1 rounded-md border border-blue-200 text-xs">
                          {l.verificationCode || 'SIT-OF-501'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-bold text-slate-900 text-sm leading-tight">{studentName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{l.student?.user?.email || 'Student Email'}</div>
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-semibold text-slate-800 leading-tight">{l.roleTitle || l.internship?.title}</div>
                        <div className="text-xs text-emerald-600 font-medium mt-0.5">{l.stipendDetails || 'Performance-based'}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                        {isCivil ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            AN Survey (Civil)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            STATS (CSE)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${l.status === 'ACCEPTED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                        >
                          {l.status || 'ISSUED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplaceModalLetter(l);
                              setReplaceFile(null);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5 border border-emerald-200"
                            title="Upload / Replace Document"
                          >
                            <UploadCloud size={13} /> {hasCustomFile ? 'Replace File' : 'Upload File'}
                          </button>

                          {hasCustomFile ? (
                            <a
                              href={`/api/documents/offer-letters/${l.id}/download`}
                              download
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5 border border-blue-200"
                              title="Download Uploaded Document"
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

      {/* ═══════════════ ISSUE NEW OFFER LETTER MODAL ═══════════════ */}
      <AnimatePresence>
        {isGenerateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-brand-dark">Issue & Upload Offer Letter</h3>
                  <p className="text-xs text-slate-500">Attach your manually designed offer letter document</p>
                </div>
                <button onClick={() => setIsGenerateOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
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

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Internship Track *</label>
                  <select
                    required
                    value={selectedInternshipId}
                    onChange={(e) => setSelectedInternshipId(e.target.value)}
                    className="form-input form-select text-xs"
                  >
                    <option value="">-- Choose Internship --</option>
                    {internships.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.title} [{i.domain}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Commencement Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stipend Scheme</label>
                    <input
                      type="text"
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                {/* File Upload Box */}
                <div className="pt-2">
                  <label className="block font-semibold text-slate-800 mb-1">
                    Upload Your Offer Letter Document (PDF / Image) *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${manualFile
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
                          Click to select or drag your custom offer letter file
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
                    id="send-email-check"
                    checked={sendEmailOnIssue}
                    onChange={(e) => setSendEmailOnIssue(e.target.checked)}
                    className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <label htmlFor="send-email-check" className="text-[11px] text-slate-700 cursor-pointer">
                    <span className="font-bold text-brand-dark">Send notification email to student with attachment</span>
                    <p className="text-slate-500 mt-0.5">
                      Attaches the uploaded offer letter directly to the student's email.
                    </p>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGenerateOpen(false)}
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
                        <Send size={14} /> Issue & Upload Offer Letter
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════ UPLOAD / REPLACE FILE MODAL ═══════════════ */}
      <AnimatePresence>
        {replaceModalLetter && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-brand-dark">Upload / Replace Document</h3>
                  <p className="text-xs font-mono text-slate-500">{replaceModalLetter.referenceNumber}</p>
                </div>
                <button onClick={() => setReplaceModalLetter(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadReplacement} className="space-y-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student:</span>
                    <span className="font-bold text-slate-800">
                      {replaceModalLetter.student?.user
                        ? `${replaceModalLetter.student.user.firstName} ${replaceModalLetter.student.user.lastName}`
                        : 'Student'}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-500">Track:</span>
                    <span className="font-semibold text-slate-800">{replaceModalLetter.roleTitle}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Select Offer Letter Document (PDF / Image) *
                  </label>
                  <div
                    onClick={() => replaceFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${replaceFile
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
                          Click to browse and upload document
                        </p>
                        <p className="text-[10px] text-slate-400">PDF, PNG, JPG up to 50MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="replace-email-check"
                    checked={replaceSendEmail}
                    onChange={(e) => setReplaceSendEmail(e.target.checked)}
                    className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <label htmlFor="replace-email-check" className="text-[11px] text-slate-700 cursor-pointer">
                    <span className="font-bold text-brand-dark">Send updated document via email to candidate</span>
                    <p className="text-slate-500 mt-0.5">
                      Attaches the newly uploaded document directly to the student's email.
                    </p>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReplaceModalLetter(null)}
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
                        <UploadCloud size={14} /> Upload & Save Document
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
