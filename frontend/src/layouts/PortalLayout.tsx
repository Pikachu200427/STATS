import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, BookOpen, Briefcase, FolderOpen,
  FileText, Award, Archive, Bell, MessageSquare, Settings,
  LogOut, Menu, X, ChevronRight, GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/portal', icon: LayoutDashboard, exact: true },
  { label: 'My Profile', to: '/portal/profile', icon: User },
  { label: 'My Courses', to: '/portal/courses', icon: BookOpen },
  { label: 'My Internships', to: '/portal/internships', icon: Briefcase },
  { label: 'My Projects', to: '/portal/projects', icon: FolderOpen },
  { label: 'Offer Letters', to: '/portal/offer-letters', icon: FileText },
  { label: 'Certificates', to: '/portal/certificates', icon: Award },
  { label: 'Resources', to: '/portal/resources', icon: Archive },
  { label: 'Notifications', to: '/portal/notifications', icon: Bell },
  { label: 'Support & Queries', to: '/portal/queries', icon: MessageSquare },
  { label: 'Settings', to: '/portal/settings', icon: Settings },
];

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, student, logout } = useAuth();

  const isActive = (to: string, exact = false) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Top Header of Sidebar in line with Topbar */}
      <div className="h-16 px-5 border-b border-gray-100 flex items-center shrink-0">
        <Link to="/" className="flex items-center gap-2 group" aria-label="STATS INNOTECH Home">
          <img
            src="/assets/logo-horizontal.png"
            alt="STATS INNOTECH"
            className="h-28 sm:h-10 md:h-30 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            onError={(e) => { e.currentTarget.style.display='none'; (e.currentTarget.nextElementSibling as HTMLElement)?.style.setProperty('display','flex'); }}
          />
          <div className="hidden items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-brand-gradient-light flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <div>
              <div className="font-black text-brand-dark text-sm leading-none">STATS</div>
              <div className="font-bold text-brand-blue text-xs leading-none">INNOTECH</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Student Info Card */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-brand-blue/5 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient-light flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">
              {user?.firstName[0]}{user?.lastName[0]}
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-brand-dark text-sm truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-brand-slate truncate">{student?.studentId || user?.email}</div>
          </div>
          <div className="badge-blue text-xs shrink-0">Student</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 sidebar-scroll">
        {SIDEBAR_ITEMS.map(({ label, to, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'sidebar-item',
              isActive(to, exact) && 'sidebar-item-active'
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{label}</span>
            {isActive(to, exact) && <ChevronRight size={14} />}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)} className="btn-icon hover:bg-gray-100">
                  <X size={20} />
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
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden btn-icon hover:bg-gray-100"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Mobile Logo: shown only when sidebar is hidden on small screens */}
            <div className="lg:hidden">
              <Link to="/" className="flex items-center shrink-0">
                <img
                  src="/assets/logo-horizontal.png"
                  alt="STATS INNOTECH"
                  className="h-28 sm:h-10 md:h-30 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Context Label */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="font-bold text-brand-dark text-sm">Student Portal</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-brand-slate font-medium">Dashboard & Learning</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/portal/notifications" className="btn-icon hover:bg-gray-100 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient-light flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user?.firstName[0]}{user?.lastName[0]}</span>
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-brand-dark leading-none">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-brand-slate leading-none mt-0.5">{student?.studentId}</div>
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
