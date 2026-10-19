import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, Star, ChevronRight,
  ArrowRight, Award, Zap, Globe
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { getCourseOutcomes } from '../data/courseOutcomes';
import { courseService } from '../services/courseService';
import { formatCurrency, getLevelColor, getLevelLabel, calculateDiscount } from '../utils';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import type { Course } from '../types';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | undefined>(() => COURSES.find((c) => c.slug === slug));

  useEffect(() => {
    if (slug) {
      courseService.getCourseBySlug(slug)
        .then((data) => {
          if (data) setCourse(data);
        })
        .catch(() => {
          // fallback retained from initial state
        });
    }
  }, [slug]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="heading-sm text-brand-dark mb-2">Course Not Found</h2>
          <Link to="/courses" className="btn-primary btn-sm mt-4 inline-flex">Browse Courses</Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(Number(course.price), course.discountPrice ? Number(course.discountPrice) : undefined);
  const courseOutcomes = getCourseOutcomes(course);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error('Please log in or register to enroll.');
      navigate('/login');
      return;
    }
    navigate(`/courses/${slug}/enroll`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 100%)' }}
      >
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="container-xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/courses" className="hover:text-white">Courses</Link>
            <ChevronRight size={14} />
            <span className="text-white">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className={`badge text-xs mb-4 ${getLevelColor(course.level)} bg-white/10 text-white border border-white/20`}>
                  {getLevelLabel(course.level)}
                </div>
                <h1 className="heading-lg text-white mb-4">{course.title}</h1>
                <p className="text-white/80 text-lg leading-relaxed mb-6">{course.shortDescription}</p>

                <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
                  {course.rating && (
                    <span className="flex items-center gap-1.5">
                      <Star size={15} className="text-amber-400 fill-amber-400" />
                      <strong className="text-white">{course.rating}</strong> rating
                      ({course.totalStudents} students)
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe size={15} /> {course.technology}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Desktop Enroll Card — shown in sidebar on desktop, hidden here on mobile */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="container-xl py-10 sm:py-14 md:py-16 pb-24 sm:pb-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Outcomes */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="card p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="heading-sm text-brand-dark flex items-center gap-2.5">
                    <Award size={22} className="text-brand-blue" /> Course Outcomes
                  </h2>
                  <p className="text-xs text-brand-slate/70 mt-1">
                    Measurable competencies and technical skills achieved upon course completion
                  </p>
                </div>
                <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-100 shrink-0">
                  {courseOutcomes.length} Course Outcomes
                </span>
              </div>

              <div className="space-y-3.5">
                {courseOutcomes.map((co) => (
                  <div
                    key={co.code}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 shadow-2xs"
                  >
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-brand-blue text-white font-bold text-xs shrink-0 tracking-wide shadow-xs">
                      {co.code}
                    </span>
                    <p className="text-sm text-brand-slate leading-relaxed font-medium pt-0.5">
                      {co.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="card p-8">
              <h2 className="heading-sm text-brand-dark mb-5">Requirements</h2>
              <ul className="space-y-2">
                {(course.requirements && course.requirements.length > 0
                  ? course.requirements
                  : [
                      'Basic computer literacy and a laptop or PC',
                      'Dedication to complete daily exercises and practice problems',
                      'No prior expertise required — beginner-friendly guidance provided',
                    ]
                ).map((req) => (
                  <li key={req} className="flex items-start gap-2.5 text-sm text-brand-slate">
                    <ChevronRight size={15} className="text-brand-blue mt-0.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>

          {/* Sidebar — Enroll Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-black text-brand-dark">
                  {formatCurrency(Number(course.discountPrice || course.price))}
                </span>
                {course.discountPrice && (
                  <span className="text-xl text-brand-slate/40 line-through">
                    {formatCurrency(Number(course.price))}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <div className="badge bg-green-100 text-green-700 mb-4">{discount}% off — Limited time offer!</div>
              )}

              {/* CTA */}
              <button
                id="enroll-now-btn"
                onClick={handleEnroll}
                className={`btn-primary w-full justify-center btn-lg mb-3 ${course.status === 'COMING_SOON' ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={course.status === 'COMING_SOON'}
              >
                {course.status === 'COMING_SOON' ? 'Coming Soon' : 'Enroll Now'}
                {course.status !== 'COMING_SOON' && <ArrowRight size={18} />}
              </button>

              {/* Course Highlights */}
              <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-brand-slate uppercase tracking-wide mb-3">This course includes:</p>
                {[
                  { icon: Clock, text: `${course.duration} of content` },
                  { icon: Globe, text: course.technology },
                  { icon: Award, text: 'Completion Certificate' },
                  { icon: Zap, text: 'Lifetime access' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-brand-slate">
                    <Icon size={15} className="text-brand-blue shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Available seats */}
              {course.availableSeats && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs text-amber-700 font-medium">
                    🔥 Only {course.availableSeats} seats remaining!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
