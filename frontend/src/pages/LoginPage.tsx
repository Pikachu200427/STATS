import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/portal';

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleFillCredentials = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const loggedUser = await login(data.email, data.password);
      toast.success('Welcome back! 🎉');
      if (loggedUser.role === 'ADMIN' || loggedUser.role === 'SUPER_ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from === '/admin' ? '/portal' : from, { replace: true });
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'ECONNABORTED' || !err.response) {
        toast.error('Backend connection error. Please ensure Spring Boot is running.');
      } else {
        toast.error(err.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 100%)' }}
      >
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="orb w-64 h-64 -top-16 -left-16 bg-brand-cyan" />
        <div className="orb w-48 h-48 bottom-16 right-8 bg-brand-blue/80" />

        {/* Top Header with Dedicated Auth Logo */}
        <div className="relative z-10 w-full max-w-xl">
          <Link to="/" className="inline-block group transition-transform duration-200 hover:scale-[1.02]">
            <img
              src="/assets/logo-auth.png"
              alt="STATS INNOTECH"
              className="h-12 sm:h-14 lg:h-16 xl:h-20 2xl:h-24 w-auto max-w-[260px] lg:max-w-[320px] xl:max-w-[380px] 2xl:max-w-[440px] brightness-0 invert drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)] transition-all duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const next = e.currentTarget.nextElementSibling as HTMLElement;
                if (next) next.style.display = 'flex';
              }}
            />
            <div className="hidden items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <div>
                <div className="text-white font-black text-xl leading-none">STATS</div>
                <div className="text-brand-cyan font-bold text-sm leading-none">INNOTECH</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Welcome Back to Your Learning Journey
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Access your courses, internship status, documents, and certificates — all in one place.
            </p>
            <div className="space-y-4">
              {[
                'Track your course progress',
                'View internship status',
                'Download offer letters & certificates',
                'Submit and track queries',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-brand-cyan shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-xs">
          © {new Date().getFullYear()} STATS INNOTECH. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img
                src="/assets/logo-auth.png"
                alt="STATS INNOTECH"
                className="h-10 sm:h-12 w-auto mx-auto object-contain max-w-[220px] sm:max-w-[260px]"
              />
            </Link>
          </div>

          <div className="card p-8">
            <div className="text-center mb-8">
              <h1 className="heading-sm text-brand-dark mb-2">Sign In</h1>
              <p className="text-sm text-brand-slate">Enter your credentials to access your portal</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className={`form-input pl-10 ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              <div className="form-group">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label mb-0" htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                id="login-submit"
                disabled={isSubmitting}
                className="btn-primary w-full btn-lg justify-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight size={18} />
                  </span>
                )}
              </button>

              {/* Quick Login Credentials */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
                <p className="font-semibold text-slate-700 mb-2">Instant Fill Test Accounts:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('student@statsinnotech.in', 'Student@123')}
                    className="flex-1 py-2 px-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition text-left cursor-pointer"
                  >
                    <div className="font-bold flex items-center justify-between">
                      Student Account <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">Click to fill</span>
                    </div>
                    <div className="text-[11px] text-blue-600 font-mono mt-0.5">student@statsinnotech.in</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('admin@statsinnotech.in', 'Admin@123')}
                    className="flex-1 py-2 px-3 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 transition text-left cursor-pointer"
                  >
                    <div className="font-bold flex items-center justify-between">
                      Admin Account <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded">Click to fill</span>
                    </div>
                    <div className="text-[11px] text-purple-600 font-mono mt-0.5">admin@statsinnotech.in</div>
                  </button>
                </div>
              </div>
            </form>

            <div className="divider mt-6">
              <span className="text-xs text-gray-400 font-medium">or</span>
            </div>

            <p className="text-center text-sm text-brand-slate mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-blue font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
