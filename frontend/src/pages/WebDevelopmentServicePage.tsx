import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Laptop, Globe, Database, ShieldCheck, Zap,
  CheckCircle2, ArrowRight, MessageSquare, Send, Server,
  Sparkles, Layers, Cpu, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function WebDevelopmentServicePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceType: 'Custom Full-Stack Web App',
    budgetRange: '₹50,000 – ₹1,50,000',
    projectScope: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please enter your name and email');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your project request has been submitted! Our lead solutions architect will reach out within 24 hours.');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        serviceType: 'Custom Full-Stack Web App',
        budgetRange: '₹50,000 – ₹1,50,000',
        projectScope: '',
      });
    }, 1200);
  };

  const SERVICES = [
    {
      icon: <Laptop className="w-6 h-6 text-brand-blue" />,
      title: 'High-Performance Web Platforms',
      description: 'Ultra-fast Next.js & React single-page apps with server-side rendering, sub-second load times, and dynamic micro-animations.',
    },
    {
      icon: <Server className="w-6 h-6 text-brand-blue" />,
      title: 'Enterprise Java & Spring Boot Backends',
      description: 'Resilient, scalable microservices architectures engineered with Java 21, Spring Boot, PostgreSQL, Kafka, and Docker containers.',
    },
    {
      icon: <Building2 className="w-6 h-6 text-brand-blue" />,
      title: 'Civil & Surveying Enterprise Portals',
      description: 'Specialized GIS mapping dashboards, Total Station data import engines, and CAD drawing management platforms built for infrastructure firms.',
    },
    {
      icon: <Database className="w-6 h-6 text-brand-blue" />,
      title: 'Student Portals & LMS SaaS Systems',
      description: 'End-to-end student enrollment, automated verification-coded certificates, offer letters, and payment gateways like STATS INNOTECH.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-blue" />,
      title: 'Secure Cloud DevOps & Migration',
      description: 'Zero-downtime AWS / GCP deployments, automated CI/CD pipelines, SSL automation, and SOC-2 standard database security encryption.',
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-blue" />,
      title: 'Startup MVP in 3 Weeks',
      description: 'Rapid product design, prototyping, and fully functional production launch for early-stage founders to validate and pitch to investors.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section
        className="pt-28 sm:pt-32 md:pt-36 pb-20 md:pb-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #155EEF 100%)' }}
      >
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="container-xl relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge bg-white/10 text-white border border-white/20 text-xs uppercase tracking-wider mb-4 inline-block">
              STATS INNOTECH Software Solutions
            </span>
            <h1 className="heading-xl text-white mb-6">
              World-Class Web &amp; Enterprise Software Engineering
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8">
              We design, build, and deploy production-grade web platforms, scalable microservices backends, and domain-specific infrastructure software for ambitious startups and businesses.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#proposal-form" className="btn-primary bg-white text-brand-dark hover:bg-slate-100 shadow-xl">
                Request Project Proposal
              </a>
              <Link to="/contact" className="btn-outline border-white text-white hover:bg-white/10">
                Talk to an Architect
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 container-xl max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="heading-md text-brand-dark mb-3">Our Core Engineering Capabilities</h2>
          <p className="text-brand-slate text-sm">
            Leveraging modern tech stacks and battle-tested software design patterns to build solutions that scale seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, idx) => (
            <div
              key={idx}
              className="card p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <h3 className="heading-sm text-brand-dark mb-2">{s.title}</h3>
              <p className="text-xs text-brand-slate leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="container-xl max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Technologies We Build Production Systems With
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-slate-600 font-semibold text-sm">
            <span className="flex items-center gap-2">⚡ React 19 & Next.js</span>
            <span className="flex items-center gap-2">☕ Java 21 & Spring Boot 3</span>
            <span className="flex items-center gap-2">🐘 PostgreSQL</span>
            <span className="flex items-center gap-2">🐍 Python & FastAPI</span>
            <span className="flex items-center gap-2">🐳 Docker & Kubernetes</span>
            <span className="flex items-center gap-2">☁️ AWS Cloud</span>
          </div>
        </div>
      </section>

      {/* Project Proposal Request Form */}
      <section id="proposal-form" className="py-16 md:py-20 pb-24 md:pb-32 container-xl max-w-3xl">
        <div className="card p-8 md:p-10 bg-white border border-slate-200 shadow-lg rounded-3xl">
          <div className="text-center mb-8">
            <span className="badge badge-info text-xs uppercase tracking-wider mb-2 inline-block">
              Get an Estimate
            </span>
            <h2 className="heading-md text-brand-dark mb-2">Kickstart Your Software Project</h2>
            <p className="text-xs text-brand-slate">
              Tell us about your requirements and we will prepare a tailored technical scope and quotation within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aditi Roy"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aditi@company.com"
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Pvt Ltd"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Type</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="input-field text-xs"
                >
                  <option value="Custom Full-Stack Web App">Custom Full-Stack Web App</option>
                  <option value="Startup MVP Rapid Build">Startup MVP Rapid Build (3 Weeks)</option>
                  <option value="Enterprise Java & Cloud Architecture">Enterprise Java & Cloud Architecture</option>
                  <option value="Civil & GIS Survey Software">Civil & GIS Survey Software</option>
                  <option value="Student Portal / LMS Platform">Student Portal / LMS Platform</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Budget Range</label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="input-field text-xs"
                >
                  <option value="₹30,000 – ₹50,000">₹30,000 – ₹50,000 (Basic Landing & CMS)</option>
                  <option value="₹50,000 – ₹1,50,000">₹50,000 – ₹1,50,000 (Complete Web App / MVP)</option>
                  <option value="₹1,50,000 – ₹3,50,000">₹1,50,000 – ₹3,50,000 (Enterprise Portal)</option>
                  <option value="₹3,50,000+">₹3,50,000+ (Custom Scalable SaaS System)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Overview & Objectives</label>
              <textarea
                rows={3}
                value={formData.projectScope}
                onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                placeholder="Briefly describe what you're looking to build, any reference sites, timelines, or key features..."
                className="input-field text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-4 shadow-lg shadow-brand-blue/20"
            >
              {isSubmitting ? (
                <span>Submitting Proposal Request...</span>
              ) : (
                <>
                  <Send size={15} />
                  Submit Project Scope for Review
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
