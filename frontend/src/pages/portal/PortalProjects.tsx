import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderGit2, CheckCircle2, Clock, AlertCircle, ExternalLink,
  Globe, UploadCloud, MessageSquare, ChevronRight, Award, Plus,
  Sparkles, DollarSign, Send, X, Laptop, FileText, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { contactService } from '../../services/contactService';
import { useAuth } from '../../context/AuthContext';

interface ProjectMilestone {
  title: string;
  completed: boolean;
  dueDate: string;
}

interface StudentProject {
  id: string;
  title: string;
  track: string;
  status: 'In Progress' | 'Under Review' | 'Approved' | 'Revision Requested';
  progress: number;
  githubUrl: string;
  demoUrl: string;
  mentor: string;
  mentorFeedback: string;
  milestones: ProjectMilestone[];
}

export default function PortalProjects() {
  const { user, student } = useAuth();
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [githubInput, setGithubInput] = useState('');
  const [demoInput, setDemoInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [requestForm, setRequestForm] = useState({
    domain: 'Computer Science & Engineering',
    degree: 'B.Tech 4th Year',
    topicPreference: 'need_suggestions',
    existingTopic: '',
    deadline: '',
    notes: '',
  });

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleUpdateLinks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput && !demoInput) {
      toast.error('Please provide at least one URL to update');
      return;
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
            ...p,
            githubUrl: githubInput || p.githubUrl,
            demoUrl: demoInput || p.demoUrl,
            status: 'Under Review',
          }
          : p
      )
    );
    toast.success('Project repository links updated and submitted for mentor review!');
    setGithubInput('');
    setDemoInput('');
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const studentName = user ? `${user.firstName} ${user.lastName}` : 'Enrolled Student';
      const studentEmail = user?.email || 'student@statsinnotech.in';
      const studentPhone = user?.phone || 'Not provided';

      const subject = `[Portal Project Request] ${requestForm.domain} - ${studentName}`;
      const message = [
        `Student Name: ${studentName}`,
        `Email: ${studentEmail}`,
        `Phone: ${studentPhone}`,
        `College: ${student?.college || 'Enrolled Student'}`,
        `Degree: ${requestForm.degree}`,
        `Domain: ${requestForm.domain}`,
        `Topic Request: ${requestForm.topicPreference === 'need_suggestions' ? 'Please suggest topics' : 'Has a proposed topic'}`,
        requestForm.existingTopic ? `Topic: ${requestForm.existingTopic}` : '',
        requestForm.deadline ? `Target Deadline: ${requestForm.deadline}` : '',
        requestForm.notes ? `Notes: ${requestForm.notes}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await contactService.sendMessage({
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
        subject,
        message,
      });

      toast.success('Project consultation request submitted! Our mentor will contact you shortly.');
      setIsModalOpen(false);
      setRequestForm({
        domain: 'Computer Science & Engineering',
        degree: 'B.Tech 4th Year',
        topicPreference: 'need_suggestions',
        existingTopic: '',
        deadline: '',
        notes: '',
      });
    } catch (err) {
      console.error('Request failed', err);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: StudentProject['status']) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-success text-xs font-semibold">Approved ✓</span>;
      case 'Under Review':
        return <span className="badge badge-warning text-xs font-semibold">Under Review ⏳</span>;
      case 'Revision Requested':
        return <span className="badge badge-danger text-xs font-semibold">Needs Revision</span>;
      default:
        return <span className="badge badge-info text-xs font-semibold">In Progress</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark">My Capstone Projects</h1>
          <p className="text-xs text-brand-slate mt-1">
            Track development milestones, submit repository deliverables, and review faculty remarks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 self-start"
        >
          <Plus size={15} /> Request Project Development
        </button>
      </div>

      {/* College Project Development Service Banner */}
      <div className="card p-6 bg-gradient-to-r from-brand-dark via-slate-900 to-brand-blue text-white rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-brand-cyan">
              <Sparkles size={13} className="text-amber-400" /> College Project Development Service
            </span>
            <h2 className="text-lg md:text-xl font-bold">
              Need a Final Year or Semester Capstone Project?
            </h2>
            <p className="text-xs text-white/80 leading-relaxed">
              We offer comprehensive project development for college students. Tell us your domain and we will suggest trending topics tailored to your university curriculum, complete source code, report, PPT, and 1-on-1 viva coaching.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary bg-white text-brand-dark hover:bg-slate-100 text-xs py-2.5 px-5 font-bold"
            >
              Request Topics &amp; Quote
            </button>
            <Link
              to="/projects"
              className="btn-outline border-white/30 text-white hover:bg-white/10 text-xs py-2 px-4 text-center"
            >
              View Project Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Projects List or Clean Empty State */}
      {projects.length === 0 ? (
        <div className="card p-12 text-center bg-white border border-slate-200">
          <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-brand-dark mb-1">No Projects Currently Assigned</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
            You don't have any active projects under development yet. If you need a custom final-year or semester project, request our engineering team to suggest topics and begin development.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-6 inline-flex items-center gap-1.5"
          >
            <Plus size={15} /> Request Project Development
          </button>
        </div>
      ) : (
        <>
          {/* Project selector cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`cursor-pointer card p-5 bg-white border transition-all ${
                  selectedProjectId === proj.id
                    ? 'border-brand-blue ring-1 ring-brand-blue shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider">{proj.track}</span>
                  {getStatusBadge(proj.status)}
                </div>
                <h3 className="text-sm font-bold text-brand-dark mb-3 leading-snug">{proj.title}</h3>

                {/* Progress Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Milestone Completion</span>
                    <span className="font-semibold text-brand-dark">{proj.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        proj.progress === 100 ? 'bg-emerald-500' : 'bg-brand-blue'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>Mentor: <strong className="text-slate-700">{proj.mentor}</strong></span>
                  <span className="text-brand-blue font-medium flex items-center gap-0.5">
                    View Details <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Project Detail Box */}
          {activeProject && (
            <div className="card p-6 bg-white shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-info text-xs">{activeProject.track}</span>
                    {getStatusBadge(activeProject.status)}
                  </div>
                  <h2 className="heading-sm text-brand-dark">{activeProject.title}</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline btn-sm text-xs flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} /> Repository
                    </a>
                  )}
                  {activeProject.demoUrl && (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary btn-sm text-xs flex items-center gap-1.5"
                    >
                      <Globe size={14} /> Live Demo / Files
                    </a>
                  )}
                </div>
              </div>

              {/* Mentor Feedback banner */}
              {activeProject.mentorFeedback && (
                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-xs text-brand-blue mb-1">
                    <MessageSquare size={14} />
                    Mentor Review &amp; Remarks — {activeProject.mentor}
                  </div>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    "{activeProject.mentorFeedback}"
                  </p>
                </div>
              )}

              {/* Milestones Checklist */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Project Milestones</h3>
                <div className="space-y-2.5">
                  {activeProject.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        m.completed
                          ? 'bg-emerald-50/50 border-emerald-100 text-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {m.completed ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Clock size={16} className="text-slate-400 shrink-0" />
                        )}
                        <span className={m.completed ? 'line-through text-slate-500' : 'font-medium'}>{m.title}</span>
                      </div>
                      <span className={`text-[11px] font-medium ${m.completed ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {m.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission / URL Update Form */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Submit Deliverables / Update Links
                </h3>
                <form onSubmit={handleUpdateLinks} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub / Code Repo URL</label>
                    <input
                      type="url"
                      value={githubInput}
                      onChange={(e) => setGithubInput(e.target.value)}
                      placeholder="https://github.com/..."
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Live Demo / Google Drive / CAD URL</label>
                    <input
                      type="url"
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      placeholder="https://preview.com or https://drive..."
                      className="input-field text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5">
                      <UploadCloud size={14} /> Submit for Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Project Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="heading-sm text-brand-dark">Request Project Development</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Custom topic suggestions • Code, report &amp; viva guidance
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                  <select
                    value={requestForm.domain}
                    onChange={(e) => setRequestForm({ ...requestForm, domain: e.target.value })}
                    className="input-field text-xs"
                  >
                    <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                    <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                    <option value="Civil Engineering (Survey & Design)">Civil Engineering (Survey &amp; Design)</option>
                    <option value="Cloud Computing & DevOps">Cloud Computing &amp; DevOps</option>
                    <option value="IoT & Embedded Systems">IoT &amp; Embedded Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Degree &amp; Year</label>
                  <select
                    value={requestForm.degree}
                    onChange={(e) => setRequestForm({ ...requestForm, degree: e.target.value })}
                    className="input-field text-xs"
                  >
                    <option value="B.Tech 4th Year (Final Year Project)">B.Tech 4th Year (Final Year Project)</option>
                    <option value="B.Tech 3rd Year (Minor Project)">B.Tech 3rd Year (Minor Project)</option>
                    <option value="BCA Final Semester">BCA Final Semester</option>
                    <option value="MCA Capstone">MCA Capstone</option>
                    <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-800">Topic Preference</label>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="topicPref"
                        checked={requestForm.topicPreference === 'need_suggestions'}
                        onChange={() => setRequestForm({ ...requestForm, topicPreference: 'need_suggestions' })}
                        className="text-brand-blue"
                      />
                      <span>Suggest 3-5 trending topics for my domain</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="topicPref"
                        checked={requestForm.topicPreference === 'has_topic'}
                        onChange={() => setRequestForm({ ...requestForm, topicPreference: 'has_topic' })}
                        className="text-brand-blue"
                      />
                      <span>I already have a specific topic / title</span>
                    </label>
                  </div>

                  {requestForm.topicPreference === 'has_topic' && (
                    <input
                      type="text"
                      value={requestForm.existingTopic}
                      onChange={(e) => setRequestForm({ ...requestForm, existingTopic: e.target.value })}
                      placeholder="Enter proposed project title..."
                      className="input-field text-xs bg-white mt-1.5"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Submission Deadline</label>
                  <input
                    type="text"
                    value={requestForm.deadline}
                    onChange={(e) => setRequestForm({ ...requestForm, deadline: e.target.value })}
                    placeholder="e.g. Within 15 Days"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Special Requirements / Tech Stack Notes</label>
                  <textarea
                    rows={2}
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                    placeholder="e.g. Must include React and PostgreSQL..."
                    className="input-field text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-outline btn-sm text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary btn-sm text-xs flex items-center gap-1.5"
                  >
                    <Send size={13} /> Submit Request
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
