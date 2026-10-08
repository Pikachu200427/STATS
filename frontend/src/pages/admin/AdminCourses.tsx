import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Search, Edit2, Trash2,
  X, RefreshCw, Filter, CheckCircle2, AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Course } from '../../types';
import { formatCurrency, getLevelColor } from '../../utils';
import toast from 'react-hot-toast';

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New course form state
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    technology: 'Java',
    level: 'BEGINNER',
    price: 4999,
    discountPrice: 2499,
    duration: '8 Weeks',
    instructor: 'STATS Technical Faculty',
    shortDescription: '',
    status: 'ACTIVE',
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCourses();
      setCourses(data);
    } catch {
      toast.error('Failed to load courses from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.technology || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || c.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleDeleteCourse = async (id: number | string, title: string) => {
    if (!confirm(`Are you sure you want to delete course "${title}" from the database?`)) return;

    try {
      await adminService.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => String(c.id) !== String(id)));
      toast.success(`Course "${title}" deleted from database`);
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const handleToggleStatus = async (course: Course) => {
    const newStatus = course.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const updated = await adminService.updateCourse(course.id, {
        ...course,
        status: newStatus as any,
      });
      setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));
      toast.success(`Course status changed to ${newStatus}`);
    } catch {
      toast.error('Failed to update course status');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      const updated = await adminService.updateCourse(editingCourse.id, editingCourse);
      setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? updated : c)));
      toast.success('Course updated successfully in database!');
      setEditingCourse(null);
    } catch {
      toast.error('Failed to update course in database');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.technology) {
      toast.error('Please enter course title and technology');
      return;
    }

    try {
      const slug = (newCourse.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload: Partial<Course> = {
        title: newCourse.title,
        slug,
        shortDescription: newCourse.shortDescription || 'Comprehensive hands-on training module.',
        description: newCourse.shortDescription || 'Hands-on curriculum with live industry projects.',
        technology: newCourse.technology,
        level: newCourse.level || 'BEGINNER',
        price: Number(newCourse.price) || 4999,
        discountPrice: Number(newCourse.discountPrice) || 2499,
        duration: newCourse.duration || '8 Weeks',
        instructor: newCourse.instructor || 'STATS Technical Team',
        status: 'ACTIVE',
      };

      const created = await adminService.createCourse(payload);
      setCourses([created, ...courses]);
      setIsCreateModalOpen(false);
      setNewCourse({
        title: '',
        technology: 'Java',
        level: 'BEGINNER',
        price: 4999,
        discountPrice: 2499,
        duration: '8 Weeks',
        instructor: 'STATS Technical Faculty',
        shortDescription: '',
        status: 'ACTIVE',
      });
      toast.success('Course created successfully in database!');
    } catch {
      toast.error('Failed to create course in database');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <BookOpen size={22} className="text-brand-blue" /> Course Management
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            <strong>{courses.length}</strong> courses published with dynamic batch enrollment & pricing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadCourses}
            disabled={loading}
            className="btn-secondary btn-sm flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> Add New Course
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title, slug, or technology..."
            className="form-input pl-10"
          />
        </div>

        <div className="relative min-w-[200px]">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="form-input form-select pl-9 pr-8"
          >
            <option value="ALL">All Experience Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading courses from live database...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No courses found matching current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4">Course Title</th>
                  <th className="py-3.5 px-4">Technology</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Tuition Fee</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => {
                  const isActive = c.status === 'ACTIVE';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-brand-dark text-sm leading-tight">{c.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">slug: /{c.slug} • By {c.instructor || 'Faculty'}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {c.technology}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(c.level)}`}>
                          {c.level}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-brand-dark">
                          {formatCurrency(c.discountPrice || c.price)}
                        </div>
                        {c.discountPrice && (
                          <div className="line-through text-slate-400 text-[10px]">
                            {formatCurrency(c.price)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {c.duration || '8 Weeks'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingCourse(c)}
                            className="p-1.5 rounded-lg text-brand-blue hover:bg-blue-50 transition-colors"
                            title="Edit Course"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.id, c.title)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      <AnimatePresence>
        {editingCourse && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-brand-dark">Edit Course Details</h3>
                <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Technology</label>
                    <input
                      type="text"
                      required
                      value={editingCourse.technology}
                      onChange={(e) => setEditingCourse({ ...editingCourse, technology: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Experience Level</label>
                    <select
                      value={editingCourse.level}
                      onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as any })}
                      className="form-input form-select text-xs"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      value={editingCourse.price}
                      onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Discount Price (₹)</label>
                    <input
                      type="number"
                      value={editingCourse.discountPrice || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, discountPrice: Number(e.target.value) })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingCourse.duration || '8 Weeks'}
                      onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lead Instructor</label>
                    <input
                      type="text"
                      value={editingCourse.instructor || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                  <textarea
                    rows={3}
                    value={editingCourse.shortDescription || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, shortDescription: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingCourse(null)} className="btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary btn-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Course Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-brand-dark">Create New Catalog Course</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="e.g. Distributed Microservices with Spring Boot & Kafka"
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Technology *</label>
                    <input
                      type="text"
                      required
                      value={newCourse.technology}
                      onChange={(e) => setNewCourse({ ...newCourse, technology: e.target.value })}
                      placeholder="e.g. Java, Python, React, AutoCAD"
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Level</label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value as any })}
                      className="form-input form-select text-xs"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Base Tuition (₹)</label>
                    <input
                      type="number"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Discount Price (₹)</label>
                    <input
                      type="number"
                      value={newCourse.discountPrice}
                      onChange={(e) => setNewCourse({ ...newCourse, discountPrice: Number(e.target.value) })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Instructor</label>
                    <input
                      type="text"
                      value={newCourse.instructor}
                      onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Curriculum Summary</label>
                  <textarea
                    rows={3}
                    value={newCourse.shortDescription}
                    onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
                    placeholder="Brief description of skills, project deliverables, and real-world outcomes..."
                    className="form-input text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary btn-sm flex items-center gap-1.5">
                    <Plus size={14} /> Create Course
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
