import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Briefcase, FileText, Award, Bell, ArrowRight,
  CheckCircle, Clock, TrendingUp, AlertCircle, Loader2, Sparkles, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentService, type DashboardData } from '../../services/studentService';
import { formatDateShort } from '../../utils';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
};

export default function PortalDashboard() {
  const { user, student: authStudent } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const result = await studentService.getDashboard();
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Error fetching dashboard:', err);
          setError(err?.response?.data?.message || 'Failed to load dashboard data');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadDashboard();
    return () => { mounted = false; };
  }, []);

  const today = formatDateShort(new Date().toISOString());
  const student = data?.student || authStudent;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-brand-slate">Loading your student dashboard...</p>
      </div>
    );
  }

  const enrolledCount = data?.enrolledCoursesCount ?? 0;
  const activeAppsCount = data?.activeApplicationsCount ?? 0;
  const offerLettersCount = data?.offerLettersCount ?? 0;
  const certificatesCount = data?.certificatesCount ?? 0;

  const STATS = [
    { label: 'Enrolled Courses', value: enrolledCount, icon: BookOpen, color: 'bg-blue-100 text-blue-600', to: '/portal/courses' },
    { label: 'Internships', value: activeAppsCount, icon: Briefcase, color: 'bg-cyan-100 text-cyan-600', to: '/portal/internships' },
    { label: 'Offer Letters', value: offerLettersCount, icon: FileText, color: 'bg-purple-100 text-purple-600', to: '/portal/offer-letters' },
    { label: 'Certificates', value: certificatesCount, icon: Award, color: 'bg-amber-100 text-amber-600', to: '/portal/certificates' },
  ];

  const enrollments = data?.enrollments || [];
  const applications = data?.applications || [];
  const queries = data?.recentQueries || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden relative p-6 md:p-8 shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 60%, #0098CA 100%)' }}
      >
        <div className="bg-grid absolute inset-0 opacity-15" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-sm">
                <Sparkles size={11} className="text-cyan-300" /> Student Learning Portal
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.firstName || 'Student'} {user?.lastName || ''}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 mt-3">
              <span className="badge glass border border-white/20 text-white text-xs px-3 py-1">
                🎓 {student?.studentId || 'STATS-STU-001'}
              </span>
              {student?.college && (
                <span className="badge glass border border-white/20 text-white text-xs px-3 py-1">
                  🏛️ {student.college}
                </span>
              )}
              {student?.branch && (
                <span className="badge glass border border-white/20 text-white text-xs px-3 py-1">
                  {student.branch}
                </span>
              )}
              <span className="badge glass border border-white/20 text-white/90 text-xs px-3 py-1">
                📅 {today}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/courses" className="btn bg-white text-brand-blue hover:bg-gray-100 font-bold btn-sm shadow-md">
              <BookOpen size={15} /> Browse Courses
            </Link>
            <Link to="/internships" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 font-bold btn-sm backdrop-blur-sm">
              <Briefcase size={15} /> Apply Internship
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <Link to={stat.to} className="card p-5 flex flex-col gap-3 group hover:border-brand-blue/40 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-105`}>
                  <stat.icon size={22} />
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-blue transition-colors" />
              </div>
              <div>
                <div className="text-3xl font-black text-brand-dark tracking-tight">{stat.value}</div>
                <div className="text-xs font-semibold text-brand-slate mt-0.5">{stat.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrolled Courses */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
                  <BookOpen size={17} />
                </div>
                <div>
                  <h2 className="font-bold text-brand-dark text-base">My Enrolled Courses</h2>
                  <p className="text-xs text-brand-slate">Active curriculum & technical tracking</p>
                </div>
              </div>
              <Link to="/portal/courses" className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
                View All ({enrollments.length}) <ArrowRight size={12} />
              </Link>
            </div>

            {enrollments.length > 0 ? (
              <div className="space-y-3.5">
                {enrollments.map((enr) => {
                  const course = enr.course;
                  const progress = enr.progress ?? 0;
                  return (
                    <div
                      key={enr.id}
                      className="p-4 bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-100 rounded-xl transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                              {course?.category || 'Programming'}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 font-mono">
                              {enr.enrollmentId}
                            </span>
                          </div>
                          <h3 className="font-bold text-brand-dark text-sm truncate">
                            {course?.title || 'Technical Course'}
                          </h3>
                          <p className="text-xs text-brand-slate mt-0.5">
                            Instructor: <span className="font-medium text-slate-700">{course?.instructor || 'STATS Faculty'}</span> · {course?.duration || 'Self-paced'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <span className="badge-green text-xs font-semibold px-2.5 py-0.5">
                            {enr.status || 'ACTIVE'}
                          </span>
                          <Link
                            to={`/portal/courses/${course?.slug || 'java-core'}/learn`}
                            className="btn btn-sm bg-white hover:bg-brand-blue hover:text-white border border-slate-200 text-brand-dark text-xs py-1 px-2.5 shadow-sm transition-colors flex items-center gap-1 font-semibold"
                          >
                            <BookOpen size={12} /> Continue
                          </Link>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.max(5, progress)}%`,
                              background: 'linear-gradient(90deg, #155EEF 0%, #06B6D4 100%)'
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-brand-blue min-w-[32px] text-right">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                <BookOpen size={36} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-brand-dark">No active course enrollments yet</p>
                <p className="text-xs text-brand-slate mt-0.5">Enroll in our technical masterclasses to fast-track your tech career.</p>
                <Link to="/courses" className="btn-primary btn-sm mt-4 inline-flex">
                  Explore Courses
                </Link>
              </div>
            )}
          </motion.div>

          {/* Active Internships */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Briefcase size={17} />
                </div>
                <div>
                  <h2 className="font-bold text-brand-dark text-base">My Internship Applications</h2>
                  <p className="text-xs text-brand-slate">Industry tracks, approvals & verification</p>
                </div>
              </div>
              <Link to="/portal/internships" className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
                View All ({applications.length}) <ArrowRight size={12} />
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app) => {
                  const intern = app.internship;
                  const isApproved = app.status === 'APPROVED';
                  return (
                    <div
                      key={app.id}
                      className={`p-5 rounded-xl border transition-all ${
                        isApproved
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`badge text-xs font-bold ${
                              isApproved ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isApproved ? '✓ Application Approved' : app.status}
                            </span>
                            <span className="badge-blue text-xs font-semibold">
                              {intern?.domain || 'CSE'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {app.applicationId}
                            </span>
                          </div>

                          <h3 className="font-bold text-brand-dark text-base pt-1">
                            {intern?.title || 'Industrial Internship'}
                          </h3>
                          <p className="text-xs text-brand-slate">
                            {intern?.technology && <span className="font-medium text-slate-700">Tech: {intern.technology} · </span>}
                            Mode: {intern?.mode || 'Hybrid'} · Duration: {intern?.duration || '8 Weeks'}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                            <Clock size={12} /> Applied on: {formatDateShort(app.appliedAt)}
                          </p>
                        </div>

                        <div className="shrink-0 flex sm:flex-col gap-2">
                          {isApproved && (
                            <Link
                              to="/portal/offer-letters"
                              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                            >
                              <FileText size={13} /> View Offer Letter
                            </Link>
                          )}
                          <Link
                            to="/portal/internships"
                            className="btn btn-sm bg-white hover:bg-slate-50 border border-slate-200 text-brand-dark text-xs"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                <Briefcase size={36} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-brand-dark">No internship applications yet</p>
                <p className="text-xs text-brand-slate mt-0.5">Apply for verified industry internships with real startup project exposure.</p>
                <Link to="/internships" className="btn-primary btn-sm mt-4 inline-flex">
                  Explore Internships
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="card p-5 shadow-sm">
            <h3 className="font-bold text-brand-dark mb-3 text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'View Offer Letters', to: '/portal/offer-letters', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Download Certificates', to: '/portal/certificates', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Verify a Credential', to: '/verify-certificate', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Submit Support Query', to: '/portal/queries', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'Track Course Progress', to: '/portal/courses', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-blue">{item.label}</span>
                  <ArrowRight size={13} className="ml-auto text-gray-300 group-hover:text-brand-blue transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Support Queries / Updates */}
          <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                <HelpCircle size={15} className="text-brand-blue" /> Support & Resolution
              </h3>
              <Link to="/portal/queries" className="text-xs font-semibold text-brand-blue hover:underline">
                View All
              </Link>
            </div>

            {queries.length > 0 ? (
              <div className="space-y-3">
                {queries.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDateShort(q.createdAt)}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 line-clamp-1">{q.subject}</p>
                    {q.adminReply && (
                      <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100 mt-1 line-clamp-2">
                        💬 <span className="font-semibold">Admin reply:</span> {q.adminReply}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                <Bell size={24} className="mx-auto mb-1 text-slate-300" />
                No queries submitted. Need help? Click 'Submit Support Query' above.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

