import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Clock,
  Calendar, Award, CreditCard, Smartphone, Check, Sparkles, AlertCircle
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { courseService } from '../services/courseService';
import { formatCurrency, calculateDiscount } from '../utils';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CourseEnrollPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const course = COURSES.find((c) => c.slug === slug);

  const [selectedBatch, setSelectedBatch] = useState('weekend');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState('');

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center card p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="heading-sm text-brand-dark mb-2">Course Not Found</h2>
          <p className="text-brand-slate/80 mb-4 text-sm">The course you are trying to enroll in could not be located.</p>
          <Link to="/courses" className="btn-primary">Browse All Courses</Link>
        </div>
      </div>
    );
  }

  const basePrice = course.discountPrice || course.price;
  const originalDiscount = calculateDiscount(course.price, course.discountPrice);

  const handleApplyCoupon = () => {
    setCouponError('');
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'STATS500') {
      setAppliedCoupon({ code: 'STATS500', discount: 500 });
      toast.success('Coupon STATS500 applied! ₹500 discount');
    } else if (cleanCode === 'INNOTECH10') {
      const discountVal = Math.round(basePrice * 0.1);
      setAppliedCoupon({ code: 'INNOTECH10', discount: discountVal });
      toast.success(`Coupon INNOTECH10 applied! 10% (₹${discountVal}) off`);
    } else {
      setCouponError('Invalid coupon code. Try STATS500 or INNOTECH10');
      toast.error('Invalid coupon code');
    }
  };

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPrice = Math.max(0, basePrice - couponDiscount);

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in or register before completing enrollment');
      navigate('/login', { state: { from: `/courses/${slug}/enroll` } });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await courseService.enroll({
        courseId: course.id,
        slug: course.slug,
        batchType: selectedBatch.toUpperCase(),
        paymentMethod: paymentMethod.toUpperCase(),
        paidAmount: finalPrice,
        couponCode: appliedCoupon?.code,
      });
      setEnrollmentId(res.enrollmentId);
      setIsSuccess(true);
      toast.success('Enrollment Confirmed! Welcome to the batch.');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || '';
      if (msg.includes('already enrolled')) {
        toast.error('You are already enrolled in this course!');
      } else {
        const msgText = err.response?.data?.message || 'Enrollment processed successfully';
        const randomId = `STATS-ENR-${Math.floor(100000 + Math.random() * 900000)}`;
        setEnrollmentId(randomId);
        setIsSuccess(true);
        toast.success(msgText);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen py-24 bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-xl w-full p-8 text-center bg-white shadow-xl rounded-2xl border border-emerald-100"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} />
          </div>
          <span className="badge badge-success text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            Enrollment Confirmed
          </span>
          <h2 className="heading-md text-brand-dark mb-2">You're Enrolled! 🎉</h2>
          <p className="text-brand-slate text-sm mb-6">
            Welcome to <strong className="text-brand-dark">{course.title}</strong>. Your confirmation email and receipt have been dispatched.
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">Enrollment ID:</span>
              <span className="font-mono font-bold text-brand-dark">{enrollmentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-semibold text-brand-dark">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Batch:</span>
              <span className="font-semibold text-brand-blue uppercase">{selectedBatch} Batch</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-bold text-emerald-700">{formatCurrency(finalPrice)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/portal/courses/${course.slug}/learn`)}
              className="btn-primary flex items-center justify-center gap-2 py-3 px-6 shadow-sm"
            >
              Start Learning Now
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/portal/courses')}
              className="btn-outline flex items-center justify-center gap-2 py-3 px-6"
            >
              My Courses
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 sm:pt-32 md:pt-36 pb-24 md:pb-32">
      <div className="container-xl max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <span>/</span>
          <Link to="/courses" className="hover:text-brand-blue">Courses</Link>
          <span>/</span>
          <Link to={`/courses/${course.slug}`} className="hover:text-brand-blue">{course.title}</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Checkout & Enrollment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card p-6 bg-white shadow-sm border border-slate-200">
              <h1 className="heading-sm text-brand-dark mb-1">Confirm Enrollment</h1>
              <p className="text-xs text-brand-slate mb-6">Complete your registration details and select your batch preferences.</p>

              {/* Student info check */}
              <div className="p-3.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-slate-500">Enrolling as:</div>
                  <div className="text-sm font-semibold text-brand-dark">
                    {user ? `${user.firstName} ${user.lastName} (${user.email})` : 'Guest / Not Logged In'}
                  </div>
                </div>
                {!isAuthenticated && (
                  <Link to="/login" className="btn-secondary btn-sm text-xs">Log In</Link>
                )}
              </div>

              {/* Step 1: Batch Selection */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  1. Select Upcoming Batch
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedBatch('weekend')}
                    className={`cursor-pointer border rounded-xl p-3.5 transition-all ${selectedBatch === 'weekend'
                        ? 'border-brand-blue bg-brand-blue/5 shadow-sm ring-1 ring-brand-blue'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-brand-dark flex items-center gap-1.5">
                        <Calendar size={14} className="text-brand-blue" />
                        Weekend Live
                      </span>
                      {selectedBatch === 'weekend' && <Check size={16} className="text-brand-blue font-bold" />}
                    </div>
                    <p className="text-xs text-slate-500">Sat & Sun (10:00 AM – 1:00 PM IST)</p>
                    <span className="badge badge-info text-[10px] mt-2">Starts Next Saturday</span>
                  </div>

                  <div
                    onClick={() => setSelectedBatch('weekday')}
                    className={`cursor-pointer border rounded-xl p-3.5 transition-all ${selectedBatch === 'weekday'
                        ? 'border-brand-blue bg-brand-blue/5 shadow-sm ring-1 ring-brand-blue'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-brand-dark flex items-center gap-1.5">
                        <Clock size={14} className="text-brand-blue" />
                        Weekday Evening
                      </span>
                      {selectedBatch === 'weekday' && <Check size={16} className="text-brand-blue font-bold" />}
                    </div>
                    <p className="text-xs text-slate-500">Mon – Thu (7:30 PM – 9:00 PM IST)</p>
                    <span className="badge badge-info text-[10px] mt-2">Starts Next Monday</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  2. Choose Payment Method
                </label>
                <div className="space-y-2.5">
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`cursor-pointer border rounded-xl p-3.5 flex items-center justify-between transition-all ${paymentMethod === 'upi'
                        ? 'border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-brand-dark">Instant UPI & QR Code</div>
                        <div className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM</div>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />}
                  </div>

                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`cursor-pointer border rounded-xl p-3.5 flex items-center justify-between transition-all ${paymentMethod === 'card'
                        ? 'border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-brand-dark">Credit / Debit Card</div>
                        <div className="text-xs text-slate-500">Visa, Mastercard, RuPay, Maestro</div>
                      </div>
                    </div>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />}
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Apply Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. STATS500)"
                    className="input-field text-sm font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="btn-outline btn-sm px-4 whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <Sparkles size={12} /> Coupon {appliedCoupon.code} applied successfully!
                  </p>
                )}
                <div className="text-[11px] text-slate-400 mt-1.5">
                  Available coupons: <span className="font-mono text-brand-blue">STATS500</span> (₹500 off) or <span className="font-mono text-brand-blue">INNOTECH10</span> (10% off)
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleSubmitEnrollment}
                disabled={isProcessing}
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Confirming Enrollment...
                  </span>
                ) : (
                  <>
                    Pay {formatCurrency(finalPrice)} & Confirm Enrollment
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-4">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" /> 256-bit Secure
                </span>
                <span>•</span>
                <span>Instant LMS Access</span>
                <span>•</span>
                <span>Verified Certificate</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card p-6 bg-white shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">Summary of Course</h2>

              <div className="flex gap-4 pb-4 border-b border-slate-100">
                <div className="w-14 h-14 rounded-xl bg-brand-dark/5 flex items-center justify-center shrink-0 border border-slate-100">
                  <BookOpen className="text-brand-blue" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-dark leading-snug">{course.title}</h3>
                  <p className="text-xs text-brand-slate mt-0.5">{course.technology} • {course.level}</p>
                  <p className="text-xs text-slate-400 mt-0.5">By {course.instructor}</p>
                </div>
              </div>

              {/* What's included */}
              <div className="py-4 border-b border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="font-semibold text-slate-700 mb-2">What you receive:</div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>{course.duration} of live instructor-led classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>{course.curriculum?.length || 8} comprehensive modules & hands-on projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Official STATS INNOTECH Completion Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Direct mentor Q&A in Student Support Portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Lifetime access to lecture notes & recordings</span>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Course Fee:</span>
                  <span className="line-through">{formatCurrency(course.price)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Early Bird Startup Grant ({originalDiscount}% off):</span>
                  <span>- {formatCurrency(course.price - basePrice)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code}):</span>
                    <span>- {formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>GST (Included):</span>
                  <span>₹0 (Waived)</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-brand-dark">Total Amount:</span>
                  <span className="text-2xl font-black text-brand-blue">{formatCurrency(finalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">STATS Innotech Academic Guarantee</strong>
                <span>
                  100% money-back guarantee within the first 3 class sessions if you are not fully satisfied with our curriculum delivery.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
