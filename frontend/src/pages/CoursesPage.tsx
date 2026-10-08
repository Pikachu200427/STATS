import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Users, Clock, Star, ArrowRight, X, SlidersHorizontal } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { courseService } from '../services/courseService';
import { formatCurrency, getLevelColor, getLevelLabel, calculateDiscount } from '../utils';
import type { Course, CourseLevel, CourseStatus } from '../types';

const CATEGORIES = ['All', 'Programming', 'Web Development', 'Cloud', 'Security', 'AI/ML', 'Civil Engineering'];
const LEVELS: CourseLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const TECHNOLOGIES = ['All', 'Java', 'Python', 'C / C++', 'MERN', 'AWS', 'Security', 'Python, PyTorch', 'AutoCAD, Civil 3D', 'Autodesk Revit', 'STAAD.Pro'];

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [technology, setTechnology] = useState('All');
  const [level, setLevel] = useState<CourseLevel | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    courseService.getAllCourses()
      .then((data) => {
        if (data && data.length > 0) {
          setCourses(data);
        }
      })
      .catch((err) => {
        console.warn('Backend courses API unavailable, using offline fallback', err);
      });
  }, []);

  const filtered = useMemo(() => {
    let list = [...courses];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.technology.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (category !== 'All') list = list.filter((c) => c.category === category);
    if (technology !== 'All') list = list.filter((c) => c.technology === technology);
    if (level !== 'ALL') list = list.filter((c) => c.level === level);

    if (sortBy === 'price-asc') list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    else if (sortBy === 'price-desc') list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    else if (sortBy === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'popular') list.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));

    return list;
  }, [search, category, technology, level, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setTechnology('All');
    setLevel('ALL');
    setSortBy('popular');
  };

  const hasActiveFilters = search || category !== 'All' || technology !== 'All' || level !== 'ALL';

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="container-xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-tag border border-white/20 bg-white/10 text-white/90 mx-auto w-fit mb-6">
              <BookOpen size={14} /> Technical Courses
            </div>
            <h1 className="heading-xl text-white mb-4">Industry-Ready Courses</h1>
            <p className="body-lg text-white/70 max-w-2xl mx-auto">
              Master in-demand technologies with our expert-led courses. From programming to cloud computing — we have everything to launch your career.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-[68px] sm:top-[74px] md:top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="container-xl py-3.5">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, technology, instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="course-search"
                className="form-input pl-9 py-2.5 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="course-sort"
              className="form-select py-2.5 text-sm w-auto min-w-[140px]"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={`btn btn-sm gap-2 ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-red-400" />
              )}
            </button>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 pt-3 mt-3"
            >
              <div className="flex flex-wrap gap-4">
                {/* Category */}
                <div className="flex-1 min-w-48">
                  <label className="form-label text-xs">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} id="course-category" className="form-select text-sm py-2">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                {/* Technology */}
                <div className="flex-1 min-w-48">
                  <label className="form-label text-xs">Technology</label>
                  <select value={technology} onChange={(e) => setTechnology(e.target.value)} id="course-tech" className="form-select text-sm py-2">
                    {TECHNOLOGIES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {/* Level */}
                <div>
                  <label className="form-label text-xs">Level</label>
                  <div className="flex items-center gap-2 mt-1">
                    {(['ALL', ...LEVELS] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${level === l
                            ? 'bg-brand-blue text-white'
                            : 'bg-gray-100 text-brand-slate hover:bg-gray-200'
                          }`}
                      >
                        {l === 'ALL' ? 'All Levels' : getLevelLabel(l)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-xl py-10 sm:py-14 md:py-16 pb-24 sm:pb-28 md:pb-32">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-brand-slate">
            Showing <span className="font-bold text-brand-dark">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-brand-blue hover:underline">
              Clear all filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-brand-dark mb-2">No courses found</h3>
            <p className="text-brand-slate/70 text-sm mb-4">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn-primary btn-sm">Clear Filters</button>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((course) => {
              const discount = calculateDiscount(course.price, course.discountPrice);
              return (
                <motion.div key={course.id} variants={fadeUp}>
                  <div className="card-hover p-0 overflow-hidden group h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="relative h-44 bg-gradient-to-br from-brand-dark to-brand-blue overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-grid opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                          <BookOpen size={26} className="text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-brand-dark/80 to-transparent" />
                      {course.status === 'COMING_SOON' && (
                        <div className="absolute top-3 right-3 badge bg-amber-500 text-white">Coming Soon</div>
                      )}
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 badge bg-green-500 text-white">{discount}% OFF</div>
                      )}
                      {course.rating ? (
                        <div className="absolute bottom-2 left-3 flex items-center gap-1">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-white text-xs font-semibold">{course.rating}</span>
                          <span className="text-white/60 text-xs">({course.totalStudents || 0} students)</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`badge text-xs ${getLevelColor(course.level)}`}>
                          {getLevelLabel(course.level)}
                        </span>
                        <span className="badge-gray text-xs">{course.technology}</span>
                      </div>

                      <h3 className="font-bold text-brand-dark text-base mb-2 group-hover:text-brand-blue transition-colors leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-xs text-brand-slate/70 leading-relaxed mb-4 flex-1">
                        {course.shortDescription}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-brand-slate/60 mb-4">
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {course.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {course.duration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-brand-dark text-xl">
                            {formatCurrency(course.discountPrice || course.price)}
                          </span>
                          {course.discountPrice && (
                            <span className="text-sm text-brand-slate/40 line-through">
                              {formatCurrency(course.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/courses/${course.slug}`}
                            className="btn-ghost btn-sm text-xs"
                          >
                            Details
                          </Link>
                          <Link
                            to={course.status === 'COMING_SOON' ? '#' : `/courses/${course.slug}/enroll`}
                            className={`btn-sm ${course.status === 'COMING_SOON' ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                          >
                            {course.status === 'COMING_SOON' ? 'Soon' : 'Enroll'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
