import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, Clock, MapPin, Users, ChevronRight, CheckCircle,
  ArrowRight, Building2, AlertTriangle, TrendingUp
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { CSE_INTERNSHIPS, CIVIL_INTERNSHIP } from '../data/mockData';
import { internshipService } from '../services/internshipService';
import { getModeLabel, getDomainLabel } from '../utils';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import type { Internship } from '../types';

const ALL_INTERNSHIPS = [...CSE_INTERNSHIPS, CIVIL_INTERNSHIP];

function getIcon(name: string) {
  const IconMap: Record<string, any> = {
    BarChart2: Icons.BarChart2, Globe: Icons.Globe, Database: Icons.Database,
    Brain: Icons.Brain, Cpu: Icons.Cpu, TestTube: Icons.TestTube2,
    Code2: Icons.Code2, Terminal: Icons.Terminal, Cloud: Icons.Cloud,
    Building2: Icons.Building2,
  };
  return IconMap[name] || Icons.Briefcase;
}

export default function InternshipDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [internship, setInternship] = useState<Internship | undefined>(() => ALL_INTERNSHIPS.find((i) => i.slug === slug));

  useEffect(() => {
    if (slug) {
      internshipService.getInternshipBySlug(slug)
        .then((data: any) => {
          if (data) {
            const def = ALL_INTERNSHIPS.find((i) => i.slug === slug);
            setInternship({
              ...def,
              ...data,
              domain: (data.domain === 'CIVIL' || data.domain === 'CIVIL_ENGINEERING') ? 'CIVIL_ENGINEERING' : 'COMPUTER_SCIENCE_ENGINEERING',
              skills: data.skills || def?.skills || ['Industry Training', 'Hands-on Projects', 'Mentorship', 'Certification'],
              learningOutcomes: data.learningOutcomes || def?.learningOutcomes || [
                'Gain hands-on industry project experience',
                'Work with modern development tools and production pipelines',
                'Collaborate through git code reviews and team sprints',
                'Build a professional verifiable project portfolio'
              ],
              responsibilities: data.responsibilities || def?.responsibilities || [
                'Work on assigned product modules and deliver milestones',
                'Attend weekly technical mentorship and review sessions',
                'Document architecture decisions and API workflows',
                'Submit weekly progress and capstone deliverables'
              ],
              color: data.color || def?.color || '#2563EB',
              icon: data.icon || def?.icon || 'Briefcase',
              availableSeats: data.availableSeats || def?.availableSeats || 15,
            });
          }
        })
        .catch(() => {
          // offline fallback
        });
    }
  }, [slug]);

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="heading-sm text-brand-dark mb-2">Internship Not Found</h2>
          <Link to="/internships" className="btn-primary btn-sm mt-4 inline-flex">Browse Internships</Link>
        </div>
      </div>
    );
  }

  const isCivil = internship.domain === 'CIVIL_ENGINEERING';
  const IconComp = getIcon(internship.icon || 'Briefcase');

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Please log in or register to apply.');
      navigate('/login');
      return;
    }
    navigate(`/internships/${slug}/apply`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background: isCivil
            ? 'linear-gradient(135deg, #1a1200 0%, #d97706 100%)'
            : 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 100%)',
        }}
      >
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="container-xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6 flex-wrap">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/internships" className="hover:text-white">Internships</Link>
            <ChevronRight size={14} />
            <span className="text-white">{internship.title}</span>
          </div>

          {/* Civil Partnership Banner */}
          {(isCivil || (internship as any).partnerName || internship.partner) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl glass border border-white/20 mb-6"
            >
              <Building2 size={16} className="text-amber-300" />
              <span className="text-white/80 text-sm">
                In Association With{' '}
                <strong className="text-white">{internship.partner?.name || (internship as any).partnerName || 'AN Survey Consultant'}</strong>
              </span>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-start gap-5 mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl shrink-0"
                style={{ background: internship.color || '#155EEF' }}
              >
                <IconComp size={30} className="text-white" />
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge glass border border-white/20 text-white text-xs">
                    {getDomainLabel(internship.domain)}
                  </span>
                  <span className="badge glass border border-white/20 text-white text-xs">
                    {getModeLabel(internship.mode)}
                  </span>
                  {isCivil && (
                    <span className="badge bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs">
                      Performance Stipend
                    </span>
                  )}
                </div>
                <h1 className="heading-lg text-white mb-3">{internship.title}</h1>
                <p className="text-white/80 text-lg leading-relaxed max-w-3xl">{internship.shortDescription}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-white/70 mt-4">
              <span className="flex items-center gap-1.5"><Clock size={15} /> {internship.duration}</span>
              <span className="flex items-center gap-1.5"><MapPin size={15} /> {getModeLabel(internship.mode)}</span>
              <span className="flex items-center gap-1.5"><Users size={15} /> {internship.availableSeats} seats available</span>
              {internship.technology && (
                <span className="flex items-center gap-1.5"><Icons.Code2 size={15} /> {internship.technology}</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="container-xl py-10 sm:py-14 md:py-16 pb-24 sm:pb-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-8">
              <h2 className="heading-sm text-brand-dark mb-4">About This Internship</h2>
              <p className="body-md">{internship.description}</p>
            </motion.div>

            {/* Learning Outcomes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-8">
              <h2 className="heading-sm text-brand-dark mb-5 flex items-center gap-2">
                <Icons.Zap size={20} className="text-brand-blue" /> Learning Outcomes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(internship.learningOutcomes || []).map((outcome) => (
                  <div key={outcome} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-brand-slate">{outcome}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Responsibilities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-8">
              <h2 className="heading-sm text-brand-dark mb-5 flex items-center gap-2">
                <Briefcase size={20} className="text-brand-blue" /> Roles & Responsibilities
              </h2>
              <ul className="space-y-3">
                {(internship.responsibilities || []).map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-brand-slate">
                    <ArrowRight size={14} className="text-brand-blue mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Stipend — Civil Only */}
            {isCivil && internship.stipend?.enabled && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-8 border-2 border-amber-100">
                <h2 className="heading-sm text-brand-dark mb-5 flex items-center gap-2">
                  <TrendingUp size={20} className="text-amber-500" /> Performance-Based Stipend
                </h2>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800 leading-relaxed">
                      <strong>Important:</strong> {internship.stipend.notes}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Stipend Type', value: 'Performance-Based' },
                    { label: 'Criteria', value: internship.stipend.performanceCriteria || '—' },
                    { label: 'Eligibility', value: internship.stipend.eligibility || '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide mb-1">{label}</p>
                      <p className="text-sm text-brand-dark">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Industry Partner — Civil Only */}
            {isCivil && internship.partner && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-8 border-2 border-amber-100">
                <h2 className="heading-sm text-brand-dark mb-5 flex items-center gap-2">
                  <Building2 size={20} className="text-amber-500" /> Industry Partner
                </h2>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                    <Building2 size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark text-lg">{internship.partner.name}</h3>
                    <p className="text-xs text-brand-slate mt-1">Civil Engineering & Surveying Consultancy</p>
                  </div>
                </div>
                <p className="text-sm text-brand-slate/70 leading-relaxed">{internship.partner.description}</p>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-700">
                    <strong>Disclaimer:</strong> AN Survey Consultant is an independent industry partner. STATS INNOTECH and AN Survey Consultant are separate organizations collaborating for this internship program.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card p-6 sticky top-24 space-y-5">
              {/* Info */}
              <div className="space-y-4">
                {[
                  { label: 'Duration', value: internship.duration, icon: Clock },
                  { label: 'Mode', value: getModeLabel(internship.mode), icon: MapPin },
                  { label: 'Available Seats', value: `${internship.availableSeats} seats`, icon: Users },
                  { label: 'Domain', value: getDomainLabel(internship.domain), icon: Briefcase },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCivil ? 'bg-amber-100' : 'bg-brand-blue/10'}`}>
                      <Icon size={16} className={isCivil ? 'text-amber-600' : 'text-brand-blue'} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-brand-slate/60">{label}</div>
                      <div className="text-sm text-brand-dark font-medium mt-0.5">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide mb-2">Eligibility</p>
                <p className="text-sm text-brand-slate">{internship.eligibility}</p>
              </div>

              {/* Skills */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide mb-3">Skills Required</p>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill) => (
                    <span key={skill} className={`badge text-xs ${isCivil ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'badge-blue'}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide mb-2">Documents Issued</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-brand-slate">
                    <CheckCircle size={14} className="text-green-500" />
                    {isCivil ? 'Civil Offer Letter' : 'CSE Offer Letter'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-brand-slate">
                    <CheckCircle size={14} className="text-green-500" />
                    {isCivil ? 'Civil Completion Letter' : 'Internship Certificate'}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <button
                id="apply-now-btn"
                onClick={handleApply}
                className={`btn w-full justify-center btn-lg ${isCivil ? 'bg-amber-500 text-white hover:bg-amber-600' : 'btn-primary'}`}
              >
                <Briefcase size={18} /> Apply Now
                <ArrowRight size={17} />
              </button>

              <Link to="/internships" className="btn-ghost btn-sm w-full justify-center">
                ← Back to Internships
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
