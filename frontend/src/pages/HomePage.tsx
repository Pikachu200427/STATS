import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ArrowRight, BookOpen, Briefcase, Code2, Globe,
  GraduationCap, Star, Users, Award, Layers,
  ChevronRight, Building2, CheckCircle, Zap,
  BarChart2, Brain, Cloud, Database, Monitor
} from 'lucide-react';
import { COURSES, CSE_INTERNSHIPS, CIVIL_INTERNSHIP, TESTIMONIALS, PLATFORM_STATS, FAQS } from '../data/mockData';
import { formatCurrency, getLevelColor, calculateDiscount } from '../utils';

// ─── Animation variants ───────────────────────────────────────────────
const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stats Counter ──────────────────────────────────────────────────────
function StatCounter({ value, label, suffix = '+' }: { value: number; label: string; suffix?: string }) {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div ref={ref} variants={fadeUp} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white mb-2">
        {count.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-sm text-white/70 font-medium">{label}</div>
    </motion.div>
  );
}

// ─── Course Card ────────────────────────────────────────────────────────
function CourseCard({ course }: { course: typeof COURSES[0] }) {
  const discount = calculateDiscount(course.price, course.discountPrice);
  return (
    <motion.div variants={fadeUp}>
      <Link to={`/courses/${course.slug}`} className="card-hover p-0 overflow-hidden block group">
        {/* Thumbnail */}
        <div className="relative h-44 bg-gradient-to-br from-brand-dark to-brand-blue overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Code2 size={28} className="text-white" />
            </div>
          </div>
          {course.status === 'COMING_SOON' && (
            <div className="absolute top-3 right-3 badge-amber">Coming Soon</div>
          )}
          {discount > 0 && (
            <div className="absolute top-3 left-3 badge bg-green-500 text-white">{discount}% OFF</div>
          )}
          {course.status === 'ACTIVE' && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-semibold">{course.rating || '4.8'}</span>
              <span className="text-white/60 text-xs">({course.totalStudents || 0})</span>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-5">
          <div className={`badge text-xs mb-2 ${getLevelColor(course.level)}`}>{course.level}</div>
          <h3 className="font-bold text-brand-dark text-base mb-1 group-hover:text-brand-blue transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-brand-slate/70 mb-3 line-clamp-2">{course.shortDescription}</p>
          <div className="flex items-center gap-3 text-xs text-brand-slate/60 mb-4">
            <span className="flex items-center gap-1">
              <Users size={12} /> {course.instructor}
            </span>
            <span>•</span>
            <span>{course.duration}</span>
            <span>•</span>
            <span>{course.technology}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {course.discountPrice ? (
                <>
                  <span className="font-black text-brand-dark text-lg">{formatCurrency(course.discountPrice)}</span>
                  <span className="text-sm text-brand-slate/50 line-through">{formatCurrency(course.price)}</span>
                </>
              ) : (
                <span className="font-black text-brand-dark text-lg">{formatCurrency(course.price)}</span>
              )}
            </div>
            <span className="btn btn-primary btn-sm">Enroll Now</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main HomePage ─────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="overflow-x-hidden">
      {/* ═══ HERO ═════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #0d2850 40%, #155EEF 100%)' }}
      >
        {/* Background layers */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 pointer-events-none">
          <div className="bg-grid absolute inset-0 opacity-10" />
          <div className="orb w-[600px] h-[600px] -top-48 -right-48 bg-brand-blue" />
          <div className="orb w-[400px] h-[400px] -bottom-32 -left-32 bg-brand-cyan" />
          <div className="orb w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue/50" />
        </motion.div>

        {/* Floating tech icons — hidden on small screens to avoid overlap */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          {[
            { icon: Code2, pos: 'top-28 right-[12%]', delay: 0 },
            { icon: Database, pos: 'top-1/3 right-[5%]', delay: 0.5 },
            { icon: Cloud, pos: 'bottom-32 right-[15%]', delay: 1 },
            { icon: Brain, pos: 'bottom-20 left-[8%]', delay: 0.3 },
            { icon: BarChart2, pos: 'top-40 left-[6%]', delay: 0.7 },
            { icon: Monitor, pos: 'top-1/2 left-[3%]', delay: 1.2 },
          ].map(({ icon: Icon, pos, delay }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.8, duration: 0.5 }}
              className={`absolute ${pos} animate-float`}
              style={{ animationDelay: `${delay}s` }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center border border-white/20">
                <Icon size={18} className="text-white/70" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="container-xl relative z-10 pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'backOut' }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <img
                  src="/assets/logo-horizontal.png"
                  alt="STATS INNOTECH"
                  className="h-20 sm:h-24 md:h-28 w-auto brightness-0 invert drop-shadow-[0_8px_32px_rgba(255,255,255,0.25)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const next = e.currentTarget.nextElementSibling as HTMLElement;
                    if (next) next.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center gap-3">
                  <img src="/assets/logo-icon.png" alt="" className="h-16 w-auto" />
                  <div className="text-left">
                    <div className="text-white font-black text-3xl leading-none">STATS</div>
                    <div className="text-brand-cyan font-bold text-xl leading-none">INNOTECH</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-white/90 text-sm font-medium">
                <Zap size={14} className="text-brand-cyan" />
                India's Next-Gen Tech Training Platform
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            >
              Build Your Career in{' '}
              <span className="text-gradient-dark">Technology</span>
              {' '}& Engineering
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-white/70 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Industry-oriented courses, real-world CSE & Civil Engineering internships,
              and practical projects — everything you need to launch your career from
              college to company.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <Link to="/courses" className="btn btn-cyan btn-lg group w-full sm:w-auto">
                <BookOpen size={20} />
                Explore Courses
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/internships"
                className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 w-full sm:w-auto"
              >
                <Briefcase size={20} />
                Explore Internships
              </Link>
            </motion.div>

            {/* Quick trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-10 md:mt-12 text-white/50 text-xs sm:text-sm"
            >
              {[
                '✓ CSE Internships',
                '✓ Civil Engineering Internship',
                '✓ Offer Letters',
                '✓ Certificates',
                '✓ Industry Partnership',
              ].map((item) => (
                <span key={item} className="font-medium">{item}</span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 0 720 80 0 40L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══ STATS ════════════════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 100%)' }}>
        <div className="container-xl">
          <AnimatedSection className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            <StatCounter value={PLATFORM_STATS.totalStudents} label="Students Trained" />
            <StatCounter value={PLATFORM_STATS.totalCourses} label="Courses Offered" suffix="" />
            <StatCounter value={PLATFORM_STATS.totalInternships} label="Internship Programs" suffix="" />
            <StatCounter value={PLATFORM_STATS.totalProjects} label="Projects Completed" />
            <StatCounter value={PLATFORM_STATS.totalCertificates} label="Certificates Issued" />
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ WHAT WE OFFER ════════════════════════════════════════════════ */}
      <section className="section bg-gray-50">
        <div className="container-xl">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <div className="section-tag">
                <Layers size={16} /> What We Offer
              </div>
              <h2 className="heading-lg text-brand-dark">
                Everything You Need to{' '}
                <span className="text-gradient-dark">Succeed</span>
              </h2>
              <p className="body-lg max-w-2xl mx-auto mt-4">
                From technical courses to industry internships — we provide complete career-building
                programs for engineers and tech enthusiasts.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: 'Technical Courses',
                  description: 'Industry-oriented courses in Java, Python, C/C++, Data Analytics, DSA, Linux, AWS, and Digital Marketing taught by experienced instructors.',
                  color: 'from-blue-500 to-brand-blue',
                  cta: 'Browse Courses',
                  to: '/courses',
                  highlights: ['9 Courses', 'Expert Instructors', 'Certificates'],
                },
                {
                  icon: Briefcase,
                  title: 'CSE Internships',
                  description: 'Hands-on Computer Science internships in Data Analytics, Web Dev, AIML, IoT, Java, Python, Cloud, DBMS, and Software Testing.',
                  color: 'from-cyan-500 to-brand-cyan',
                  cta: 'Explore Internships',
                  to: '/internships',
                  highlights: ['9 Domains', 'Offer Letters', 'Real Projects'],
                },
                {
                  icon: Building2,
                  title: 'Civil Engineering Internship',
                  description: 'Practical Civil Engineering internship in association with AN Survey Consultant — featuring field surveys, AutoCAD, and real site exposure.',
                  color: 'from-amber-500 to-orange-500',
                  cta: 'Learn More',
                  to: '/internships/civil',
                  highlights: ['AN Survey Partner', 'Performance Stipend', 'Completion Letter'],
                },
                {
                  icon: GraduationCap,
                  title: 'College Project Development',
                  description: 'End-to-end final year project development for college students. Custom topic suggestions, full working source code, university-compliant documentation report, and viva coaching.',
                  color: 'from-emerald-500 to-teal-600',
                  cta: 'Request Project',
                  to: '/projects',
                  highlights: ['Topic Suggestions', 'Live Working Demo', 'Full Report & Viva'],
                },
                {
                  icon: Globe,
                  title: 'Website Development',
                  description: 'Professional commercial website and web application development for businesses, startups, and educational institutions.',
                  color: 'from-purple-500 to-violet-600',
                  cta: 'Our Services',
                  to: '/services/web-development',
                  highlights: ['Custom Design', 'Full Stack', 'SEO Ready'],
                },
              ].map((offer, i) => (
                <motion.div key={offer.title} variants={fadeUp} custom={i}>
                  <Link to={offer.to} className="card-hover h-full p-6 block group">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${offer.color} flex items-center justify-center mb-5 shadow-brand group-hover:scale-110 transition-transform duration-300`}>
                      <offer.icon size={26} className="text-white" />
                    </div>
                    <h3 className="font-bold text-brand-dark text-lg mb-3 group-hover:text-brand-blue transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-brand-slate/70 leading-relaxed mb-5">
                      {offer.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {offer.highlights.map((h) => (
                        <span key={h} className="badge-blue text-xs">{h}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-brand-blue group-hover:gap-2 transition-all">
                      {offer.cta}
                      <ArrowRight size={15} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ COURSES PREVIEW ══════════════════════════════════════════════ */}
      <section className="section">
        <div className="container-xl">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
              <div>
                <div className="section-tag">
                  <BookOpen size={16} /> Courses
                </div>
                <h2 className="heading-md text-brand-dark">Popular Courses</h2>
                <p className="body-md mt-2 max-w-xl">
                  Start learning with our industry-ready technical courses taught by expert instructors.
                </p>
              </div>
              <Link to="/courses" className="btn btn-secondary btn-sm shrink-0 group">
                View All Courses
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {COURSES.slice(0, 4).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ INTERNSHIPS PREVIEW ══════════════════════════════════════════ */}
      <section className="section bg-gray-50">
        <div className="container-xl">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <div className="section-tag">
                <Briefcase size={16} /> Internships
              </div>
              <h2 className="heading-lg text-brand-dark">
                Real-World Internship Programs
              </h2>
              <p className="body-lg max-w-2xl mx-auto mt-4">
                Gain hands-on experience in CSE and Civil Engineering domains with mentorship,
                resources, and official documents.
              </p>
            </motion.div>

            {/* Domain Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* CSE Domain */}
              <motion.div variants={fadeUp}>
                <div className="card p-8 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-gradient-light flex items-center justify-center shadow-brand">
                        <Code2 size={26} className="text-white" />
                      </div>
                      <div>
                        <div className="badge-blue mb-1">9 Internships</div>
                        <h3 className="font-bold text-brand-dark text-xl">CSE & Engineering</h3>
                      </div>
                    </div>
                    <p className="text-sm text-brand-slate/70 mb-6 leading-relaxed">
                      Computer Science internships across Data Analytics, Web Development, AIML, IoT, Java, Python, Cloud, DBMS, and Software Testing.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {CSE_INTERNSHIPS.slice(0, 6).map((intern) => (
                        <div key={intern.id} className="flex items-center gap-2 text-sm text-brand-slate">
                          <CheckCircle size={14} className="text-brand-blue shrink-0" />
                          {intern.title.replace(' Internship', '')}
                        </div>
                      ))}
                    </div>
                    <Link to="/internships" className="btn btn-primary btn-sm group">
                      Explore CSE Internships
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Civil Domain */}
              <motion.div variants={fadeUp}>
                <div className="card p-8 h-full relative overflow-hidden border-2 border-amber-100">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Building2 size={26} className="text-white" />
                      </div>
                      <div>
                        <div className="badge bg-amber-100 text-amber-700 mb-1">Industry Partnership</div>
                        <h3 className="font-bold text-brand-dark text-xl">Civil Engineering</h3>
                      </div>
                    </div>
                    {/* Partnership Banner */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">In Association With</p>
                      <p className="font-bold text-brand-dark">AN Survey Consultant</p>
                    </div>
                    <p className="text-sm text-brand-slate/70 mb-5 leading-relaxed">
                      {CIVIL_INTERNSHIP.shortDescription}
                    </p>
                    <div className="grid grid-cols-1 gap-2 mb-6">
                      {[
                        'Land Surveying & Field Training',
                        'AutoCAD Drafting & Design',
                        'Site Visit & Construction Supervision',
                        'Performance-Based Stipend',
                        'Civil Offer Letter & Completion Letter',
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-brand-slate">
                          <CheckCircle size={14} className="text-amber-500 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <Link to="/internships/civil" className="btn btn-sm bg-amber-500 text-white hover:bg-amber-600 group">
                      Explore Civil Internship
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ══════════════════════════════════════════════════ */}
      <section className="section overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #1a3a6e 100%)' }}>
        <div className="container-xl">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-white/80 text-sm font-medium mb-4">
                <Star size={14} className="text-amber-400" /> Student Success Stories
              </div>
              <h2 className="heading-lg text-white">
                What Our Students Say
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTIMONIALS.slice(0, 3).map((testimonial) => (
                <motion.div key={testimonial.id} variants={fadeUp}>
                  <div className="card-glass-dark p-6 h-full">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                      "{testimonial.message}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-gradient-light flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                        <div className="text-white/50 text-xs">{testimonial.role} @ {testimonial.company}</div>
                      </div>
                      <div className="ml-auto">
                        <span className={`badge text-xs ${testimonial.domain === 'Civil' ? 'bg-amber-500/20 text-amber-300' : 'bg-brand-blue/30 text-blue-300'}`}>
                          {testimonial.domain}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container-xl">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <div className="section-tag">FAQ</div>
              <h2 className="heading-lg text-brand-dark">Frequently Asked Questions</h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {FAQS.map((faq, i) => (
                <motion.details
                  key={faq.id}
                  variants={fadeUp}
                  custom={i}
                  className="card p-6 group"
                >
                  <summary className="font-semibold text-brand-dark cursor-pointer flex items-center justify-between gap-4 list-none">
                    {faq.question}
                    <ChevronRight size={18} className="text-brand-blue shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-sm text-brand-slate/80 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </p>
                </motion.details>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══════════════════════════════════════════════════ */}
      <section className="section-sm">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden p-6 sm:p-10 md:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #155EEF 0%, #06B6D4 100%)' }}
          >
            <div className="bg-grid absolute inset-0 opacity-10" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={30} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of students already building their careers with STATS INNOTECH.
                Register now and get started today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  to="/register"
                  className="btn btn-lg bg-white text-brand-blue hover:bg-gray-50 font-bold shadow-lg w-full sm:w-auto"
                >
                  <Users size={20} /> Register Now — It's Free
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20 w-full sm:w-auto"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
