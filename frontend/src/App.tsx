import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import PortalLayout from './layouts/PortalLayout';

// Public Direct Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import InternshipsPage from './pages/InternshipsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CertificateVerificationPage from './pages/CertificateVerificationPage';
import ContactPage from './pages/ContactPage';

// Portal Direct Pages
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalOfferLetters from './pages/portal/PortalOfferLetters';
import PortalCertificates from './pages/portal/PortalCertificates';
import PortalQueries from './pages/portal/PortalQueries';
import PortalProfile from './pages/portal/PortalProfile';
import PortalNotifications from './pages/portal/PortalNotifications';
import PortalSettings from './pages/portal/PortalSettings';
import PortalCourses from './pages/portal/PortalCourses';
import PortalInternships from './pages/portal/PortalInternships';
import PortalResources from './pages/portal/PortalResources';
import PortalProjects from './pages/portal/PortalProjects';
import CourseLearningPage from './pages/portal/CourseLearningPage';

// Public Lazy Pages
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CourseEnrollPage = lazy(() => import('./pages/CourseEnrollPage'));
const InternshipDetailPage = lazy(() => import('./pages/InternshipDetailPage'));
const InternshipApplyPage = lazy(() => import('./pages/InternshipApplyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const WebDevelopmentServicePage = lazy(() => import('./pages/WebDevelopmentServicePage'));

// Admin Lazy Pages & Layout
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminStudents = lazy(() => import('./pages/admin/AdminStudents'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const AdminInternships = lazy(() => import('./pages/admin/AdminInternships'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminOfferLetters = lazy(() => import('./pages/admin/AdminOfferLetters'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'));
const AdminQueries = lazy(() => import('./pages/admin/AdminQueries'));
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'));
const AdminEnrollments = lazy(() => import('./pages/admin/AdminEnrollments'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));

// Loading spinner
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        <p className="text-sm text-brand-slate">Loading...</p>
      </div>
    </div>
  );
}

// Protected Route
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/portal" replace />;
  return <>{children}</>;
}

// Fallback legal/policy placeholder
function LegalPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 sm:pt-32 md:pt-36 pb-24 md:pb-32 px-4">
      <div className="container-xl max-w-3xl card p-8 md:p-12 bg-white shadow-sm border border-slate-200">
        <h1 className="heading-md text-brand-dark mb-4">{title}</h1>
        <p className="text-xs text-slate-500 mb-6">Last updated: October 2026 • STATS INNOTECH Pvt. Ltd.</p>
        <div className="text-xs text-brand-slate leading-relaxed space-y-4">
          <p>
            Welcome to STATS INNOTECH. By using our website, courses, technical internships, and student management portal, you agree to comply with our academic guidelines, code of conduct, and terms of service.
          </p>
          <p>
            All certificates issued through our portal are digitally verifiable with tamper-evident cryptographic IDs. Dual-certified programs conducted in partnership with <strong>AN Survey Consultant</strong> follow strict adherence to industry standards and surveying field safety protocols.
          </p>
          <p>
            For any legal questions, email us at <a href="mailto:contact@statsinnotech.in" className="text-brand-blue underline">contact@statsinnotech.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Public ─────────────────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={
            <Suspense fallback={<PageLoader />}><CourseDetailPage /></Suspense>
          } />
          <Route path="/courses/:slug/enroll" element={
            <Suspense fallback={<PageLoader />}><CourseEnrollPage /></Suspense>
          } />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/internships/civil" element={<InternshipsPage />} />
          <Route path="/internships/:slug" element={
            <Suspense fallback={<PageLoader />}><InternshipDetailPage /></Suspense>
          } />
          <Route path="/internships/:slug/apply" element={
            <Suspense fallback={<PageLoader />}><InternshipApplyPage /></Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<PageLoader />}><AboutPage /></Suspense>
          } />
          <Route path="/projects" element={
            <Suspense fallback={<PageLoader />}><ProjectsPage /></Suspense>
          } />
          <Route path="/services/web-development" element={
            <Suspense fallback={<PageLoader />}><WebDevelopmentServicePage /></Suspense>
          } />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/verify-certificate" element={<CertificateVerificationPage />} />
          <Route path="/verify-completion" element={<CertificateVerificationPage />} />
          <Route path="/terms" element={<LegalPage title="Terms of Service" />} />
          <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
          <Route path="/refund-policy" element={<LegalPage title="Refund & Cancellation Policy" />} />
          <Route path="/forgot-password" element={<LegalPage title="Account Recovery & Password Reset" />} />
        </Route>

        {/* ─── Auth ────────────────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ─── Dedicated Non-Video Course Learning Classroom ─── */}
        <Route
          path="/portal/courses/:slug/learn"
          element={
            <ProtectedRoute>
              <CourseLearningPage />
            </ProtectedRoute>
          }
        />

        {/* ─── Student Portal ──────────────────────────────────────────── */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <PortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PortalDashboard />} />
          <Route path="profile" element={<PortalProfile />} />
          <Route path="courses" element={<PortalCourses />} />
          <Route path="courses/:slug/learn" element={<CourseLearningPage />} />
          <Route path="internships" element={<PortalInternships />} />
          <Route path="projects" element={<PortalProjects />} />
          <Route path="offer-letters" element={<PortalOfferLetters />} />
          <Route path="certificates" element={<PortalCertificates />} />
          <Route path="resources" element={<PortalResources />} />
          <Route path="notifications" element={<PortalNotifications />} />
          <Route path="queries" element={<PortalQueries />} />
          <Route path="queries/new" element={<PortalQueries />} />
          <Route path="settings" element={<PortalSettings />} />
        </Route>

        {/* ─── Admin ───────────────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
          <Route path="students" element={<Suspense fallback={<PageLoader />}><AdminStudents /></Suspense>} />
          <Route path="courses" element={<Suspense fallback={<PageLoader />}><AdminCourses /></Suspense>} />
          <Route path="internships" element={<Suspense fallback={<PageLoader />}><AdminInternships /></Suspense>} />
          <Route path="applications" element={<Suspense fallback={<PageLoader />}><AdminApplications /></Suspense>} />
          <Route path="enrollments" element={<Suspense fallback={<PageLoader />}><AdminEnrollments /></Suspense>} />
          <Route path="projects" element={<Suspense fallback={<PageLoader />}><AdminProjects /></Suspense>} />
          <Route path="offer-letters" element={<Suspense fallback={<PageLoader />}><AdminOfferLetters /></Suspense>} />
          <Route path="certificates" element={<Suspense fallback={<PageLoader />}><AdminCertificates /></Suspense>} />
          <Route path="documents" element={<Navigate to="/admin/offer-letters" replace />} />
          <Route path="partners" element={<Suspense fallback={<PageLoader />}><AdminPartners /></Suspense>} />
          <Route path="resources" element={<PortalResources />} />
          <Route path="queries" element={<Suspense fallback={<PageLoader />}><AdminQueries /></Suspense>} />
          <Route path="enquiries" element={<Suspense fallback={<PageLoader />}><AdminEnquiries /></Suspense>} />
          <Route path="notifications" element={<PortalNotifications />} />
          <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense>} />
          <Route path="settings" element={<PortalSettings />} />
        </Route>

        {/* ─── 404 ─────────────────────────────────────────────────────── */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-8xl font-black text-brand-blue/20 mb-4">404</div>
              <h2 className="heading-sm text-brand-dark mb-2">Page Not Found</h2>
              <p className="text-brand-slate/70 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
