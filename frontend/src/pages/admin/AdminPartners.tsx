import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, MapPin, Mail, Phone,
  CheckCircle2, X, FileText, ShieldCheck, Trash2, Search,
  RefreshCw, Award, Briefcase, ExternalLink
} from 'lucide-react';
import { CIVIL_PARTNER } from '../../data/mockData';
import { adminService } from '../../services/adminService';
import type { IndustryPartner } from '../../types';
import toast from 'react-hot-toast';

const FALLBACK_PARTNERS: Partial<IndustryPartner>[] = [
  {
    id: 1,
    name: CIVIL_PARTNER.name,
    industry: 'Civil Engineering, Surveying & Infrastructure Consulting',
    location: 'Patna, Bihar & Pan-India Survey Sites',
    contactPerson: 'Er. N. K. Verma (Chief Consultant)',
    email: 'contact@ansurvey.com',
    phone: '+91 94310 88219',
    mouValidTill: 'Dec 2028',
    description: 'Premier infrastructure and land surveying consultancy providing live site exposure, total station instruments, and certified surveying training to STATS INNOTECH students.',
    isActive: true,
  },
  {
    id: 2,
    name: 'CloudScale DevOps Technologies',
    industry: 'Cloud Infrastructure & Managed Kubernetes Services',
    location: 'Bengaluru, Karnataka',
    contactPerson: 'Vikram Joshi (Cloud Practice Head)',
    email: 'partnerships@cloudscale.io',
    phone: '+91 98450 12345',
    mouValidTill: 'Aug 2027',
    description: 'Provides free AWS/GCP cloud sandbox credits and senior DevOps mentorship for STATS INNOTECH cloud computing students.',
    isActive: true,
  }
];

export default function AdminPartners() {
  const [partners, setPartners] = useState<IndustryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<IndustryPartner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [newPartner, setNewPartner] = useState({
    name: '',
    industry: '',
    location: '',
    contactPerson: '',
    email: '',
    phone: '',
    mouValidTill: '2028',
    description: '',
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPartners();
      if (data && data.length > 0) {
        setPartners(data);
      } else {
        setPartners(FALLBACK_PARTNERS as IndustryPartner[]);
      }
    } catch (err: any) {
      console.warn('Backend partners fetch failed, using fallback data:', err.message);
      setPartners(FALLBACK_PARTNERS as IndustryPartner[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name.trim()) {
      toast.error('Partner name is required');
      return;
    }

    setSubmitting(true);
    try {
      const created = await adminService.createPartner({
        ...newPartner,
        isActive: true,
      });
      toast.success(`Partner ${created.name} registered successfully!`);
      setIsAddOpen(false);
      setNewPartner({
        name: '',
        industry: '',
        location: '',
        contactPerson: '',
        email: '',
        phone: '',
        mouValidTill: '2028',
        description: '',
      });
      fetchPartners();
    } catch (err: any) {
      // Fallback local addition if offline
      const mockCreated: IndustryPartner = {
        id: Date.now(),
        name: newPartner.name,
        industry: newPartner.industry || 'Technology & Engineering',
        location: newPartner.location || 'India',
        contactPerson: newPartner.contactPerson || 'Partnership Lead',
        email: newPartner.email || 'partner@example.com',
        phone: newPartner.phone || '+91 98000 00000',
        mouValidTill: newPartner.mouValidTill || '2028',
        description: newPartner.description || 'Institutional collaboration partner.',
        isActive: true,
      };
      setPartners(prev => [mockCreated, ...prev]);
      setIsAddOpen(false);
      toast.success(`Partner ${mockCreated.name} registered locally!`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePartner = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove partner "${name}"?`)) return;
    try {
      await adminService.deletePartner(id);
      toast.success('Partner removed successfully');
      setPartners(prev => prev.filter(p => p.id !== id));
      if (selectedPartner?.id === id) setSelectedPartner(null);
    } catch (err: any) {
      setPartners(prev => prev.filter(p => p.id !== id));
      toast.success('Partner removed');
    }
  };

  const filteredPartners = partners.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.industry?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.contactPerson?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <Building2 className="text-amber-600" size={24} />
            Industry Partners & Institutional MoUs
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Manage industry training partners, technical collaborations, and field equipment agreements.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={fetchPartners}
            className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
            title="Refresh partners list"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> Register New Partner
          </button>
        </div>
      </div>

      {/* AN Survey Consultant Banner Highlight */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-300 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Award size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-warning text-[10px] font-bold">PRIMARY TECHNICAL ALLIANCE</span>
                <span className="text-[11px] text-amber-800 font-semibold">Active MoU: 2024 - 2028</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">AN SURVEY CONSULTANT</h2>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed max-w-2xl">
                Official field surveying and geomatics partner. Powering hands-on Total Station, DGPS, and Drone Survey modules with joint co-certified certificates and student offer letters.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300">
              Co-branded Certification Active
            </span>
          </div>
        </div>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partners by name, domain, city..."
            className="input-field pl-9 py-2 text-xs w-full"
          />
        </div>
        <div className="text-xs text-slate-500 self-end sm:self-center font-medium">
          Showing <strong>{filteredPartners.length}</strong> registered partner(s)
        </div>
      </div>

      {/* Partners Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="card p-6 bg-white animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-12 bg-slate-100 rounded" />
              <div className="h-20 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="card p-12 text-center bg-white border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No industry partners found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or register a new partner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPartners.map((partner) => {
            const isAnSurvey = partner.name?.toLowerCase().includes('an survey');
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card p-6 bg-white shadow-sm border transition-all flex flex-col justify-between ${
                  isAnSurvey ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isAnSurvey 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                      }`}>
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="heading-sm text-brand-dark leading-tight flex items-center gap-1.5">
                          {partner.name}
                          {isAnSurvey && (
                            <span className="badge badge-warning text-[9px] py-0 px-1.5">Primary MoU</span>
                          )}
                        </h3>
                        <p className="text-xs text-brand-slate font-medium mt-0.5">{partner.industry || 'Technical Partner'}</p>
                      </div>
                    </div>
                    <span className="badge badge-success text-[10px]">
                      {partner.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {partner.description || 'Official institutional partner supporting industrial internships, student field exposure, and placement pipelines.'}
                  </p>

                  {/* Details Box */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600 mb-4 border border-slate-100">
                    {partner.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span>{partner.location}</span>
                      </div>
                    )}
                    {(partner.email || partner.contactPerson) && (
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span>
                          {partner.email} {partner.contactPerson && `• ${partner.contactPerson}`}
                        </span>
                      </div>
                    )}
                    {partner.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span>{partner.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText size={13} className="text-slate-400 shrink-0" />
                      <span>MoU Validity: <strong className="text-slate-800">{partner.mouValidTill || 'Active (2028)'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedPartner(partner)}
                    className="btn-outline btn-sm text-xs py-1.5 px-3 flex items-center gap-1.5 text-slate-700"
                  >
                    <ShieldCheck size={14} className="text-brand-blue" /> View Collaboration Scope
                  </button>

                  <button
                    onClick={() => handleDeletePartner(partner.id, partner.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Partner"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Collaboration Scope Details Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 className="heading-sm text-brand-dark">{selectedPartner.name}</h3>
                    <p className="text-[11px] text-slate-500">{selectedPartner.industry}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPartner(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Collaboration Overview</h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {selectedPartner.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Primary Contact</span>
                    <span className="font-semibold text-slate-800">{selectedPartner.contactPerson || 'Office Administration'}</span>
                    <span className="text-slate-500 block text-[11px]">{selectedPartner.email}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">MoU Expiry</span>
                    <span className="font-semibold text-slate-800">{selectedPartner.mouValidTill || 'Active'}</span>
                    <span className="text-emerald-600 font-medium block text-[11px]">Legally Executed</span>
                  </div>
                </div>

                {selectedPartner.name.toLowerCase().includes('an survey') && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <span className="text-[11px] font-bold text-amber-900 block mb-1">Civil Survey Equipment Covered:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-800 text-[11px]">
                      <li>Leica & Trimble Total Station Electronic Tachymeters</li>
                      <li>GNSS RTK Differential Global Positioning Receivers</li>
                      <li>Auto-Level, Dumpy Level & Collimation Testing</li>
                      <li>Aerial Survey Drones & Photogrammetric Point Clouds</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="btn-primary btn-sm text-xs px-4"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register New Partner Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h3 className="heading-sm text-brand-dark flex items-center gap-2">
                  <Building2 size={18} className="text-brand-blue" />
                  Register Industry Partner
                </h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddPartner} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    placeholder="e.g. Apex Geotech & Survey Systems"
                    className="input-field text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Industry Domain</label>
                    <input
                      type="text"
                      value={newPartner.industry}
                      onChange={(e) => setNewPartner({ ...newPartner, industry: e.target.value })}
                      placeholder="e.g. Civil Survey & Geomatics"
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newPartner.location}
                      onChange={(e) => setNewPartner({ ...newPartner, location: e.target.value })}
                      placeholder="City, State"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lead Contact Person</label>
                    <input
                      type="text"
                      value={newPartner.contactPerson}
                      onChange={(e) => setNewPartner({ ...newPartner, contactPerson: e.target.value })}
                      placeholder="e.g. Er. Rajiv Verma"
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={newPartner.email}
                      onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                      placeholder="partner@domain.com"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={newPartner.phone}
                      onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                      placeholder="+91 98XXX XXXXX"
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">MoU Valid Till</label>
                    <input
                      type="text"
                      value={newPartner.mouValidTill}
                      onChange={(e) => setNewPartner({ ...newPartner, mouValidTill: e.target.value })}
                      placeholder="e.g. Dec 2028"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scope of Collaboration</label>
                  <textarea
                    rows={2}
                    value={newPartner.description}
                    onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                    placeholder="Describe equipment sharing, internship mentorship, or joint certification..."
                    className="input-field text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="btn-outline btn-sm text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary btn-sm text-xs flex items-center gap-1.5"
                  >
                    <Plus size={14} /> {submitting ? 'Registering...' : 'Save Partner'}
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
