import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, Building2, CheckCircle2, ArrowRight, ShieldCheck,
  AlertCircle, FileText, Upload, Sparkles, MapPin, Award, Check,
  User, Mail, Phone, School, GraduationCap, Calendar, Clock,
  ExternalLink, Globe, Link2, ChevronDown, CheckCircle
} from 'lucide-react';
import { INTERNSHIPS, CIVIL_PARTNER } from '../data/mockData';
import { internshipService } from '../services/internshipService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function InternshipApplyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, student, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const internship: any = INTERNSHIPS.find((i: any) => i.slug === slug) || INTERNSHIPS[0];
  const isCivil = internship.domain === 'CIVIL' || internship.domain === 'CIVIL_ENGINEERING' || slug?.includes('civil');

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: student?.college || '',
    branch: student?.branch || (isCivil ? 'Civil Engineering' : 'Computer Science & Engineering'),
    year: student?.year ? `${student.year}th Year` : '3rd Year',
    cgpa: '8.4',
    duration: '2 Months',
    mode: isCivil ? 'Hybrid (Site & CAD)' : 'Remote Online',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    statementOfPurpose: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in or create an account to apply');
      navigate('/login', { state: { from: `/internships/${slug}/apply` } });
      return;
    }

    if (!formData.college || !formData.phone || !formData.resumeUrl) {
      toast.error('Please fill in your college, contact number, and resume link');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await internshipService.apply({
        slug: slug || internship.slug,
        internshipId: internship.id,
        preferredDuration: formData.duration,
        preferredMode: formData.mode,
        resumeUrl: formData.resumeUrl,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        statementOfPurpose: formData.statementOfPurpose,
      });
      setApplicationId(res.applicationId);
      setIsSubmitted(true);
      toast.success('Internship application submitted successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit application';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-24 bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-xl w-full p-8 text-center bg-white shadow-xl rounded-2xl border border-blue-100"
        >
          <div className="w-20 h-20 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} />
          </div>
          <span className="badge badge-info text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            Application Received
          </span>
          <h2 className="heading-md text-brand-dark mb-2">Application Submitted! 🚀</h2>
          <p className="text-brand-slate text-sm mb-6">
            Thank you for applying to the <strong className="text-brand-dark">{internship.title}</strong> program.
            Our technical review committee will evaluate your application within 24 to 48 hours.
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">Application Reference ID:</span>
              <span className="font-mono font-bold text-brand-blue">{applicationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Candidate:</span>
              <span className="font-semibold text-brand-dark">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program Track:</span>
              <span className="font-semibold text-slate-800">{internship.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Duration & Mode:</span>
              <span className="font-medium text-slate-700">{formData.duration} ({formData.mode})</span>
            </div>
            {isCivil && (
              <div className="flex justify-between border-t border-slate-200 pt-2 text-amber-800">
                <span className="font-medium">Industry Partner:</span>
                <span className="font-bold">{CIVIL_PARTNER.name}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/portal/internships')}
              className="btn-primary flex items-center justify-center gap-2 py-3 px-6"
            >
              Track in Student Portal
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/internships')}
              className="btn-outline flex items-center justify-center py-3 px-6"
            >
              Browse Other Tracks
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
          <Link to="/internships" className="hover:text-brand-blue">Internships</Link>
          <span>/</span>
          <Link to={`/internships/${internship.slug}`} className="hover:text-brand-blue">{internship.title}</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Application Form</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Application Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card p-6 md:p-8 bg-white shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-info text-xs">{internship.domain} Track</span>
                <span className="text-xs text-slate-500">• Official Application</span>
              </div>
              <h1 className="heading-sm text-brand-dark mb-1">Apply for {internship.title}</h1>
              <p className="text-xs text-brand-slate mb-6">
                Fill in your academic profile, resume details, and project portfolio. Selection is based on merit and passion.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Personal & Academic Information */}
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80">
                    <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      1
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Personal &amp; Academic Profile</h3>
                      <p className="text-[11px] text-slate-500">Provide your verified contact details and college credentials</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. rahul@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Phone / WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        College / University <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          name="college"
                          required
                          value={formData.college}
                          onChange={handleChange}
                          placeholder="e.g. IIT Delhi / State University"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Branch / Degree <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          name="branch"
                          required
                          value={formData.branch}
                          onChange={handleChange}
                          placeholder="e.g. B.Tech Computer Science / Civil"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Current Year / Semester <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                        >
                          <option value="1st Year">1st Year (1st / 2nd Sem)</option>
                          <option value="2nd Year">2nd Year (3rd / 4th Sem)</option>
                          <option value="3rd Year">3rd Year (5th / 6th Sem)</option>
                          <option value="4th Year">4th Year (7th / 8th Sem)</option>
                          <option value="Graduated">Recent Graduate / Post-Graduate</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Internship Preferences */}
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80">
                    <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      2
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Preferences &amp; Duration</h3>
                      <p className="text-[11px] text-slate-500">Select your preferred timeline and execution format</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Internship Duration</label>
                      <div className="relative">
                        <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                        >
                          <option value="1 Month">1 Month (Intensive Fast-Track)</option>
                          <option value="2 Months">2 Months (Standard Project Cohort)</option>
                          <option value="3 Months">3 Months (Comprehensive Training)</option>
                          <option value="6 Months">6 Months (Major Degree Capstone)</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Mode</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          name="mode"
                          value={formData.mode}
                          onChange={handleChange}
                          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                        >
                          <option value="Remote Online">Remote Online (Work from anywhere)</option>
                          <option value="Hybrid (Site &amp; CAD)">Hybrid (Field survey &amp; CAD modeling)</option>
                          <option value="Office / Laboratory">On-site Lab &amp; Mentorship</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Resume & Portfolio Links */}
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80">
                    <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      3
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Resume &amp; Portfolio Links</h3>
                      <p className="text-[11px] text-slate-500">Share verifiable links to your resume and relevant engineering work</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Resume / CV Link <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="url"
                          name="resumeUrl"
                          required
                          value={formData.resumeUrl}
                          onChange={handleChange}
                          placeholder="https://drive.google.com/file/d/... or Dropbox / Notion link"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                        Please ensure the link permission is set to "Anyone with the link can view".
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isCivil ? 'Portfolio / CAD Projects Link' : 'GitHub Profile / Project Repo'}
                        </label>
                        <div className="relative">
                          <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            placeholder={isCivil ? 'https://portfolio.com/cad-drawings' : 'https://github.com/username'}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">LinkedIn Profile</label>
                        <div className="relative">
                          <ExternalLink size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Statement of Purpose */}
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
                    <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      4
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Statement of Purpose / Goals</h3>
                      <p className="text-[11px] text-slate-500">Tell us what you hope to achieve and any technical skills you bring</p>
                    </div>
                  </div>

                  <div>
                    <textarea
                      name="statementOfPurpose"
                      rows={3}
                      value={formData.statementOfPurpose}
                      onChange={handleChange}
                      placeholder="Briefly describe your interest in this domain, tools or software you know, and what you aim to achieve during this internship..."
                      className="w-full p-3.5 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2.5 rounded-xl shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:shadow-brand-blue/30 transition-all font-bold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Application...
                    </span>
                  ) : (
                    <>
                      <span>Submit Internship Application</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Program Overview & Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card p-6 bg-white shadow-sm border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Track Highlights</h2>
              <div className="flex gap-4 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-dark leading-snug">{internship.title}</h3>
                  <p className="text-xs text-brand-slate mt-0.5">{internship.duration} • {internship.stipend || 'Performance-based'}</p>
                </div>
              </div>

              {/* Civil Partner callout if Civil */}
              {isCivil && (
                <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                    <Building2 size={16} className="text-amber-700" />
                    Jointly with {CIVIL_PARTNER.name}
                  </div>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    Receive hands-on field experience with industry-standard surveying equipment: Total Station, Auto Level, GPS/GNSS surveying, and AutoCAD Civil 3D. Official joint certificate issued.
                  </p>
                </div>
              )}

              {/* What you get */}
              <div className="py-3 border-b border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="font-semibold text-slate-700 mb-2">Internship Inclusions:</div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Official Signed Offer Letter on Startup Letterhead</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Verified QR-coded Internship Completion Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Letter of Recommendation (LOR) for top performers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Production Capstone Project for your resume</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>1-on-1 Code & Architecture Review Sessions</span>
                </div>
              </div>

              {/* Application steps */}
              <div className="pt-3 text-xs text-slate-500 space-y-2">
                <div className="font-semibold text-slate-700">Selection Process:</div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <span>Online application screening (1-2 business days)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <span>Short technical task or aptitude review</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <span>Offer Letter issuance & onboarding in Student Portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
