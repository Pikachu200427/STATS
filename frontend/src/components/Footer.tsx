import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, MessageCircle, Rss, Play, ExternalLink, ArrowRight, CheckCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      {/* Main Footer */}
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/assets/logo-horizontal.png"
                alt="STATS INNOTECH"
                className="h-10 w-auto brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const next = e.currentTarget.nextElementSibling as HTMLElement;
                  if (next) next.style.display = 'flex';
                }}
              />
              <div className="hidden items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-brand-gradient-light flex items-center justify-center">
                  <span className="text-white font-black text-lg">S</span>
                </div>
                <div>
                  <div className="font-black text-white text-base leading-none">STATS</div>
                  <div className="font-bold text-brand-cyan text-xs leading-none">INNOTECH</div>
                </div>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Empowering the next generation of engineers and innovators through industry-ready training, internships, and practical education.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: MessageCircle, href: '#', label: 'LinkedIn' },
                { icon: Share2, href: '#', label: 'Twitter' },
                { icon: Rss, href: '#', label: 'Instagram' },
                { icon: Play, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-blue transition-colors flex items-center justify-center"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Courses', to: '/courses' },
                { label: 'CSE Internships', to: '/internships' },
                { label: 'Civil Engineering Internship', to: '/internships/civil' },
                { label: 'College Project Development', to: '/projects' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Programs</h4>
            <ul className="space-y-3">
              {[
                { label: 'Java (Core)', to: '/courses/java-core' },
                { label: 'Python', to: '/courses/python' },
                { label: 'Data Analytics', to: '/courses/data-analytics' },
                { label: 'Cloud (AWS)', to: '/courses/cloud-aws' },
                { label: 'DSA with Java', to: '/courses/dsa-java' },
                { label: 'Web Development Internship', to: '/internships/web-development-internship' },
                { label: 'AIML Internship', to: '/internships/aiml-internship' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-brand-cyan mt-0.5 shrink-0" />
                <a href="mailto:info@statsinnotech.com" className="text-sm text-white/60 hover:text-white transition-colors">
                  info@statsinnotech.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-brand-cyan mt-0.5 shrink-0" />
                <a href="tel:+91XXXXXXXXXX" className="text-sm text-white/60 hover:text-white transition-colors">
                  +91 XXXX XXX XXX
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-cyan mt-0.5 shrink-0" />
                <span className="text-sm text-white/60">India</span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={14} className="text-green-400 shrink-0" />
                <span className="text-xs font-semibold text-white">Certificate Verification</span>
              </div>
              <p className="text-xs text-white/50 mb-3">
                Verify the authenticity of any certificate or offer letter issued by STATS INNOTECH.
              </p>
              <Link
                to="/verify-certificate"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-cyan hover:text-white transition-colors"
              >
                Verify Now <ExternalLink size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Civil Partnership Banner */}
      <div className="border-t border-white/10">
        <div className="container-xl py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold">Civil Engineering — Industry Partner:</span>
              <span className="font-bold text-white/80">AN Survey Consultant</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5">
        <div className="container-xl py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <span>© {currentYear} STATS INNOTECH. All rights reserved.</span>
          <span>Built with ❤️ for the next generation of innovators.</span>
        </div>
      </div>
    </footer>
  );
}
