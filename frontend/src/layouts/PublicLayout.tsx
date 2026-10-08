import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-sans text-sm',
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 4px 24px rgba(11,31,58,0.15)',
          },
          success: {
            style: { border: '1px solid #86efac' },
            iconTheme: { primary: '#22c55e', secondary: '#f0fdf4' },
          },
          error: {
            style: { border: '1px solid #fca5a5' },
            iconTheme: { primary: '#ef4444', secondary: '#fef2f2' },
          },
        }}
      />
    </div>
  );
}
