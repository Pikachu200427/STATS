import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Code2, CheckCircle, ArrowRight, Clock, Users, MapPin, Filter } from 'lucide-react';
import * as Icons from 'lucide-react';
import { CSE_INTERNSHIPS, CIVIL_INTERNSHIP } from '../data/mockData';
import { internshipService } from '../services/internshipService';
import { getModeLabel } from '../utils';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06 } }),
};

const CSE_TECH_FILTERS = ['All', 'Data Analytics', 'Web Development', 'DBMS', 'AIML', 'IoT', 'Java', 'Python', 'Cloud'];

function getIcon(name: string) {
  const IconMap: Record<string, any> = {
    BarChart2: Icons.BarChart2, Globe: Icons.Globe, Database: Icons.Database,
    Brain: Icons.Brain, Cpu: Icons.Cpu, TestTube: Icons.TestTube2,
    Code2: Icons.Code2, Terminal: Icons.Terminal, Cloud: Icons.Cloud,
    Building2: Icons.Building2,
  };
  return IconMap[name] || Icons.Briefcase;
}

export default function InternshipsPage() {
  const [activeTab, setActiveTab] = useState<'CSE' | 'CIVIL'>('CSE');
  const [techFilter, setTechFilter] = useState('All');
  const [cseInternships, setCseInternships] = useState(CSE_INTERNSHIPS);
  const [civilInternship, setCivilInternship] = useState(CIVIL_INTERNSHIP);

  useEffect(() => {
    internshipService.getAllInternships()
      .then((data) => {
        if (data && data.length > 0) {
          const merged = data.map((item: any) => {
            const def = [...CSE_INTERNSHIPS, CIVIL_INTERNSHIP].find((m) => m.slug === item.slug);
            return {
              ...def,
              ...item,
              domain: (item.domain === 'CIVIL' || item.domain === 'CIVIL_ENGINEERING') ? 'CIVIL_ENGINEERING' : 'COMPUTER_SCIENCE_ENGINEERING',
              skills: item.skills || def?.skills || ['Industry Training', 'Hands-on Projects', 'Mentorship', 'Certification'],
              color: item.color || def?.color || '#2563EB',
              icon: item.icon || def?.icon || 'Briefcase',
              availableSeats: item.availableSeats || def?.availableSeats || 15,
            };
          });

          const cse = merged.filter((i: any) => i.domain === 'COMPUTER_SCIENCE_ENGINEERING' || i.domain === 'CSE');
          const civ = merged.find((i: any) => i.domain === 'CIVIL_ENGINEERING' || i.domain === 'CIVIL');
          if (cse.length > 0) setCseInternships(cse);
          if (civ) setCivilInternship(civ);
        }
      })
      .catch((err) => {
        console.warn('Backend internships API unavailable, using offline fallback', err);
      });
  }, []);

  const filteredCSE = cseInternships.filter((i) => {
    if (techFilter === 'All') return true;
    return i.title.toLowerCase().includes(techFilter.toLowerCase()) ||
      i.technology?.toLowerCase().includes(techFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="page-hero">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="container-xl relative z-10 text-center pt-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-tag border border-white/20 bg-white/10 text-white/90 mx-auto w-fit mb-6">
              <Briefcase size={14} /> Internship Programs
            </div>
            <h1 className="heading-xl text-white mb-4">Real-World Internships</h1>
            <p className="body-lg text-white/70 max-w-2xl mx-auto">
              Industry-recognized internships in Computer Science & Engineering and Civil Engineering.
              Gain real experience, earn official documents, and build your career.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Domain Tabs */}
      <div className="sticky top-[68px] sm:top-[74px] md:top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="container-xl">
          <div className="flex items-center gap-2 py-2">
            <button
              id="tab-cse"
              onClick={() => setActiveTab('CSE')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'CSE'
                  ? 'bg-brand-blue text-white shadow-brand'
                  : 'text-brand-slate hover:bg-brand-blue/8'
                }`}
            >
              <Code2 size={16} />
              Computer Science & Engineering
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'CSE' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {CSE_INTERNSHIPS.length}
              </span>
            </button>
            <button
              id="tab-civil"
              onClick={() => setActiveTab('CIVIL')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'CIVIL'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'text-brand-slate hover:bg-amber-50'
                }`}
            >
              <Building2 size={16} />
              Civil Engineering
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'CIVIL' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                1
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── CSE Section ─────────────────────────────────────────────── */}
      {activeTab === 'CSE' && (
        <div className="container-xl py-10 sm:py-14 md:py-16 pb-24 sm:pb-28 md:pb-32">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="heading-md text-brand-dark">CSE Internships</h2>
              <p className="body-md mt-1">Choose from 9 specialized Computer Science internship programs.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-brand-slate shrink-0" />
              {CSE_TECH_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setTechFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${techFilter === f
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 text-brand-slate hover:bg-gray-200'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCSE.map((internship, i) => {
              const IconComp = getIcon(internship.icon || 'Briefcase');
              return (
                <motion.div
                  key={internship.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="card-hover h-full flex flex-col group overflow-hidden">
                    {/* Card Header */}
                    <div
                      className="p-6 pb-4 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${internship.color}18 0%, ${internship.color}08 100%)` }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                        style={{ background: internship.color, transform: 'translate(30%, -30%)' }} />
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md"
                        style={{ background: internship.color }}
                      >
                        <IconComp size={22} className="text-white" />
                      </div>
                      <h3 className="font-bold text-brand-dark text-lg mb-1 group-hover:text-brand-blue transition-colors leading-snug">
                        {internship.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="badge-blue text-xs">
                          {internship.domain === 'COMPUTER_SCIENCE_ENGINEERING' ? 'CSE' : 'Civil'}
                        </span>
                        <span className="badge bg-gray-100 text-gray-600 text-xs">{getModeLabel(internship.mode)}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 pt-4 flex flex-col flex-1">
                      <p className="text-sm text-brand-slate/70 leading-relaxed mb-4 flex-1">
                        {internship.shortDescription}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(internship.skills || []).slice(0, 4).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-brand-slate">
                            {skill}
                          </span>
                        ))}
                        {(internship.skills || []).length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-brand-slate">
                            +{(internship.skills || []).length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-brand-slate/60 mb-5">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} /> {internship.duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={12} /> {getModeLabel(internship.mode)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={12} /> {internship.availableSeats || 15} seats
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle size={12} className="text-green-500" /> Offer Letter
                        </span>
                      </div>

                      {/* CTAs */}
                      <div className="flex gap-2">
                        <Link
                          to={`/internships/${internship.slug}`}
                          className="btn-ghost btn-sm flex-1 justify-center text-xs"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/internships/${internship.slug}/apply`}
                          className="btn-primary btn-sm flex-1 justify-center text-xs group"
                        >
                          Apply Now
                          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Civil Section ────────────────────────────────────────────── */}
      {activeTab === 'CIVIL' && (
        <div className="container-xl py-10 sm:py-14 md:py-16 pb-24 sm:pb-28 md:pb-32">
          {/* Partnership Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-8 mb-8 border-2 border-amber-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-50 -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                  <Building2 size={30} className="text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Civil Engineering Internship</div>
                  <h2 className="heading-sm text-brand-dark">In Association With</h2>
                  <p className="text-xl font-bold text-brand-dark mt-0.5">AN Survey Consultant</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 max-w-sm">
                <p className="font-medium mb-1">⚠️ Partnership Disclaimer</p>
                <p className="text-xs leading-relaxed">
                  AN Survey Consultant is an industry partner that provides resources and practical training support for this internship. They are a separate professional organization collaborating with STATS INNOTECH.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Civil Internship Card — Full Detail */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                    <Building2 size={26} className="text-white" />
                  </div>
                  <div>
                    <h3 className="heading-sm text-brand-dark">{CIVIL_INTERNSHIP.title}</h3>
                    <p className="text-sm text-brand-slate mt-1">{CIVIL_INTERNSHIP.technology}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="badge bg-amber-100 text-amber-700">Civil Engineering</span>
                      <span className="badge-gray">{getModeLabel(CIVIL_INTERNSHIP.mode)}</span>
                      <span className="badge bg-green-100 text-green-700">Performance Stipend</span>
                    </div>
                  </div>
                </div>

                <p className="body-md mb-6">{CIVIL_INTERNSHIP.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-brand-dark mb-3 text-sm uppercase tracking-wide">Learning Outcomes</h4>
                    <ul className="space-y-2">
                      {CIVIL_INTERNSHIP.learningOutcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-2 text-sm text-brand-slate">
                          <CheckCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark mb-3 text-sm uppercase tracking-wide">Responsibilities</h4>
                    <ul className="space-y-2">
                      {CIVIL_INTERNSHIP.responsibilities.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-brand-slate">
                          <ArrowRight size={13} className="text-amber-500 mt-0.5 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stipend Info */}
              {CIVIL_INTERNSHIP.stipend?.enabled && (
                <div className="card p-6 border border-amber-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Icons.TrendingUp size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark">Performance-Based Stipend</h4>
                      <p className="text-xs text-brand-slate">Subject to evaluation criteria</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                    <p className="font-semibold mb-1">📋 Stipend Eligibility</p>
                    <p className="text-xs leading-relaxed">{CIVIL_INTERNSHIP.stipend.notes}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide">Criteria</span>
                      <p className="text-brand-dark text-xs mt-1">{CIVIL_INTERNSHIP.stipend.performanceCriteria}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide">Eligibility</span>
                      <p className="text-brand-dark text-xs mt-1">{CIVIL_INTERNSHIP.stipend.eligibility}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Key Info */}
              <div className="card p-6">
                <h4 className="font-bold text-brand-dark mb-4">Program Details</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Duration', value: CIVIL_INTERNSHIP.duration, icon: Clock },
                    { label: 'Mode', value: getModeLabel(CIVIL_INTERNSHIP.mode), icon: MapPin },
                    { label: 'Available Seats', value: `${CIVIL_INTERNSHIP.availableSeats} seats`, icon: Users },
                    { label: 'Eligibility', value: CIVIL_INTERNSHIP.eligibility, icon: CheckCircle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-brand-slate/60">{label}</div>
                        <div className="text-sm text-brand-dark font-medium mt-0.5">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="card p-6">
                <h4 className="font-bold text-brand-dark mb-4">Skills You'll Work With</h4>
                <div className="flex flex-wrap gap-2">
                  {CIVIL_INTERNSHIP.skills.map((skill) => (
                    <span key={skill} className="badge bg-amber-50 text-amber-700 border border-amber-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Partner */}
              <div className="card p-6 border-2 border-amber-100">
                <h4 className="font-bold text-brand-dark mb-3">Industry Partner</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Building2 size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark text-sm">{CIVIL_INTERNSHIP.partner?.name}</p>
                    <p className="text-xs text-brand-slate">Survey & Civil Consultancy</p>
                  </div>
                </div>
                <p className="text-xs text-brand-slate/70 leading-relaxed">
                  {CIVIL_INTERNSHIP.partner?.description}
                </p>
              </div>

              {/* Apply CTA */}
              <Link
                to="/internships/civil-engineering-internship/apply"
                className="btn bg-amber-500 text-white hover:bg-amber-600 w-full justify-center btn-lg group"
              >
                <Briefcase size={20} />
                Apply Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/internships/civil-engineering-internship"
                className="btn-secondary w-full justify-center"
              >
                View Full Details
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
