import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderGit2, Search, Mail, Phone, Calendar, School,
  CheckCircle2, Clock, Eye, Trash2, RefreshCw, Send,
  FileText, ExternalLink, Filter, Layers, MessageSquare,
  AlertCircle, Sparkles, Check, Download, Building2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { ContactEnquiry } from '../../types';
import toast from 'react-hot-toast';

interface ParsedProjectEnquiry {
  raw: ContactEnquiry;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  domain: string;
  topicStatus: string;
  proposedTopic: string;
  deadline: string;
  notes: string;
  isProjectRequest: boolean;
}

const SAMPLE_PROJECT_CATALOG = [
  {
    id: 'proj-cat-1',
    title: 'High-Speed Automated Highway Alignment & Contour Modeling',
    domain: 'Civil Survey & Geomatics',
    techStack: ['Leica Total Station TS07', 'AutoCAD Civil 3D', 'GNSS RTK', 'ArcGIS'],
    partner: 'AN Survey Consultant',
    level: 'Final Year B.Tech / M.Tech',
    duration: '14 Days Delivery',
    downloadsCount: 42,
  },
  {
    id: 'proj-cat-2',
    title: 'Distributed Event-Driven Banking Ledger with Apache Kafka',
    domain: 'Cloud DevOps & Backend',
    techStack: ['Spring Boot 3', 'Apache Kafka', 'PostgreSQL', 'Docker', 'Kubernetes'],
    partner: 'STATS INNOTECH Lab',
    level: 'Final Year B.Tech CSE',
    duration: '10 Days Delivery',
    downloadsCount: 68,
  },
  {
    id: 'proj-cat-3',
    title: 'Multi-Modal Medical Imaging Cancer Detection using ResNet & PyTorch',
    domain: 'AI & Machine Learning',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'React.js', 'DICOM Imaging'],
    partner: 'STATS AI Division',
    level: 'B.Tech / M.Tech Thesis',
    duration: '12 Days Delivery',
    downloadsCount: 54,
  },
  {
    id: 'proj-cat-4',
    title: 'Microservices E-Commerce with Distributed Tracing & ArgoCD',
    domain: 'Cloud DevOps',
    techStack: ['Next.js', 'Go / Node.js', 'Terraform', 'Prometheus', 'Grafana'],
    partner: 'STATS CloudLab',
    level: 'Final Year B.Tech',
    duration: '10 Days Delivery',
    downloadsCount: 39,
  },
];

export default function AdminProjects() {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog'>('enquiries');
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [readFilter, setReadFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<ParsedProjectEnquiry | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await adminService.getEnquiries();
      setEnquiries(data);
    } catch (err: any) {
      console.warn('Failed to fetch enquiries from backend:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Parse structured project inquiry content
  const parseProjectEnquiry = (enquiry: ContactEnquiry): ParsedProjectEnquiry => {
    const isProject =
      enquiry.subject?.toLowerCase().includes('project') ||
      enquiry.message?.toLowerCase().includes('project') ||
      enquiry.message?.toLowerCase().includes('degree') ||
      enquiry.message?.toLowerCase().includes('domain');

    let college = 'Not specified';
    let degree = 'Academic Student';
    let domain = 'Technical Project';
    let topicStatus = 'Topic consultation needed';
    let proposedTopic = '';
    let deadline = '';
    let notes = enquiry.message;

    const lines = enquiry.message.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().startsWith('college/university:') || trimmed.toLowerCase().startsWith('college:')) {
        college = trimmed.split(':')[1]?.trim() || college;
      } else if (trimmed.toLowerCase().startsWith('degree & year:') || trimmed.toLowerCase().startsWith('degree:')) {
        degree = trimmed.split(':')[1]?.trim() || degree;
      } else if (trimmed.toLowerCase().startsWith('domain:')) {
        domain = trimmed.split(':')[1]?.trim() || domain;
      } else if (trimmed.toLowerCase().startsWith('topic status:') || trimmed.toLowerCase().startsWith('topic request:')) {
        topicStatus = trimmed.split(':')[1]?.trim() || topicStatus;
      } else if (trimmed.toLowerCase().startsWith('proposed topic/idea:') || trimmed.toLowerCase().startsWith('topic:')) {
        proposedTopic = trimmed.split(':')[1]?.trim() || proposedTopic;
      } else if (trimmed.toLowerCase().startsWith('target submission deadline:') || trimmed.toLowerCase().startsWith('target deadline:')) {
        deadline = trimmed.split(':')[1]?.trim() || deadline;
      } else if (trimmed.toLowerCase().startsWith('notes/requirements:') || trimmed.toLowerCase().startsWith('notes:')) {
        notes = trimmed.split(':')[1]?.trim() || notes;
      }
    });

    // If domain isn't explicitly in body, extract from subject e.g. [Project Development Request] AI & Machine Learning
    if (domain === 'Technical Project' && enquiry.subject) {
      if (enquiry.subject.includes('AI') || enquiry.subject.includes('Machine Learning')) {
        domain = 'AI & Machine Learning';
      } else if (enquiry.subject.includes('Civil') || enquiry.subject.includes('Survey')) {
        domain = 'Civil Survey & Geomatics';
      } else if (enquiry.subject.includes('Cloud') || enquiry.subject.includes('DevOps')) {
        domain = 'Cloud & DevOps';
      } else if (enquiry.subject.includes('MERN') || enquiry.subject.includes('Web') || enquiry.subject.includes('Full Stack')) {
        domain = 'Full Stack Web';
      }
    }

    return {
      raw: enquiry,
      studentName: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone || '',
      college,
      degree,
      domain,
      topicStatus,
      proposedTopic: proposedTopic || enquiry.subject,
      deadline: deadline || 'Standard (7-14 Days)',
      notes,
      isProjectRequest: isProject,
    };
  };

  const parsedList = enquiries.map(parseProjectEnquiry);

  // Filter project enquiries specifically
  const projectEnquiries = parsedList.filter((p) => p.isProjectRequest);

  const filteredEnquiries = projectEnquiries.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.studentName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.college.toLowerCase().includes(q) ||
      p.domain.toLowerCase().includes(q) ||
      p.proposedTopic.toLowerCase().includes(q) ||
      p.notes.toLowerCase().includes(q);

    const matchesDomain =
      domainFilter === 'ALL' ||
      p.domain.toLowerCase().includes(domainFilter.toLowerCase());

    const matchesRead =
      readFilter === 'ALL' ||
      (readFilter === 'UNREAD' && !p.raw.isRead) ||
      (readFilter === 'READ' && p.raw.isRead);

    return matchesSearch && matchesDomain && matchesRead;
  });

  const handleMarkRead = async (id: number) => {
    try {
      await adminService.markEnquiryRead(id);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
      );
      if (selectedEnquiry?.raw.id === id) {
        setSelectedEnquiry((prev) =>
          prev ? { ...prev, raw: { ...prev.raw, isRead: true } } : null
        );
      }
      toast.success('Marked project inquiry as reviewed');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project enquiry?')) return;
    try {
      await adminService.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry?.raw.id === id) setSelectedEnquiry(null);
      toast.success('Project enquiry removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const unreadCount = projectEnquiries.filter((p) => !p.raw.isRead).length;

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^\d]/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <FolderGit2 className="text-brand-blue" size={24} />
            Academic & Capstone Project Development Requests
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Student project development inquiries, university thesis requests, topic consultations, and delivery milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={fetchEnquiries}
            className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
            title="Refresh project inquiries"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200">
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare size={15} />
          Incoming Project Inquiries
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {unreadCount} New
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={15} />
          Project Catalog & Pre-Approved Deliverables ({SAMPLE_PROJECT_CATALOG.length})
        </button>
      </div>

      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card p-4 bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Project Enquiries</span>
              <div className="text-2xl font-black text-brand-dark mt-1">{projectEnquiries.length}</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">From students & clients</span>
            </div>

            <div className="card p-4 bg-amber-50/60 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Pending / Unread</span>
              <div className="text-2xl font-black text-amber-900 mt-1">{unreadCount}</div>
              <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">Requires mentor contact</span>
            </div>

            <div className="card p-4 bg-emerald-50/60 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Reviewed & Processed</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {projectEnquiries.length - unreadCount}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Topics assigned</span>
            </div>

            <div className="card p-4 bg-blue-50/60 border border-blue-200">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">Primary Collaboration</span>
              <div className="text-sm font-bold text-slate-900 mt-1">AN SURVEY CONSULTANT</div>
              <span className="text-[11px] text-brand-blue font-semibold mt-0.5 block">Co-stamped Civil reports</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="card p-4 bg-white shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student, college, topic, domain..."
                className="input-field pl-9 py-1.5 text-xs w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                {(['ALL', 'UNREAD', 'READ'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setReadFilter(r)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      readFilter === r
                        ? 'bg-white text-brand-dark shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r === 'ALL' ? 'All Status' : r === 'UNREAD' ? 'Unread' : 'Reviewed'}
                  </button>
                ))}
              </div>

              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="input-field py-1 text-xs w-48"
              >
                <option value="ALL">All Domains</option>
                <option value="AI">AI & Machine Learning</option>
                <option value="Civil">Civil Survey & Geomatics</option>
                <option value="Cloud">Cloud & DevOps</option>
                <option value="Web">Full Stack Web</option>
              </select>
            </div>
          </div>

          {/* Inquiries List & Detail Panel */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-5 bg-white animate-pulse space-y-2 border border-slate-200">
                  <div className="h-5 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="card p-12 text-center bg-white border border-slate-200">
              <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No project inquiries found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No project consultation requests match the current search or filter criteria. Students submitting requests from the public Projects page will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Inquiry Cards */}
              <div className="lg:col-span-7 space-y-3">
                {filteredEnquiries.map((item) => {
                  const isSelected = selectedEnquiry?.raw.id === item.raw.id;
                  const isUnread = !item.raw.isRead;
                  const isCivil = item.domain.toLowerCase().includes('civil');

                  return (
                    <motion.div
                      key={item.raw.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        setSelectedEnquiry(item);
                        if (isUnread) handleMarkRead(item.raw.id);
                      }}
                      className={`card p-5 bg-white border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-blue ring-2 ring-brand-blue/20 shadow-md'
                          : isUnread
                            ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isCivil
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                          }`}>
                            {item.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-brand-dark leading-tight">
                                {item.studentName}
                              </h4>
                              {isUnread && (
                                <span className="badge badge-warning text-[9px] py-0 px-1.5">
                                  NEW REQUEST
                                </span>
                              )}
                              {isCivil && (
                                <span className="badge badge-warning text-[9px] py-0 px-1.5 flex items-center gap-1">
                                  <Building2 size={10} /> AN Survey MoU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <School size={12} className="text-slate-400" />
                              {item.college} • {item.degree}
                            </span>
                          </div>
                        </div>

                        <span className="badge badge-info text-[10px] shrink-0">
                          {item.domain}
                        </span>
                      </div>

                      {/* Topic Headline */}
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Project Topic / Consultation Area:
                        </span>
                        <div className="font-semibold text-slate-800 line-clamp-1 mt-0.5">
                          {item.proposedTopic}
                        </div>
                      </div>

                      {/* Footer Details */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-slate-600">
                            <Calendar size={12} className="text-slate-400" />
                            Target: <strong className="text-slate-800">{item.deadline}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.raw.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete inquiry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Column: Full Inquiry Inspection Panel */}
              <div className="lg:col-span-5 sticky top-20">
                {selectedEnquiry ? (
                  <div className="card p-6 bg-white shadow-sm border border-slate-200 space-y-5">
                    <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge badge-info text-xs">{selectedEnquiry.domain}</span>
                          <span className={`badge text-xs ${selectedEnquiry.raw.isRead ? 'badge-success' : 'badge-warning'}`}>
                            {selectedEnquiry.raw.isRead ? 'Reviewed' : 'Action Required'}
                          </span>
                        </div>
                        <h3 className="heading-sm text-brand-dark leading-tight mt-1">{selectedEnquiry.studentName}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{selectedEnquiry.degree}</p>
                      </div>
                      <button
                        onClick={() => setSelectedEnquiry(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Close
                      </button>
                    </div>

                    {/* Contact & University Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <School size={14} className="text-slate-400 shrink-0" />
                        <span>University: <strong>{selectedEnquiry.college}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail size={14} className="text-slate-400 shrink-0" />
                        <a href={`mailto:${selectedEnquiry.email}`} className="text-brand-blue hover:underline">
                          {selectedEnquiry.email}
                        </a>
                      </div>
                      {selectedEnquiry.phone && (
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone size={14} className="text-slate-400 shrink-0" />
                          <span>Phone: <strong>{selectedEnquiry.phone}</strong></span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar size={14} className="text-slate-400 shrink-0" />
                        <span>Target Submission: <strong className="text-rose-600">{selectedEnquiry.deadline}</strong></span>
                      </div>
                    </div>

                    {/* Topic Consultation Scope */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        Topic Preference & Status
                      </div>
                      <div className="text-slate-800 font-semibold">
                        {selectedEnquiry.topicStatus}
                      </div>

                      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] pt-2 border-t border-slate-200">
                        Proposed Topic or Domain Focus
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {selectedEnquiry.proposedTopic}
                      </p>

                      {selectedEnquiry.notes && (
                        <>
                          <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] pt-2 border-t border-slate-200">
                            Student Notes & Requirements
                          </div>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[11px]">
                            {selectedEnquiry.notes}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Dual AN Survey Consultant Highlight */}
                    {selectedEnquiry.domain.toLowerCase().includes('civil') && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                        <div className="font-bold flex items-center gap-1.5 mb-1">
                          <Building2 size={13} className="text-amber-700" />
                          AN Survey Consultant Co-Certification Protocol
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-800">
                          This project qualifies for Leica Total Station / GNSS field validation datasets and an official AN Survey Consultant co-stamp report for university approval.
                        </p>
                      </div>
                    )}

                    {/* Quick Response Actions */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Direct Mentor Engagement
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {selectedEnquiry.phone ? (
                          <a
                            href={`https://wa.me/91${getCleanPhone(selectedEnquiry.phone)}?text=${encodeURIComponent(
                              `Hello ${selectedEnquiry.studentName}, this is STATS INNOTECH regarding your ${selectedEnquiry.domain} project development consultation request. We have reviewed your topic requirement.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-xs py-2 px-3 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Send size={13} /> WhatsApp
                          </a>
                        ) : (
                          <button disabled className="btn-outline text-xs py-2 opacity-50">
                            No Phone
                          </button>
                        )}

                        <a
                          href={`mailto:${selectedEnquiry.email}?subject=${encodeURIComponent(
                            `[STATS INNOTECH] Project Consultation - ${selectedEnquiry.domain}`
                          )}&body=${encodeURIComponent(
                            `Hi ${selectedEnquiry.studentName},\n\nThank you for reaching out to STATS INNOTECH regarding your academic project development.\n\nOur senior engineering architects have reviewed your request for ${selectedEnquiry.domain}.\n\n`
                          )}`}
                          className="btn-outline text-xs py-2 px-3 flex items-center justify-center gap-1.5"
                        >
                          <Mail size={13} /> Send Email
                        </a>
                      </div>

                      {!selectedEnquiry.raw.isRead && (
                        <button
                          onClick={() => handleMarkRead(selectedEnquiry.raw.id)}
                          className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50 mt-1"
                        >
                          <CheckCircle2 size={14} /> Mark as Reviewed
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="card p-10 text-center bg-white border border-slate-200">
                    <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">
                      Select any project inquiry from the list on the left to inspect student details, university, and initiate mentor contact.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Project Catalog & Pre-Approved Deliverables */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="heading-sm text-brand-dark">Approved Capstone Projects & Deliverable Packages</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Standardized full-stack, cloud, AI, and civil surveying packages supplied to college students. Each package includes complete commented source code, university IEEE documentation report, PPT presentation, and live remote laptop setup.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_PROJECT_CATALOG.map((proj) => (
              <div key={proj.id} className="card p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="badge badge-info text-[10px]">{proj.domain}</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {proj.duration}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-brand-dark mb-1 leading-snug">{proj.title}</h4>
                  <p className="text-[11px] text-slate-500 mb-3">Partner / Lab: <strong>{proj.partner}</strong> • {proj.level}</p>

                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Included Technology Stack:
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {proj.downloadsCount} Deliverables Assigned
                  </span>
                  <button
                    onClick={() => toast.success(`Viewing full deliverable scope for: ${proj.title}`)}
                    className="btn-outline btn-sm text-xs py-1 px-3 flex items-center gap-1"
                  >
                    <FileText size={13} /> View Deliverable Scope
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
