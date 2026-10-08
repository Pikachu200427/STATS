import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BookOpen, Briefcase, FileText, Award,
  FolderOpen, Building2, Archive, MessageSquare, Mail, Bell,
  BarChart2, Settings, Shield, LogOut, Menu, X, ChevronRight,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';

const ADMIN_NAV = [
  { section: 'Overview', items: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart2 },
  ]},
  { section: 'Students', items: [
    { label: 'All Students', to: '/admin/students', icon: Users },
    { label: 'Enrollments', to: '/admin/enrollments', icon: ClipboardList },
    { label: 'Applications', to: '/admin/applications', icon: ClipboardList },
  ]},
  { section: 'Programs', items: [
    { label: 'Courses', to: '/admin/courses', icon: BookOpen },
    { label: 'Internships', to: '/admin/internships', icon: Briefcase },
    { label: 'Projects', to: '/admin/projects', icon: FolderOpen },
  ]},
  { section: 'Documents', items: [
    { label: 'Offer Letters', to: '/admin/offer-letters', icon: FileText },
    { label: 'Certificates', to: '/admin/certificates', icon: Award },
  ]},
  { section: 'Communications', items: [
    { label: 'Student Queries', to: '/admin/queries', icon: MessageSquare },
    { label: 'Contact Enquiries', to: '/admin/enquiries', icon: Mail },
    { label: 'Notifications', to: '/admin/notifications', icon: Bell },
  ]},
  { section: 'Config', items: [
    { label: 'Industry Partners', to: '/admin/partners', icon: Building2 },
    { label: 'Resources', to: '/admin/resources', icon: Archive },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ]},
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (to: string, exact = false) =>
    exact ? location.pathname === to : location.pathname === to;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Top Header of Sidebar in line with Topbar */}
      <div className="h-16 px-5 border-b border-gray-800 flex items-center shrink-0">
        <Link to="/admin" className="flex items-center gap-2.5 group" aria-label="STATS INNOTECH Admin Home">
          <img
            src="/assets/logo-horizontal.png"
            alt="STATS INNOTECH"
            className="h-28 sm:h-10 md:h-30 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-[1.02]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const next = e.currentTarget.nextElementSibling as HTMLElement;
              if (next) next.style.display = 'flex';
            }}
          />
          <div className="hidden items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-brand-gradient-light flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-white font-black text-sm">STATS</span>
          </div>
        </Link>
      </div>
      {/* Admin Panel Badge */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Shield size={16} />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">Administration</div>
            <div className="text-amber-400 text-[11px] font-medium leading-none mt-1">Control Center</div>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-brand-gradient-light flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">{user?.firstName[0]}{user?.lastName[0]}</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white text-sm truncate">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-400 truncate">{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto sidebar-scroll">
        {ADMIN_NAV.map(({ section, items }) => (
          <div key={section}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-1">{section}</p>
            <div className="space-y-0.5">
              {items.map(({ label, to, icon: Icon, exact }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive(to, exact)
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/8'
                  )}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{label}</span>
                  {isActive(to, exact) && <ChevronRight size={13} className="ml-auto opacity-60" />}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/8 mb-1 transition-all">
          <LayoutDashboard size={16} /> View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar (dark) */}
      <aside className="hidden lg:flex lg:flex-col w-64 fixed inset-y-0 left-0 z-40" style={{ background: '#0f1724' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 z-50 shadow-2xl"
              style={{ background: '#0f1724' }}
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                  <X size={18} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-icon hover:bg-gray-100" aria-label="Open Sidebar">
              <Menu size={20} />
            </button>

            {/* Mobile-only logo when sidebar is off-screen */}
            <div className="lg:hidden">
              <Link to="/admin" className="flex items-center shrink-0">
                <img
                  src="/assets/logo-horizontal.png"
                  alt="STATS INNOTECH"
                  className="h-28 sm:h-10 md:h-30 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Context Label */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60">
                <Shield size={13} className="text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Admin Control Center</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/notifications" className="btn-icon hover:bg-gray-100 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </Link>
            <Link to="/admin/queries" className="btn-icon hover:bg-gray-100 relative">
              <MessageSquare size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-blue" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient-light flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user?.firstName[0]}{user?.lastName[0]}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
