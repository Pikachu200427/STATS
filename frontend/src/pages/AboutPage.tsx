import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Target, Eye, ArrowRight, Users, BookOpen, Briefcase, Globe } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const TEAM = [
  { name: 'Shubham Ajbale', role: 'Managing Director', initials: 'SA', bio: 'Founder and Managing Director of STATS INNOTECH. Leading the vision of bridging academia and industry.' },
  { name: 'Sujal', role: 'Java & DSA Instructor', initials: 'SJ', bio: 'Expert Java developer with industry experience. Passionate about teaching programming and algorithms.' },
  { name: 'Tanu', role: 'Python & Data Instructor', initials: 'TN', bio: 'Data science practitioner and educator. Specializes in Python, data analytics, and DSA.' },
  { name: 'Ayushi', role: 'C/C++ Instructor', initials: 'AY', bio: 'Systems programmer with expertise in C and C++. Brings deep knowledge of memory management and low-level programming.' },
  { name: 'Shubham', role: 'Linux & Cloud Instructor', initials: 'SH', bio: 'Cloud and DevOps engineer. Certified AWS practitioner with real-world cloud deployment experience.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="page-hero">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="container-xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-tag border border-white/20 bg-white/10 text-white/90 mx-auto w-fit mb-6">
              About STATS INNOTECH
            </div>
            <h1 className="heading-xl text-white mb-4">Building the Next Generation<br />of Tech Professionals</h1>
            <p className="body-lg text-white/70 max-w-3xl mx-auto">
              STATS INNOTECH is a technology education platform committed to empowering students with practical skills,
              real internship experience, and industry-recognized credentials.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Vision & Mission */}
      <section className="section">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: Eye,
                title: 'Our Vision',
                color: 'from-brand-blue to-brand-cyan',
                content: 'To become a trusted and leading platform that empowers students and aspiring professionals with practical skills, meaningful opportunities, and the right guidance to achieve their academic and career goals.',
              },
              {
                icon: Target,
                title: 'Our Mission',
                color: 'from-brand-dark to-brand-blue',
                content: null,
                points: [
                  'Provide students with quality internship and training opportunities.',
                  'Support students in developing academic and real-world projects.',
                  'Encourage research, innovation and technical learning.',
                  'Connect students with opportunities that help them build practical skills and professional confidence.',
                  'Create a supportive and reliable platform where students can learn, develop and grow.',
                ],
              },
            ].map(({ icon: Icon, title, color, content, points }, i) => (
              <motion.div key={title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                <div className="card p-8 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-brand mb-5`}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <h2 className="heading-sm text-brand-dark mb-4">{title}</h2>
                  {content ? (
                    <p className="body-md leading-relaxed">{content}</p>
                  ) : (
                    <ul className="space-y-3">
                      {points?.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm text-brand-slate">
                          <CheckCircle size={15} className="text-brand-blue mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Company Objectives */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-12">
              <div className="section-tag mx-auto w-fit">Company Objectives</div>
              <h2 className="heading-lg text-brand-dark">What Drives Us</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { no: '01', title: 'Bridge Academia & Industry', desc: 'Bridge the gap between academia and industry through practical, industry-oriented learning and professional exposure.' },
                { no: '02', title: 'Develop Future-Ready Talent', desc: 'Develop future-ready talent through internships, workshops, courses, training, mentorship, and skill development programs.' },
                { no: '03', title: 'Promote Practical Learning', desc: 'Promote practical learning and innovation through real-world projects, technology-driven solutions, and entrepreneurship.' },
                { no: '04', title: 'Support Academic Excellence', desc: 'Support academic excellence and research through academic projects, research assistance, technical development, and knowledge creation.' },
                { no: '05', title: 'Enhance Career Opportunities', desc: 'Enhance career opportunities and employability through career guidance, professional development, and industry exposure.' },
                { no: '06', title: 'Build Industry Collaborations', desc: 'Build strong industry and institutional collaborations with companies, educational institutions, experts, and professionals.' },
                { no: '07', title: 'Deliver Technology Solutions', desc: 'Deliver technology and digital growth solutions through digital marketing, SEO, and other technology-enabled professional services.' },
              ].map(({ no, title, desc }) => (
                <div key={no} className="card-hover p-6">
                  <div className="text-4xl font-black text-brand-blue/10 mb-3">{no}</div>
                  <h3 className="font-bold text-brand-dark mb-2">{title}</h3>
                  <p className="text-sm text-brand-slate/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer Summary */}
      <section className="section bg-gray-50">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="section-tag mx-auto w-fit">What We Offer</div>
            <h2 className="heading-lg text-brand-dark">Programs & Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: 'Technical Courses', count: '9+', color: 'from-blue-500 to-brand-blue' },
              { icon: Briefcase, label: 'CSE Internships', count: '9', color: 'from-cyan-500 to-brand-cyan' },
              { icon: Users, label: 'Civil Internship', count: '1', color: 'from-amber-500 to-orange-500' },
              { icon: Globe, label: 'Web Dev Services', count: '∞', color: 'from-purple-500 to-violet-600' },
            ].map(({ icon: Icon, label, count, color }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md mx-auto mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="text-3xl font-black text-brand-dark mb-1">{count}</div>
                <div className="text-sm text-brand-slate">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="section-tag mx-auto w-fit">Our Team</div>
            <h2 className="heading-lg text-brand-dark">Meet the Instructors</h2>
            <p className="body-lg max-w-xl mx-auto mt-4">
              Industry practitioners who bring real-world experience to every lesson.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="card-hover p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gradient-light flex items-center justify-center mx-auto mb-4 shadow-brand">
                    <span className="text-white font-black text-xl">{member.initials}</span>
                  </div>
                  <h3 className="font-bold text-brand-dark text-sm mb-0.5">{member.name}</h3>
                  <p className="text-xs text-brand-blue font-medium mb-3">{member.role}</p>
                  <p className="text-xs text-brand-slate/70 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Civil Partnership */}
      <section className="section-sm pb-24 md:pb-32">
        <div className="container-xl">
          <div className="card p-8 border-2 border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                <Users size={28} className="text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Industry Partnership</div>
                <h3 className="heading-sm text-brand-dark">Civil Engineering — In Association With AN Survey Consultant</h3>
                <p className="text-sm text-brand-slate/70 mt-2 max-w-2xl">
                  Our Civil Engineering internship program is conducted in association with AN Survey Consultant,
                  a professional surveying and civil engineering consultancy. This partnership enables us to provide
                  students with real field experience, industry exposure, and performance-based stipend opportunities.
                </p>
              </div>
              <Link to="/internships" className="btn bg-amber-500 text-white hover:bg-amber-600 btn-sm shrink-0">
                Explore Civil Internship <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
