import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[0-9+\-\s]{10,15}$/, 'Enter a valid phone number').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  college: z.string().min(3, 'Enter your college name').optional().or(z.literal('')),
  degree: z.string().optional().or(z.literal('')),
  branch: z.string().optional().or(z.literal('')),
  year: z.number().min(1).max(6).optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const DEGREES = ['B.Tech', 'B.E.', 'B.Sc', 'BCA', 'MCA', 'M.Tech', 'Diploma', 'Other'];

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        college: data.college || undefined,
        degree: data.degree || undefined,
        branch: data.branch || undefined,
        year: data.year,
      });
      toast.success('Account created! Welcome to STATS INNOTECH 🎉');
      navigate('/portal');
    } catch {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 100%)' }}
      >
        <div className="bg-grid absolute inset-0 opacity-15" />
        <div className="orb w-80 h-80 -top-20 -right-20 bg-brand-cyan/30 blur-3xl pointer-events-none" />

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
              Start Your Career Journey Today
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Join hundreds of students learning, interning, and growing with India's next-gen tech platform.
            </p>
            <div className="space-y-4">
              {[
                'Access 9+ technical courses',
                'Apply for CSE & Civil internships',
                'Receive official offer letters',
                'Earn verifiable certificates',
                'Civil internship with AN Survey Consultant',
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
          © {new Date().getFullYear()} STATS INNOTECH
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-start justify-center p-6 bg-gray-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl py-10"
        >
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
              <h1 className="heading-sm text-brand-dark mb-2">Create Your Account</h1>
              <p className="text-sm text-brand-slate">Register to access courses, internships, and your student portal</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">First Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input id="reg-firstName" type="text" placeholder="Rohan" className={`form-input pl-9 ${errors.firstName ? 'border-red-400' : ''}`} {...register('firstName')} />
                  </div>
                  {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Last Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input id="reg-lastName" type="text" placeholder="Sharma" className={`form-input pl-9 ${errors.lastName ? 'border-red-400' : ''}`} {...register('lastName')} />
                  </div>
                  {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="reg-email" type="email" placeholder="you@example.com" className={`form-input pl-9 ${errors.email ? 'border-red-400' : ''}`} {...register('email')} />
                </div>
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="reg-phone" type="tel" placeholder="+91 XXXXX XXXXX" className="form-input pl-9" {...register('phone')} />
                </div>
                {errors.phone && <p className="form-error">{errors.phone.message}</p>}
              </div>

              {/* College */}
              <div className="form-group">
                <label className="form-label">College / University <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="reg-college" type="text" placeholder="Your college name" className="form-input pl-9" {...register('college')} />
                </div>
              </div>

              {/* Degree + Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Degree <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="relative">
                    <GraduationCap size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select id="reg-degree" className="form-select pl-9" {...register('degree')}>
                      <option value="">Select degree</option>
                      {DEGREES.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Year</label>
                  <select id="reg-year" className="form-select" {...register('year', { valueAsNumber: true })}>
                    <option value="">Select year</option>
                    {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="reg-password" type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters" className={`form-input pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`} {...register('password')} />
                  <button type="button" onClick={() => setShowPwd((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="reg-confirm" type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" className={`form-input pl-9 pr-10 ${errors.confirmPassword ? 'border-red-400' : ''}`} {...register('confirmPassword')} />
                  <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" id="reg-submit" disabled={isSubmitting} className="btn-primary w-full btn-lg justify-center mt-2">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Create Account <ArrowRight size={18} /></span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-brand-slate mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-blue font-semibold hover:underline">Sign In</Link>
            </p>
            <p className="text-center text-xs text-gray-400 mt-3">
              By registering, you agree to our{' '}
              <Link to="/terms" className="hover:underline">Terms of Service</Link> and{' '}
              <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
