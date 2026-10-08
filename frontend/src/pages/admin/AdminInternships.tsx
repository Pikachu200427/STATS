import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Plus, Search, Edit2, Trash2, Building2,
  CheckCircle2, X, RefreshCw, Filter
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Internship } from '../../types';
import toast from 'react-hot-toast';

export default function AdminInternships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [editingItem, setEditingItem] = useState<Internship | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newInternship, setNewInternship] = useState<Partial<Internship>>({
    title: '',
    domain: 'CSE',
    duration: '8 Weeks / 12 Weeks',
    stipendAmount: 'Performance-based + ₹10,000 Milestone Grant',
    shortDescription: '',
    status: 'ACTIVE',
    mode: 'ONLINE',
  });

  const loadInternships = async () => {
    setLoading(true);
    try {
      const data = await adminService.getInternships();
      setInternships(data);
    } catch {
      toast.error('Failed to load internships from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  const filtered = internships.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.shortDescription || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain =
      selectedDomain === 'ALL' || (item.domain || '').toUpperCase() === selectedDomain.toUpperCase();
    return matchesSearch && matchesDomain;
  });

  const handleDelete = async (id: number | string, title: string) => {
    if (!confirm(`Delete internship track "${title}" from database?`)) return;
    try {
      await adminService.deleteInternship(id);
      setInternships((prev) => prev.filter((i) => String(i.id) !== String(id)));
      toast.success(`Internship "${title}" deleted.`);
    } catch {
      toast.error('Failed to delete internship');
    }
  };

  const handleToggleStatus = async (item: Internship) => {
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const updated = await adminService.updateInternship(item.id, {
        ...item,
        status: newStatus as any,
      });
      setInternships((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      toast.success(`Internship track status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const updated = await adminService.updateInternship(editingItem.id, editingItem);
      setInternships((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
      toast.success('Internship track updated in database!');
      setEditingItem(null);
    } catch {
      toast.error('Failed to update internship');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternship.title) {
      toast.error('Please enter internship title');
      return;
    }

    try {
      const isCivil = newInternship.domain === 'CIVIL';
      const created = await adminService.createInternship({
        ...newInternship,
        partnerName: isCivil ? 'AN Survey Consultant' : undefined,
        status: 'ACTIVE',
      });

      setInternships([created, ...internships]);
      setIsCreateOpen(false);
      setNewInternship({
        title: '',
        domain: 'CSE',
        duration: '8 Weeks / 12 Weeks',
        stipendAmount: 'Performance-based + ₹10,000 Milestone Grant',
        shortDescription: '',
        status: 'ACTIVE',
        mode: 'ONLINE',
      });
      toast.success('New internship track published to catalog!');
    } catch {
      toast.error('Failed to create internship track');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <Briefcase size={22} className="text-brand-blue" /> Internship Tracks Catalog
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Manage Computer Science Engineering and Civil Engineering (AN Survey Consultant) tracks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadInternships}
            disabled={loading}
            className="btn-secondary btn-sm flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> Add Internship Track
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
            placeholder="Search internships by title or technology..."
            className="form-input pl-10"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDomain('ALL')}
            className={`btn-sm text-xs rounded-xl transition-all ${
              selectedDomain === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Tracks
          </button>
          <button
            onClick={() => setSelectedDomain('CSE')}
            className={`btn-sm text-xs rounded-xl transition-all ${
              selectedDomain === 'CSE' ? 'bg-blue-600 text-white font-bold' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            CSE Tracks
          </button>
          <button
            onClick={() => setSelectedDomain('CIVIL')}
            className={`btn-sm text-xs rounded-xl transition-all ${
              selectedDomain === 'CIVIL' ? 'bg-amber-600 text-white font-bold' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Civil Track (AN Survey)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading live internship tracks...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No internship tracks found matching current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4">Track Title</th>
                  <th className="py-3.5 px-4">Domain & Collaboration</th>
                  <th className="py-3.5 px-4">Duration & Mode</th>
                  <th className="py-3.5 px-4">Stipend Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isCivil = (item.domain || '').toUpperCase() === 'CIVIL';
                  const isActive = item.status === 'ACTIVE';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-brand-dark text-sm leading-tight">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.technology || 'Core Engineering'}</div>
                      </td>
                      <td className="py-3 px-4">
                        {isCivil ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            AN Survey Consultant
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            STATS CSE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {item.duration || '8 Weeks'} ({item.mode || 'Online'})
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">
                        {item.stipendAmount || 'Performance-based'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(item)}
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
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded-lg text-brand-blue hover:bg-blue-50 transition-colors"
                            title="Edit Track"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete Track"
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-brand-dark">Edit Internship Track</h3>
                <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Track Title</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                    <select
                      value={editingItem.domain}
                      onChange={(e) => setEditingItem({ ...editingItem, domain: e.target.value })}
                      className="form-input form-select text-xs"
                    >
                      <option value="CSE">CSE Track</option>
                      <option value="CIVIL">Civil Track</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingItem.duration}
                      onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stipend Terms</label>
                  <input
                    type="text"
                    value={editingItem.stipendAmount || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, stipendAmount: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overview Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.shortDescription || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary btn-sm">
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

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-brand-dark">Create New Internship Track</h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Track Title *</label>
                  <input
                    type="text"
                    required
                    value={newInternship.title}
                    onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                    placeholder="e.g. AI & Computer Vision Micro-Internship"
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                    <select
                      value={newInternship.domain}
                      onChange={(e) => setNewInternship({ ...newInternship, domain: e.target.value })}
                      className="form-input form-select text-xs"
                    >
                      <option value="CSE">CSE Track</option>
                      <option value="CIVIL">Civil Track (AN Survey)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newInternship.duration}
                      onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stipend Details</label>
                  <input
                    type="text"
                    value={newInternship.stipendAmount}
                    onChange={(e) => setNewInternship({ ...newInternship, stipendAmount: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Summary Description</label>
                  <textarea
                    rows={3}
                    value={newInternship.shortDescription}
                    onChange={(e) => setNewInternship({ ...newInternship, shortDescription: e.target.value })}
                    placeholder="Brief description of project outcomes and site work..."
                    className="form-input text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary btn-sm flex items-center gap-1.5">
                    <Plus size={14} /> Create Track
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
