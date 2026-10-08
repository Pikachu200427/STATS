import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Eye, Mail, Download, UserCheck,
  ChevronDown, GraduationCap, RefreshCw, X, ExternalLink,
  Phone, Globe, FileText, Award, Calendar
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Student } from '../../types';
import toast from 'react-hot-toast';

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStudents();
      const sorted = [...data].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA && timeB && timeA !== timeB) return timeB - timeA;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
      setStudents(sorted);
    } catch {
      toast.error('Failed to load students from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const colleges = Array.from(new Set(students.map((s) => s.college).filter(Boolean)));

  const filtered = students.filter((s) => {
    const fullName = s.user ? `${s.user.firstName} ${s.user.lastName}` : '';
    const email = s.user?.email || '';
    const studentId = s.studentId || '';
    const college = s.college || '';
    const branch = s.branch || '';

    const matchSearch =
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      studentId.toLowerCase().includes(search.toLowerCase()) ||
      branch.toLowerCase().includes(search.toLowerCase());

    const matchCollege = collegeFilter === 'ALL' || college === collegeFilter;
    return matchSearch && matchCollege;
  });

  const exportCSV = () => {
    if (students.length === 0) return toast.error('No students to export');
    const headers = ['Student ID', 'Name', 'Email', 'Phone', 'College', 'Branch', 'Degree', 'Grad Year'];
    const rows = students.map((s) => [
      s.studentId,
      s.user ? `${s.user.firstName} ${s.user.lastName}` : 'N/A',
      s.user?.email || 'N/A',
      s.phone || 'N/A',
      s.college || 'N/A',
      s.branch || 'N/A',
      s.degree || 'N/A',
      s.graduationYear || 'N/A',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stats_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Students exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <Users size={22} className="text-brand-blue" /> Student Directory
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            <strong>{students.length}</strong> verified student accounts enrolled across technical batches
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadStudents}
            disabled={loading}
            className="btn-secondary btn-sm flex items-center gap-1.5"
            title="Refresh database records"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button onClick={exportCSV} className="btn-secondary btn-sm flex items-center gap-1.5">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, ID, email, or department branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="form-input form-select pl-9 pr-8"
          >
            <option value="ALL">All Colleges</option>
            {colleges.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading live student database records...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No students found matching current search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Institution & Branch</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Skills</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => {
                  const fullName = s.user ? `${s.user.firstName} ${s.user.lastName}` : 'Student';
                  const initials = fullName.split(' ').map((n) => n[0]).join('').slice(0, 2);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-gradient-light text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-brand-dark text-sm leading-tight">{fullName}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5">{s.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60">
                          {s.studentId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{s.college || 'Engineering College'}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{s.branch || s.degree || 'Technology'}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-600">
                        {s.graduationYear ? `Class of ${s.graduationYear}` : 'Enrolled'}
                      </td>
                      <td className="py-3 px-4 max-w-[240px]">
                        <div className="truncate text-slate-500" title={typeof s.skills === 'string' ? s.skills : ''}>
                          {s.skills || 'Technical Foundation'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="p-1.5 rounded-lg text-brand-blue hover:bg-blue-50 transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye size={16} />
                          </button>
                          {s.user?.email && (
                            <a
                              href={`mailto:${s.user.email}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-brand-dark hover:bg-slate-100 transition-colors"
                              title="Email Student"
                            >
                              <Mail size={16} />
                            </a>
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

      {/* Student Details Inspection Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-6 relative">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gradient-light flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {selectedStudent.user ? `${selectedStudent.user.firstName[0]}${selectedStudent.user.lastName[0]}` : 'S'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {selectedStudent.user ? `${selectedStudent.user.firstName} ${selectedStudent.user.lastName}` : 'Student Profile'}
                    </h3>
                    <p className="text-xs text-amber-300 font-mono mt-1">{selectedStudent.studentId}</p>
                    <p className="text-xs text-slate-400">{selectedStudent.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium block">Institution</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedStudent.college || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Academic Track</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedStudent.branch || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Degree & Grad Year</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {selectedStudent.degree || 'B.Tech'} {selectedStudent.graduationYear ? `(${selectedStudent.graduationYear})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Phone Contact</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{selectedStudent.phone || 'N/A'}</span>
                  </div>
                </div>

                {selectedStudent.skills && (
                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Technical Competencies</span>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed font-mono text-[11px] border border-slate-100">
                      {selectedStudent.skills}
                    </div>
                  </div>
                )}

                {/* Portfolio / External Links */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedStudent.resumeUrl && (
                    <a
                      href={selectedStudent.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary btn-sm flex items-center gap-1.5"
                    >
                      <FileText size={14} /> View Resume <ExternalLink size={12} />
                    </a>
                  )}
                  {selectedStudent.githubUrl && (
                    <a
                      href={selectedStudent.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary btn-sm flex items-center gap-1.5"
                    >
                      <Globe size={14} /> GitHub Profile <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button onClick={() => setSelectedStudent(null)} className="btn-secondary btn-sm">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
