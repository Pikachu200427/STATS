import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, CheckCircle, Play, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { studentService } from '../../services/studentService';
import type { CourseEnrollment } from '../../types';
import { formatDateShort } from '../../utils';

export default function PortalCourses() {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadCourses() {
      try {
        setIsLoading(true);
        const data = await studentService.getEnrolledCourses();
        if (mounted) {
          setEnrollments(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Failed to load enrolled courses:', err);
          setError(err?.response?.data?.message || 'Failed to load enrolled courses');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadCourses();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-brand-slate">Loading your enrolled courses...</p>
      </div>
    );
  }

  const completed = enrollments.filter((c) => (c.progress ?? 0) >= 100 || c.status === 'COMPLETED');
  const active = enrollments.filter((c) => (c.progress ?? 0) < 100 && c.status !== 'COMPLETED');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark">My Courses</h1>
          <p className="text-sm text-brand-slate mt-1">
            {enrollments.length} enrolled course{enrollments.length !== 1 ? 's' : ''} in your active learning curriculum.
          </p>
        </div>
        <Link to="/courses" className="btn-primary btn-sm self-start">
          <BookOpen size={15} /> Browse More Courses
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      {/* Active Courses */}
      {active.length > 0 && (
        <div>
          <h2 className="font-bold text-brand-dark text-sm mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-brand-blue" /> In Progress ({active.length})
          </h2>
          <div className="space-y-4">
            {active.map((enr, i) => {
              const course = enr.course;
              const progress = enr.progress ?? 0;
              return (
                <motion.div
                  key={enr.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-6 hover:border-brand-blue/30 transition-all duration-300 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-brand-gradient-light flex items-center justify-center shrink-0 shadow-md">
                      <BookOpen size={24} className="text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="badge-blue text-xs font-semibold">
                          {course?.category || 'Technical Course'}
                        </span>
                        {course?.technology && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {course.technology}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">
                          {enr.enrollmentId}
                        </span>
                        <span className="badge-green text-xs font-semibold ml-auto sm:ml-0">
                          {enr.status || 'ACTIVE'}
                        </span>
                      </div>

                      <h3 className="font-bold text-brand-dark text-base">
                        {course?.title || 'Course Title'}
                      </h3>
                      <p className="text-xs text-brand-slate mt-1">
                        Instructor: <span className="font-medium text-slate-700">{course?.instructor || 'STATS Faculty'}</span> · Duration: {course?.duration || '8 Weeks'}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-3.5 mb-2">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium text-slate-600">Course Syllabus Progress</span>
                          <span className="font-bold text-brand-blue">{progress}% Completed</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.max(5, progress)}%`,
                              background: 'linear-gradient(90deg, #155EEF 0%, #06B6D4 100%)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Extra info tags */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-brand-slate/70 pt-2 border-t border-slate-100 mt-3">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> Enrolled: {formatDateShort(enr.enrolledAt)}
                        </span>
                        {enr.batchType && (
                          <span className="flex items-center gap-1 font-semibold text-slate-600">
                            🗓️ Batch: {enr.batchType}
                          </span>
                        )}
                        {enr.paymentStatus === 'PAID' && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle size={12} /> Tuition Fee Paid
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 self-start sm:self-center">
                      <Link
                        to={`/portal/courses/${course?.slug || 'java-core'}/learn`}
                        className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
                      >
                        <BookOpen size={14} /> Continue Learning
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="font-bold text-brand-dark text-sm mb-3">Completed ({completed.length})</h2>
          <div className="space-y-3">
            {completed.map((enr) => (
              <div key={enr.id} className="card p-5 bg-slate-50/70 border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-dark text-sm truncate">{enr.course?.title}</p>
                    <p className="text-xs text-brand-slate/70 mt-0.5">
                      Completed · Completed on {formatDateShort(enr.completedAt || enr.enrolledAt)}
                    </p>
                  </div>
                  <Link
                    to="/portal/certificates"
                    className="btn btn-sm bg-white border border-slate-200 text-brand-dark text-xs hover:bg-slate-100"
                  >
                    View Certificate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {enrollments.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-brand-blue">
            <BookOpen size={28} />
          </div>
          <h3 className="font-bold text-brand-dark mb-1">No enrolled courses found</h3>
          <p className="text-sm text-brand-slate/70 max-w-sm mx-auto mb-6">
            Enroll in our hands-on technical masterclasses to begin learning from industry experts.
          </p>
          <Link to="/courses" className="btn-primary btn-sm inline-flex">
            Browse Courses <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

