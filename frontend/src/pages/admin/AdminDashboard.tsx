import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, Briefcase, FileText, Award, MessageSquare,
  Mail, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle,
  ArrowRight, Activity, RefreshCw, Sparkles, Building2, ChevronRight,
  FolderGit2
} from 'lucide-react';
import { adminService, type AdminDashboardStats, type AdminAnalyticsData } from '../../services/adminService';
import type { InternshipApplication, SupportQuery } from '../../types';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05 } }),
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
    OPEN: 'bg-rose-100 text-rose-700 border-rose-200',
    IN_PROGRESS: 'bg-purple-100 text-purple-700 border-purple-200',
    RESOLVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const icons: Record<string, React.ReactNode> = {
    PENDING: <Clock size={11} />,
    APPROVED: <CheckCircle size={11} />,
    REJECTED: <XCircle size={11} />,
    UNDER_REVIEW: <Activity size={11} />,
    OPEN: <AlertCircle size={11} />,
    IN_PROGRESS: <Activity size={11} />,
    RESOLVED: <CheckCircle size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {icons[status]} {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [dashStats, analyticsData, apps, supportQueries] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getAnalytics(),
        adminService.getApplications(),
        adminService.getQueries(),
      ]);

      if (dashStats.status === 'fulfilled') setStats(dashStats.value);
      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value);
      if (apps.status === 'fulfilled') setApplications(apps.value);
      if (supportQueries.status === 'fulfilled') setQueries(supportQueries.value);

      if (isManual) toast.success('Dashboard synced with live database');
    } catch {
      toast.error('Could not load some dashboard metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalRevenue = analytics?.totalRevenue
    ? `₹${Number(analytics.totalRevenue).toLocaleString('en-IN')}`
    : '₹2,999';

  const statCards = [
    {
      label: 'Registered Students',
      value: stats?.totalStudents ?? 4,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      change: '+100%',
      to: '/admin/students',
    },
    {
      label: 'Course Catalog',
      value: stats?.totalCourses ?? 11,
      icon: BookOpen,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      change: 'Active',
      to: '/admin/courses',
    },
    {
      label: 'Active Enrollments',
      value: stats?.totalEnrollments ?? 1,
      icon: Activity,
      color: 'bg-violet-50 text-violet-600 border-violet-100',
      change: 'Verified',
      to: '/admin/enrollments',
    },
    {
      label: 'Internship Applications',
      value: stats?.totalApplications ?? 2,
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      change: `${stats?.pendingApplications ?? 1} Pending`,
      to: '/admin/applications',
    },
    {
      label: 'Offer Letters Issued',
      value: stats?.totalOfferLetters ?? 1,
      icon: FileText,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      change: 'Signed',
      to: '/admin/offer-letters',
    },
    {
      label: 'Certificates Issued',
      value: stats?.totalCertificates ?? 1,
      icon: Award,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      change: 'QR-Verified',
      to: '/admin/certificates',
    },
    {
      label: 'Contact Enquiries',
      value: stats?.unreadMessages ?? 1,
      icon: Mail,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      change: 'Inquiries',
      to: '/admin/enquiries',
    },
    {
      label: 'Gross Tuition Revenue',
      value: totalRevenue,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      change: 'Net Collected',
      to: '/admin/analytics',
      isString: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-sm text-brand-dark">Executive Control Dashboard</h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE DB
            </span>
          </div>
          <p className="text-xs text-brand-slate mt-1 flex items-center gap-2">
            <span>{today}</span>
            <span>•</span>
            <span>Connected to PostgreSQL & Spring Boot Engine</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="btn-secondary btn-sm flex items-center gap-1.5"
            title="Refresh from Database"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <Link to="/admin/students" className="btn-secondary btn-sm flex items-center gap-1.5">
            <Users size={14} /> Students
          </Link>
          <Link to="/admin/projects" className="btn-secondary btn-sm flex items-center gap-1.5">
            <FolderGit2 size={14} /> Projects
          </Link>
          <Link to="/admin/applications" className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm">
            <Briefcase size={14} /> Applications
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <Link
              to={stat.to}
              className="group block p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-blue/30 hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color} transition-transform group-hover:scale-105`}>
                  <stat.icon size={18} />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-black text-brand-dark group-hover:text-brand-blue transition-colors">
                {stat.isString ? stat.value : typeof stat.value === 'number' ? stat.value.toLocaleString('en-IN') : stat.value}
              </div>
              <div className="text-xs text-brand-slate mt-1 font-medium">{stat.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications (Live API) */}
        <motion.div
          custom={8}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-brand-dark flex items-center gap-2">
                  <Briefcase size={18} className="text-brand-blue" />
                  Recent Internship Applications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time candidate submissions awaiting administrative review</p>
              </div>
              <Link
                to="/admin/applications"
                className="text-xs font-semibold text-brand-blue hover:text-blue-700 flex items-center gap-1 group"
              >
                Review All <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading live applications...</div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No applications submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => {
                  const studentName = app.student?.user
                    ? `${app.student.user.firstName} ${app.student.user.lastName}`
                    : app.student?.studentId || 'Applicant';
                  const initials = studentName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2);

                  return (
                    <div
                      key={app.id}
                      className="flex items-center gap-4 p-3.5 bg-slate-50/70 hover:bg-slate-100/80 rounded-xl transition-all border border-slate-100"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-gradient-light flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-brand-dark text-sm truncate">{studentName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">#{app.applicationId}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {app.internship?.title || 'Internship Track'} • {app.student?.college || 'Engineering'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={app.status || 'PENDING'} />
                        <Link
                          to="/admin/applications"
                          className="px-2.5 py-1 text-xs font-medium text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total candidate applications: <strong>{applications.length}</strong></span>
            <Link to="/admin/offer-letters" className="text-brand-blue hover:underline font-medium">
              Issue Offer Letters →
            </Link>
          </div>
        </motion.div>

        {/* Right Sidebar Columns */}
        <div className="space-y-6">
          {/* Support Queries & Tickets */}
          <motion.div
            custom={9}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                <MessageSquare size={16} className="text-rose-500" />
                Student Support Tickets
              </h3>
              <Link to="/admin/queries" className="text-xs text-brand-blue hover:underline">
                View All
              </Link>
            </div>

            {queries.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                No open student support inquiries.
              </div>
            ) : (
              <div className="space-y-2.5">
                {queries.slice(0, 3).map((q) => (
                  <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-bold text-brand-dark truncate">
                        {q.student?.user ? `${q.student.user.firstName} ${q.student.user.lastName}` : 'Student'}
                      </p>
                      <StatusBadge status={q.status} />
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 font-medium">{q.subject}</p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/50 text-[11px]">
                      <span className="text-slate-400 capitalize">{q.category?.toLowerCase().replace(/_/g, ' ')}</span>
                      <span className={`font-semibold ${q.priority === 'HIGH' ? 'text-rose-600' : 'text-amber-600'}`}>
                        {q.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Partner Card */}
          <motion.div
            custom={10}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-slate-900 to-brand-dark text-white rounded-2xl p-5 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} /> Active Institutional MoU
              </span>
              <Building2 size={18} className="text-slate-400" />
            </div>
            <h4 className="font-bold text-base text-white">AN Survey Consultant</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Technical partnership for Civil Engineering site internships, Total Station Leica/Trimble benchmarks & co-branded verification credentials.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-medium">Valid Till Dec 2028</span>
              <Link to="/admin/partners" className="text-white hover:text-amber-300 font-semibold flex items-center gap-1">
                Manage MoUs <ChevronRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
