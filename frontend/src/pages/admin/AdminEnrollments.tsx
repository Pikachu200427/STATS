import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, Search, Filter, CheckCircle2,
  Clock, AlertCircle, RefreshCw, BookOpen, Download
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { CourseEnrollment } from '../../types';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getEnrollments();
      const sorted = [...data].sort((a, b) => {
        const timeA = a.enrolledAt ? new Date(a.enrolledAt).getTime() : 0;
        const timeB = b.enrolledAt ? new Date(b.enrolledAt).getTime() : 0;
        if (timeA && timeB && timeA !== timeB) return timeB - timeA;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
      setEnrollments(sorted);
    } catch {
      toast.error('Failed to load course enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  const handleUpdateStatus = async (id: number | string, newStatus: string) => {
    try {
      const updated = await adminService.updateEnrollmentStatus(id, newStatus);
      setEnrollments((prev) => prev.map((e) => (e.id === id ? updated : e)));
      toast.success(`Enrollment marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update enrollment status');
    }
  };

  const filtered = enrollments.filter((e) => {
    const studentName = e.student?.user
      ? `${e.student.user.firstName} ${e.student.user.lastName}`
      : e.student?.studentId || '';
    const email = e.student?.user?.email || '';
    const courseTitle = e.course?.title || '';
    const enrollmentId = e.enrollmentId || '';

    const matchSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      enrollmentId.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPaidRevenue = enrollments
    .filter((e) => e.paymentStatus === 'PAID' && e.paymentAmount)
    .reduce((sum, e) => sum + Number(e.paymentAmount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <ClipboardList size={22} className="text-brand-blue" /> Student Course Enrollments
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Track student syllabus completion progress, batch timings, and tuition payment status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadEnrollments}
            disabled={loading}
            className="btn-secondary btn-sm flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-black text-brand-dark">{enrollments.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Total Enrolled Seats</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-black text-blue-600">
            {enrollments.filter((e) => e.status === 'ACTIVE').length}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Active Trainees</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-black text-emerald-600">
            {enrollments.filter((e) => e.status === 'COMPLETED').length}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Certified Graduates</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-black text-emerald-600">
            {formatCurrency(totalPaidRevenue)}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Collected Tuition</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, enrollment ID, or course title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <div className="relative min-w-[160px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input form-select text-xs"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading live enrollment records...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No enrollments found matching current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Course Enrolled</th>
                  <th className="py-3.5 px-4">Batch</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((e) => {
                  const studentName = e.student?.user
                    ? `${e.student.user.firstName} ${e.student.user.lastName}`
                    : e.student?.studentId || 'Enrolled Student';
                  const initials = studentName.split(' ').map((n) => n[0]).join('').slice(0, 2);

                  return (
                    <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-gradient-light text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-brand-dark text-sm leading-tight">{studentName}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {e.student?.user?.email || e.student?.studentId} • #{e.enrollmentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{e.course?.title || 'Course'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{e.course?.technology}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {e.batchType || 'WEEKEND'}
                        </span>
                      </td>
                      <td className="py-3 px-4 min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>{e.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-gradient-light h-full rounded-full transition-all"
                            style={{ width: `${e.progress || 0}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            e.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {e.paymentStatus || 'PAID'} ({formatCurrency(e.paymentAmount || 0)})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            e.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : e.status === 'DROPPED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {e.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={e.status || 'ACTIVE'}
                          onChange={(evt) => handleUpdateStatus(e.id, evt.target.value)}
                          className="form-input form-select text-xs py-1 px-2 max-w-[130px]"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="DROPPED">DROPPED</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
