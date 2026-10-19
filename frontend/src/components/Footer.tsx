import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, ArrowRight, CheckCircle } from 'lucide-react';

function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0-.02-3.3 1.65 1.65 0 0 0 .02 3.3m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    icon: InstagramIcon,
    href: 'https://www.instagram.com/statsinnotech?stkn=ejNqcjBldDBndDdu',
    label: 'Instagram',
    colorHover: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600',
  },
  {
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/in/stats-innotech-69651b435?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    label: 'LinkedIn',
    colorHover: 'hover:bg-[#0077b5]',
  },
  {
    icon: WhatsAppIcon,
    href: 'https://wa.me/7757014668',
    label: 'WhatsApp',
    colorHover: 'hover:bg-[#25D366]',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      {/* Main Footer */}
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="h-10 mb-5 flex items-center overflow-visible">
              <Link to="/" className="inline-flex items-center -ml-3 group" aria-label="STATS INNOTECH Home">
                <img
                  src="/assets/logo-horizontal.png"
                  alt="STATS INNOTECH"
                  className="h-28 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const next = e.currentTarget.nextElementSibling as HTMLElement;
                    if (next) next.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-gradient-light flex items-center justify-center">
                    <span className="text-white font-black text-base">S</span>
                  </div>
                  <div>
                    <div className="font-black text-white text-base leading-none">STATS</div>
                    <div className="font-bold text-brand-cyan text-xs leading-none">INNOTECH</div>
                  </div>
                </div>
              </Link>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Empowering the next generation of engineers and innovators through industry-ready training, internships, and practical education.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, colorHover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg bg-white/10 ${colorHover} text-white/80 hover:text-white transition-all flex items-center justify-center hover:scale-105 shadow-sm`}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            {/* fix #5: h4 → h3 to avoid heading-level skip (last heading was h2) */}
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider h-10 flex items-center">Quick Links</h3>
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
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider h-10 flex items-center">Programs</h3>
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
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider h-10 flex items-center">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-brand-cyan mt-0.5 shrink-0" />
                <a href="mailto:info@statsinnotech.com" className="text-sm text-white/60 hover:text-white transition-colors">
                  info@statsinnotech.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-brand-cyan mt-0.5 shrink-0" />
                <a href="tel:+917757014668" className="text-sm text-white/60 hover:text-white transition-colors">
                  +91 7757014668
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
              {/* fix #4: removed `uppercase` — 37 chars is too long for all-caps */}
              <span className="text-xs tracking-wider font-semibold">Civil Engineering — Industry Partner:</span>
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
