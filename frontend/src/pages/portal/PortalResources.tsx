import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, ExternalLink, Search, BookOpen, Code,
  Cpu, Database, Layers, Sparkles, Filter, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ResourceItem {
  id: string;
  title: string;
  category: 'CSE' | 'Civil' | 'CheatSheet' | 'Template';
  type: string;
  size: string;
  description: string;
  url: string;
  tags: string[];
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Modern Java 21 & Spring Boot 3 Architecture Handbook',
    category: 'CSE',
    type: 'PDF Guide',
    size: '4.8 MB',
    description: 'Comprehensive guide covering Virtual Threads, Records, Security with JWT, RESTful API design, and JPA optimizations.',
    url: '#',
    tags: ['Java', 'Spring Boot', 'Backend'],
  },
  {
    id: 'res-2',
    title: 'Full-Stack React 19 + TypeScript Starter Kit',
    category: 'Template',
    type: 'GitHub Repo',
    size: 'Online Repo',
    description: 'Production-ready boilerplate with Vite, Tailwind CSS, React Query, Zustand, and preconfigured ESLint + Prettier.',
    url: 'https://github.com',
    tags: ['React', 'TypeScript', 'Frontend'],
  },
  {
    id: 'res-3',
    title: 'Advanced Civil Surveying Field Manual (Total Station & Auto Level)',
    category: 'Civil',
    type: 'PDF Manual',
    size: '8.2 MB',
    description: 'Official fieldwork standards curated with AN Survey Consultant covering Traverse surveying, Contour mapping, and GPS/GNSS benchmarks.',
    url: '#',
    tags: ['Civil', 'Total Station', 'Surveying', 'AN Partner'],
  },
  {
    id: 'res-4',
    title: 'AutoCAD Civil 3D & Road Alignment Standards',
    category: 'Civil',
    type: 'PDF Guide',
    size: '11.5 MB',
    description: 'Step-by-step drafting conventions for highway cross-sections, cut-and-fill volume calculations, and contour generation.',
    url: '#',
    tags: ['AutoCAD', 'Civil 3D', 'Highway Design'],
  },
  {
    id: 'res-5',
    title: 'Data Structures & Algorithms Interview Cheatsheet',
    category: 'CheatSheet',
    type: 'Quick Reference',
    size: '1.2 MB',
    description: 'Top 75 LeetCode patterns with time/space complexities, tree traversals, dynamic programming blueprints, and graph algorithms.',
    url: '#',
    tags: ['DSA', 'Algorithms', 'Interview Prep'],
  },
  {
    id: 'res-6',
    title: 'Docker, Kubernetes & AWS Cloud Deployment Blueprint',
    category: 'CSE',
    type: 'DevOps Guide',
    size: '3.4 MB',
    description: 'Multi-stage Dockerfiles, Docker Compose files, Kubernetes manifests, and CI/CD GitHub Actions workflows.',
    url: '#',
    tags: ['Docker', 'DevOps', 'AWS', 'Kubernetes'],
  },
  {
    id: 'res-7',
    title: 'PostgreSQL Performance Tuning & Indexing Guide',
    category: 'CSE',
    type: 'Database Guide',
    size: '2.1 MB',
    description: 'B-Tree vs GIN indices, query EXPLAIN ANALYZE deep dive, connection pooling with PgBouncer, and transaction isolation levels.',
    url: '#',
    tags: ['PostgreSQL', 'SQL', 'Database'],
  },
  {
    id: 'res-8',
    title: 'Geographic Information Systems (QGIS) Starter Dataset',
    category: 'Civil',
    type: 'GIS Dataset',
    size: '18.4 MB',
    description: 'Shapefiles, raster digital elevation models (DEM), and GIS project files for watershed and urban runoff analysis.',
    url: '#',
    tags: ['GIS', 'QGIS', 'Hydrology'],
  }
];

export default function PortalResources() {
  const [activeTab, setActiveTab] = useState<'All' | 'CSE' | 'Civil' | 'CheatSheet' | 'Template'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = RESOURCES.filter((res) => {
    const matchesTab = activeTab === 'All' || res.category === activeTab;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleDownload = (title: string) => {
    toast.success(`Downloading: ${title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark">Learning Resources & Code Kits</h1>
          <p className="text-xs text-brand-slate mt-1">
            Handbooks, cheatsheets, CAD datasets, and starter repos provided for STATS INNOTECH students.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {(['All', 'CSE', 'Civil', 'CheatSheet', 'Template'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {tab === 'All' ? 'All Resources' : tab === 'CheatSheet' ? 'Cheatsheets' : tab === 'Template' ? 'Templates & Code' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, tag..."
            className="input-field pl-9 py-1.5 text-xs w-full"
          />
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5 bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`badge text-[11px] ${item.category === 'Civil'
                      ? 'bg-amber-100 text-amber-800'
                      : item.category === 'CSE'
                        ? 'bg-blue-100 text-brand-blue'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.size}</span>
                </div>
                {item.category === 'Civil' && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <Building2 size={10} /> AN Partner
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-brand-dark mb-1.5 leading-snug">{item.title}</h3>
              <p className="text-xs text-brand-slate/80 leading-relaxed mb-4">{item.description}</p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Verified Official Material</span>
                <button
                  onClick={() => handleDownload(item.title)}
                  className="btn-primary btn-sm text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Download size={13} />
                  Download / Access
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center bg-white border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-brand-dark">No resources found</h3>
          <p className="text-xs text-slate-500 mt-1">Try refining your search query or switching categories.</p>
        </div>
      )}
    </div>
  );
}
