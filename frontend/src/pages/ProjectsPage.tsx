import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Building2, Brain, Cloud, CheckCircle2,
  ArrowRight, Sparkles, Send, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../services/contactService';

export default function ProjectsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: 'B.Tech 4th Year',
    domain: 'Computer Science & Engineering (CSE)',
    topicPreference: 'need_suggestions', // 'need_suggestions' | 'has_topic'
    existingTopic: '',
    deadline: '',
    additionalNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in your name, email, and phone number');
      return;
    }

    setSubmitting(true);
    try {
      const subject = `[Project Development Request] ${formData.domain} - ${formData.degree}`;
      const messageContent = [
        `Student Name: ${formData.name}`,
        `College/University: ${formData.college || 'Not specified'}`,
        `Degree & Year: ${formData.degree}`,
        `Domain: ${formData.domain}`,
        `Topic Status: ${formData.topicPreference === 'need_suggestions' ? 'Wants topic suggestions from STATS experts' : 'Already has a topic'}`,
        formData.existingTopic ? `Proposed Topic/Idea: ${formData.existingTopic}` : '',
        formData.deadline ? `Target Submission Deadline: ${formData.deadline}` : '',
        formData.additionalNotes ? `Notes/Requirements: ${formData.additionalNotes}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await contactService.sendMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject,
        message: messageContent,
      });

      setSubmitted(true);
      toast.success('Your project inquiry has been received! Our team will contact you shortly.');
    } catch (err: any) {
      console.error('Project inquiry error', err);
      toast.error('Failed to submit inquiry. Please try again or contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('project-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'How does the project development process work?',
      a: 'Once you submit your branch and domain requirements, our senior engineering team reviews them and suggests 3 to 5 trending, high-impact topics for university approval. After you choose and finalize the scope, we develop the complete system, demonstrate working modules to you, and hand over the full source code, university-compliant report, PPT, and viva preparation guidance.',
    },
    {
      q: 'What if I do not have a project topic in mind?',
      a: 'That is completely normal! Based on your engineering domain (CSE, AI/ML, Civil, Cloud, etc.) and current academic year, our senior architects will suggest 3-5 trending, high-impact topics that easily get approved by university faculties and project guides.',
    },
    {
      q: 'What if my college guide or faculty rejects the suggested topic?',
      a: 'We provide free alternative topic suggestions until your college guide approves the title and problem statement. We also help you prepare the initial synopsis and presentation for guide approval.',
    },
    {
      q: 'What all deliverables are included in the project package?',
      a: 'Every project includes: (1) Complete, well-commented source code, (2) Comprehensive IEEE/UGC compliant Project Report (SRS, Design Diagrams, Testing), (3) PowerPoint Presentation (PPT), (4) Live installation & execution support on your computer, and (5) 1-on-1 Viva & Defense Coaching with Senior Developers.',
    },
    {
      q: 'Do you provide live assistance during project execution on my laptop?',
      a: 'Yes! Our technical team connects with you remotely via Google Meet / AnyDesk to set up the runtime environment, database, dependencies, and verify that the project runs smoothly on your laptop.',
    },
    {
      q: 'How much time do you take to deliver a complete project?',
      a: 'Standard final-year projects take 7 to 14 days depending on complexity. We also accommodate urgent submissions (3 to 5 days) for critical university deadlines.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ═══ HERO SECTION ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-slate-900 to-brand-blue py-20 lg:py-28 text-white">
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
        <div className="orb w-[500px] h-[500px] -top-32 -right-32 bg-brand-cyan/20 blur-3xl pointer-events-none" />
        <div className="orb w-[400px] h-[400px] -bottom-32 -left-32 bg-brand-blue/30 blur-3xl pointer-events-none" />

        <div className="container-xl relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-brand-cyan shadow-sm"
            >
              <Sparkles size={14} className="text-amber-400" />
              Academic &amp; Capstone Project Development for College Students
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-xl tracking-tight text-white leading-tight"
            >
              End-to-End Project Development{' '}
              <span className="bg-gradient-to-r from-brand-cyan via-white to-blue-200 bg-clip-text text-transparent">
                Tailored for Your Degree
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="body-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              Stuck on your final year or semester project? Send us your requirements and domain, and our engineering team will suggest trending topics, build complete source code, prepare documentation, and get you viva-ready.
            </motion.p>

            {/* Highlights Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex flex-wrap items-center justify-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs text-white"
            >
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <CheckCircle2 size={16} /> Verified Topic Suggestions
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1.5 font-bold text-sky-300">
                <CheckCircle2 size={16} /> Live Code Demonstration
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <CheckCircle2 size={16} /> Complete Source Code + Report + Viva Prep
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <button
                onClick={scrollToForm}
                className="btn-primary text-sm py-3 px-8 shadow-xl shadow-brand-blue/30 flex items-center gap-2 group cursor-pointer"
              >
                <span>Request Topics &amp; Consultation</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ DOMAINS WE COVER ════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="container-xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge badge-info text-xs mb-2">Multidisciplinary Engineering</span>
            <h2 className="heading-md text-brand-dark">Project Domains We Specialize In</h2>
            <p className="body-md text-brand-slate mt-2">
              Whether you are an aspiring software engineer or a civil engineer, we have domain specialists ready to guide you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                domain: 'Computer Science & IT',
                icon: Code2,
                color: 'from-blue-600 to-indigo-600',
                popularTopics: [
                  'Distributed Microservices Architecture',
                  'Full Stack E-Commerce & SaaS Platforms',
                  'Spring Boot 3 + React / Next.js',
                  'Role-Based ERP & Management Portals',
                  'Blockchain & Decentralized DApps',
                ],
              },
              {
                domain: 'AI, ML & Data Science',
                icon: Brain,
                color: 'from-purple-600 to-pink-600',
                popularTopics: [
                  'Autonomous LLM Agent Systems',
                  'Computer Vision & Object Detection (YOLO)',
                  'Medical Imaging & Disease Prediction',
                  'NLP Sentiment & Financial Telemetry',
                  'Deep Learning Fraud Detection',
                ],
              },
              {
                domain: 'Civil Engineering',
                icon: Building2,
                color: 'from-amber-600 to-orange-600',
                popularTopics: [
                  'Topographical Survey & Total Station Traverse',
                  'AutoCAD Civil 3D Road Profile & Earthwork',
                  'QGIS Watershed & Flood Inundation Modeling',
                  'STAAD Pro & ETABS Structural Analysis',
                  'Highway Alignment & Pavement Design',
                ],
              },
              {
                domain: 'Cloud, DevOps & IoT',
                icon: Cloud,
                color: 'from-cyan-600 to-teal-600',
                popularTopics: [
                  'Multi-Tenant Kubernetes SaaS Deployments',
                  'Terraform Infrastructure as Code (IaC)',
                  'Smart IoT Weather & Energy Monitoring',
                  'ArgoCD CI/CD GitOps Pipelines',
                  'Prometheus & Grafana Monitoring Hubs',
                ],
              },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.domain} className="card p-6 bg-slate-50/60 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${d.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-base font-bold text-brand-dark mb-3">{d.domain}</h3>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Sample Project Areas:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 mb-6">
                      {d.popularTopics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-brand-blue shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, domain: d.domain }));
                      scrollToForm();
                    }}
                    className="btn-outline btn-sm text-xs w-full justify-center"
                  >
                    Request {d.domain} Project
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE PROJECT INQUIRY FORM ═══════════════════════════════ */}
      <section id="project-form-section" className="py-20 bg-slate-50">
        <div className="container-xl max-w-4xl">
          <div className="card p-8 md:p-12 bg-white shadow-xl border border-slate-200 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-blue via-brand-cyan to-indigo-600" />

            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="badge badge-info text-xs mb-2">Get Started Today</span>
              <h2 className="heading-md text-brand-dark">Request Project Consultation &amp; Topics</h2>
              <p className="body-md text-brand-slate mt-2 text-xs sm:text-sm">
                Fill in your details below. Our senior project mentor will evaluate your domain and contact you via WhatsApp / Email with topic suggestions within 24 hours.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-emerald-950">Project Inquiry Received!</h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Our senior engineers have received your inquiry for{' '}
                  <strong>{formData.domain}</strong>. We will message you on WhatsApp (<strong>{formData.phone}</strong>) and email with customized topic suggestions and project deliverables.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      college: '',
                      degree: 'B.Tech 4th Year',
                      domain: 'Computer Science & Engineering (CSE)',
                      topicPreference: 'need_suggestions',
                      existingTopic: '',
                      deadline: '',
                      additionalNotes: '',
                    });
                  }}
                  className="btn-outline btn-sm text-xs mt-2"
                >
                  Submit Another Project Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@example.com"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      College / University Name
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="e.g. National Institute of Technology"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Degree &amp; Academic Year
                    </label>
                    <select
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="input-field text-xs"
                    >
                      <option value="B.Tech 4th Year (Final Year Project)">B.Tech 4th Year (Final Year Project)</option>
                      <option value="B.Tech 3rd Year (Minor Project)">B.Tech 3rd Year (Minor Project)</option>
                      <option value="BCA Final Semester">BCA Final Semester</option>
                      <option value="MCA Capstone">MCA Capstone</option>
                      <option value="Polytechnic / Diploma">Polytechnic / Diploma</option>
                      <option value="M.Tech Thesis Project">M.Tech Thesis Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Engineering Domain
                    </label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      className="input-field text-xs"
                    >
                      <option value="Computer Science & Engineering (CSE)">Computer Science &amp; Engineering (CSE)</option>
                      <option value="AI, Machine Learning & Data Science">AI, Machine Learning &amp; Data Science</option>
                      <option value="Civil Engineering (Survey & Design)">Civil Engineering (Survey &amp; Design)</option>
                      <option value="Cloud Computing & DevOps">Cloud Computing &amp; DevOps</option>
                      <option value="IoT & Embedded Systems">IoT &amp; Embedded Systems</option>
                      <option value="Information Technology (IT)">Information Technology (IT)</option>
                    </select>
                  </div>
                </div>

                {/* Topic Preference Radios */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Do you have a project topic or do you need suggestions?
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="radio"
                        name="topicPreference"
                        value="need_suggestions"
                        checked={formData.topicPreference === 'need_suggestions'}
                        onChange={handleInputChange}
                        className="text-brand-blue"
                      />
                      <span>Suggest trending topics for my domain (Recommended)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="radio"
                        name="topicPreference"
                        value="has_topic"
                        checked={formData.topicPreference === 'has_topic'}
                        onChange={handleInputChange}
                        className="text-brand-blue"
                      />
                      <span>I already have a specific topic / title</span>
                    </label>
                  </div>

                  {formData.topicPreference === 'has_topic' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2"
                    >
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Proposed Topic / Problem Statement
                      </label>
                      <input
                        type="text"
                        name="existingTopic"
                        value={formData.existingTopic}
                        onChange={handleInputChange}
                        placeholder="e.g. Distributed Patient Health Monitoring System with Kafka"
                        className="input-field text-xs bg-white"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target Submission Deadline
                    </label>
                    <input
                      type="text"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      placeholder="e.g. Within 15 Days / End of Month"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Specific Requirements / Notes
                    </label>
                    <input
                      type="text"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Must use PostgreSQL and React, guide asked for IEEE paper"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/25"
                  >
                    {submitting ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Project Inquiry &amp; Request Topics</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2.5">
                    🔒 No obligation to purchase. Free consultation and topic suggestions tailored to your curriculum.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container-xl max-w-3xl">
          <div className="text-center mb-12">
            <span className="badge badge-info text-xs mb-2">Got Questions?</span>
            <h2 className="heading-md text-brand-dark">Frequently Asked Questions</h2>
            <p className="body-md text-brand-slate mt-2 text-xs sm:text-sm">
              Everything you need to know about our project development and consultation process.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="card bg-white border border-slate-200 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-brand-dark hover:text-brand-blue transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-brand-blue' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 pt-1 text-xs text-brand-slate leading-relaxed border-t border-slate-100"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
