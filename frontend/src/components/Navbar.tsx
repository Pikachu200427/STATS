import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, BookOpen, Briefcase, Globe, User, LogOut,
  GraduationCap, LayoutDashboard, Shield, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Internships', to: '/internships' },
  {
    label: 'Services',
    dropdown: [
      { label: 'Technical Courses', to: '/courses', icon: BookOpen },
      { label: 'CSE & Civil Internships', to: '/internships', icon: Briefcase },
      { label: 'College Project Development', to: '/projects', icon: GraduationCap },
      { label: 'Commercial Web Development', to: '/services/web-development', icon: Globe },
    ],
  },
  { label: 'Projects', to: '/projects' },
  { label: 'Verify', to: '/verify-certificate' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-3 md:top-4 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 pointer-events-none"
      >
        <div
          className={cn(
            'max-w-6xl mx-auto pointer-events-auto transition-all duration-300',
            'rounded-2xl md:rounded-full border px-3 sm:px-5 md:px-6',
            'backdrop-blur-xl bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.07)] border-white/80',
            scrolled && 'bg-white/95 border-white shadow-[0_12px_36px_rgb(0,0,0,0.12)]'
          )}
        >
          <div className="flex items-center justify-between h-13 md:h-14 gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 group" aria-label="STATS INNOTECH Home">
              <img
                src="/assets/logo-horizontal.png"
                alt="STATS INNOTECH"
                className="h-28 sm:h-10 md:h-30 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const next = target.nextElementSibling as HTMLElement;
                  if (next) next.style.display = 'flex';
                }}
              />
              <div className="hidden items-center gap-2">
                <div className="text-left">
                  <div className="font-black text-brand-dark text-sm leading-none tracking-tight">STATS</div>
                  <div className="font-bold text-brand-blue text-[10px] leading-none tracking-wider mt-0.5">INNOTECH</div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {NAV_LINKS.map((link) =>
                link.dropdown ? (
                  <div key={link.label} className="relative" ref={servicesRef}>
                    <button
                      onClick={() => setServicesOpen((p) => !p)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-brand-blue hover:bg-slate-100/70 transition-all',
                        servicesOpen && 'text-brand-blue bg-slate-100/80'
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        size={13}
                        className={cn('transition-transform duration-200', servicesOpen && 'rotate-180')}
                      />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2.5 w-64 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-xl z-50"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"
                            >
                              <item.icon size={15} className="text-brand-blue shrink-0" />
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to!}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-brand-blue hover:bg-slate-100/70 transition-all whitespace-nowrap',
                      isActive(link.to!) && 'text-brand-blue bg-brand-blue/10 font-bold'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((p) => !p)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/60 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-800 block leading-tight">
                        {user?.firstName}
                      </span>
                      <span className="text-[10px] text-brand-blue font-medium block leading-tight">
                        {isAdmin ? 'Admin' : 'Student'}
                      </span>
                    </div>
                    <ChevronDown size={13} className={cn('text-slate-500 transition-transform ml-1', userMenuOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2.5 w-52 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-xl z-50"
                      >
                        {isAdmin ? (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"
                          >
                            <LayoutDashboard size={15} className="text-brand-blue" />
                            Admin Console
                          </Link>
                        ) : (
                          <Link
                            to="/portal"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"
                          >
                            <User size={15} className="text-brand-blue" />
                            Student Portal
                          </Link>
                        )}
                        <Link
                          to="/portal/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"
                        >
                          <Shield size={15} className="text-brand-blue" />
                          Profile Settings
                        </Link>
                        <div className="border-t border-slate-100 my-1 mx-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all text-left"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-brand-blue hover:bg-slate-100/70 transition-all whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full text-xs font-bold text-white bg-brand-blue hover:bg-blue-600 shadow-md shadow-brand-blue/25 hover:shadow-lg hover:shadow-brand-blue/35 transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    Get Started
                    <Sparkles size={12} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen((p) => !p)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl"
              style={{ width: 'min(320px, 90vw)' }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <img
                    src="/assets/logo-horizontal.png"
                    alt="STATS INNOTECH"
                    className="h-8 w-auto object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
                {NAV_LINKS.map((link) =>
                  link.dropdown ? (
                    <div key={link.label}>
                      <button
                        onClick={() => setServicesOpen((p) => !p)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {link.label}
                        <ChevronDown size={14} className={cn('transition-transform text-slate-400', servicesOpen && 'rotate-180')} />
                      </button>
                      <AnimatePresence>
                        {servicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 pl-3 border-l-2 border-brand-blue/20 space-y-0.5 my-1">
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.label}
                                  to={item.to}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"
                                >
                                  <item.icon size={14} className="text-brand-blue shrink-0" />
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to!}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors',
                        isActive(link.to!) && 'bg-brand-blue/10 text-brand-blue font-bold'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>

              {/* Auth Footer */}
              <div className="px-4 pb-6 pt-3 border-t border-slate-100 space-y-2 shrink-0">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-1">
                      <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {user?.firstName?.[0] || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">{user?.firstName} {user?.lastName}</div>
                        <div className="text-xs text-brand-blue font-medium">{isAdmin ? 'Administrator' : 'Student'}</div>
                      </div>
                    </div>
                    <Link
                      to={isAdmin ? '/admin' : '/portal'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-blue-600 shadow-md transition-all"
                    >
                      {isAdmin ? <LayoutDashboard size={15} /> : <User size={15} />}
                      {isAdmin ? 'Admin Console' : 'Go to Portal'}
                    </Link>
                    <button
                      onClick={() => { setIsOpen(false); handleLogout(); }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="py-3 text-center rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="py-3 text-center rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-blue-600 shadow-md transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
