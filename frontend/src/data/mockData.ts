import type { Course, CourseLevel, CourseStatus, Internship, InternshipDomain, InternshipMode, IndustryPartner, PlatformStats } from '../types';

// ===================== COURSES SEED DATA =====================
export const COURSES: Course[] = [
  {
    id: 1,
    title: 'Java (Core)',
    slug: 'java-core',
    shortDescription: 'Master Java programming from OOP to Multithreading with real-world projects.',
    description: 'Complete curriculum covering Java syntax, OOP, Collections, File I/O, Streams, and concurrency.',
    category: 'Programming',
    technology: 'Java 21',
    instructor: 'Sujal Sharma',
    duration: '1 Month',
    level: 'BEGINNER' as CourseLevel,
    price: 999,
    discountPrice: 699,
    thumbnail: '/assets/courses/java.png',
    status: 'ACTIVE' as CourseStatus,
    rating: 4.9,
    totalStudents: 184,
    createdAt: '2026-10-09T08:24:43Z',
  },
  {
    id: 2,
    title: 'Python',
    slug: 'python',
    shortDescription: 'Learn Python scripting, automation, APIs, and data science essentials.',
    description: 'From variables and data structures to FastAPI and data manipulation libraries.',
    category: 'Programming',
    technology: 'Python 3.12',
    instructor: 'Tanu Priya',
    duration: '1 Month',
    level: 'BEGINNER' as CourseLevel,
    price: 999,
    discountPrice: 699,
    thumbnail: '/api/placeholder/course/python',
    status: 'ACTIVE' as CourseStatus,
    rating: 4.8,
    totalStudents: 144,
    createdAt: '2026-10-09T08:24:43Z',
  },
  {
    id: 3,
    title: 'C & C++ Programming',
    slug: 'c-cpp',
    shortDescription: 'Build strong foundations in memory management, pointers, and OOP systems programming.',
    description: 'In-depth memory allocation, pointers, algorithms, and standard template library.',
    category: 'Programming',
    technology: 'C / C++',
    instructor: 'Ayushi Singh',
    duration: '1 Month',
    level: 'BEGINNER' as CourseLevel,
    price: 499,
    discountPrice: 299,
    thumbnail: '/api/placeholder/course/c-cpp',
    status: 'ACTIVE' as CourseStatus,
    rating: 4.8,
    totalStudents: 128,
    createdAt: '2026-10-09T08:24:43Z',
  },
  {
    id: 11,
    title: 'Data Analytics',
    slug: 'data-analytics',
    shortDescription: 'Comprehensive hands-on training module in Data Analytics and Power BI.',
    description: 'Hands-on curriculum with live industry projects, dashboards, data modeling, and reporting.',
    category: 'Data Analytics',
    technology: 'Power BI',
    instructor: 'Tanushree Gaikwad',
    duration: '1 Month',
    level: 'INTERMEDIATE' as CourseLevel,
    price: 799,
    discountPrice: 499,
    thumbnail: '/api/placeholder/course/data-analytics',
    status: 'ACTIVE' as CourseStatus,
    rating: 4.8,
    totalStudents: 45,
    createdAt: '2026-10-10T15:34:07Z',
  },
  {
    id: 14,
    title: 'Software Engineering',
    slug: 'software-engineering',
    shortDescription: 'Comprehensive hands-on training module covering software lifecycle and architecture.',
    description: 'Hands-on curriculum with live industry projects, SDLC methodologies, design patterns, and agile workflows.',
    category: 'Engineering',
    technology: 'Basics',
    instructor: 'Ayushi Moon',
    duration: '1 Month',
    level: 'BEGINNER' as CourseLevel,
    price: 899,
    discountPrice: 399,
    thumbnail: '/api/placeholder/course/software-engineering',
    status: 'ACTIVE' as CourseStatus,
    rating: 4.8,
    totalStudents: 36,
    createdAt: '2026-10-10T15:40:02Z',
  },
  {
    id: 16,
    title: 'DBMS',
    slug: 'dbms',
    shortDescription: 'Comprehensive hands-on training in relational databases, SQL, and database design.',
    description: 'Hands-on curriculum with live industry projects, MySQL query optimization, normalization, and ACID transactions.',
    category: 'Database',
    technology: 'MySQL',
    instructor: 'Ayushi Moon',
    duration: '1 Month',
    level: 'BEGINNER' as CourseLevel,
    price: 999,
    discountPrice: 499,
    thumbnail: '/api/placeholder/course/dbms',
    status: 'ACTIVE' as CourseStatus,
    rating: 4.8,
    totalStudents: 39,
    createdAt: '2026-10-10T15:46:03Z',
  },
];

// ===================== CSE INTERNSHIPS =====================
export const CSE_INTERNSHIPS: Internship[] = [
  {
    id: 1,
    title: 'Data Analytics Internship',
    slug: 'data-analytics-internship',
    domain: 'COMPUTER_SCIENCE_ENGINEERING' as InternshipDomain,
    technology: 'Python, SQL, Power BI, Excel',
    description: 'Gain hands-on experience in data collection, processing, analysis, and visualization. Work on real datasets and deliver actionable insights using industry-standard tools.',
    shortDescription: 'Analyze real-world data and deliver insights using Python, SQL, and visualization tools.',
    duration: '4 Weeks / 8 Weeks',
    mode: 'ONLINE' as InternshipMode,
    eligibility: 'BE/B.Tech/BCA/BSc (CS/IT/EC) or equivalent, 2nd Year and above',
    skills: ['Python', 'SQL', 'Excel', 'Power BI / Tableau', 'Statistics'],
    responsibilities: [
      'Collect and clean datasets from various sources',
      'Perform exploratory data analysis (EDA)',
      'Build visualizations and dashboards',
      'Present findings to the team',
    ],
    learningOutcomes: [
      'Proficient data analysis using pandas and NumPy',
      'Create professional visualizations',
      'Write complex SQL queries',
      'Communicate data insights effectively',
    ],
    status: 'ACTIVE' as CourseStatus,
    icon: 'BarChart2',
    color: '#155EEF',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Web Development Internship',
    slug: 'web-development-internship',
    domain: 'COMPUTER_SCIENCE_ENGINEERING' as InternshipDomain,
    technology: 'HTML, CSS, JavaScript, React',
    description: 'Build real-world web applications from scratch. Work across frontend and backend technologies to develop production-ready applications.',
    shortDescription: 'Build full-stack web applications using modern JavaScript frameworks and technologies.',
    duration: '4 Weeks / 8 Weeks / 12 Weeks',
    mode: 'ONLINE' as InternshipMode,
    eligibility: 'BE/B.Tech/BCA/BSc (CS/IT) or equivalent, 2nd Year and above',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Git'],
    responsibilities: [
      'Develop responsive UI components',
      'Integrate REST APIs',
      'Participate in code reviews',
      'Deploy web applications',
    ],
    learningOutcomes: [
      'Build and deploy React applications',
      'Implement RESTful APIs',
      'Use Git for version control',
      'Work in an Agile development environment',
    ],
    status: 'ACTIVE' as CourseStatus,
    icon: 'Globe',
    color: '#06B6D4',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 8,
    title: 'Python Development Internship',
    slug: 'python-internship',
    domain: 'COMPUTER_SCIENCE_ENGINEERING' as InternshipDomain,
    technology: 'Python, Django/Flask, REST APIs',
    description: 'Develop Python applications and APIs. Work on automation scripts, web backends, and data processing pipelines in a real-world project environment.',
    shortDescription: 'Develop Python applications, REST APIs, and automation scripts in a real project environment.',
    duration: '4 Weeks / 8 Weeks',
    mode: 'ONLINE' as InternshipMode,
    eligibility: 'BE/B.Tech/BCA/BSc (CS/IT) or equivalent, Python basics required',
    skills: ['Python', 'Django', 'Flask', 'REST APIs', 'PostgreSQL', 'Git'],
    responsibilities: [
      'Build Python web applications and APIs',
      'Write automation and scripting solutions',
      'Integrate with databases and third-party APIs',
      'Document and test code',
    ],
    learningOutcomes: [
      'Build Django/Flask web applications',
      'Design RESTful Python APIs',
      'Work with databases from Python',
      'Automate real-world tasks with Python',
    ],
    status: 'ACTIVE' as CourseStatus,
    icon: 'Terminal',
    color: '#3B82F6',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    title: 'Cloud Computing Internship',
    slug: 'cloud-computing-internship',
    domain: 'COMPUTER_SCIENCE_ENGINEERING' as InternshipDomain,
    technology: 'AWS, Linux, Docker, Terraform',
    description: 'Deploy and manage real applications on AWS. Work with EC2, S3, Lambda, RDS, VPC, IAM, and DevOps tools. Gain practical cloud engineering experience.',
    shortDescription: 'Deploy real applications on AWS — EC2, S3, Lambda, DevOps, and cloud architecture.',
    duration: '8 Weeks / 12 Weeks',
    mode: 'ONLINE' as InternshipMode,
    eligibility: 'BE/B.Tech (CS/IT/EC) or equivalent, Linux basics helpful',
    skills: ['AWS', 'Linux', 'Docker', 'CI/CD', 'Terraform', 'Python'],
    responsibilities: [
      'Set up and manage AWS infrastructure',
      'Deploy applications using EC2 and ECS',
      'Implement serverless functions with Lambda',
      'Configure VPCs, IAM, and security groups',
    ],
    learningOutcomes: [
      'Deploy scalable applications on AWS',
      'Implement Infrastructure as Code',
      'Configure AWS security and networking',
      'Build CI/CD pipelines on AWS',
    ],
    status: 'ACTIVE' as CourseStatus,
    icon: 'Cloud',
    color: '#FF9900',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 7,
    title: 'Networking',
    slug: 'networking',
    domain: 'COMPUTER_SCIENCE_ENGINEERING' as InternshipDomain,
    technology: 'TCP/IP, Routing & Switching, CCNA, Wireshark, Linux Networking',
    description: 'Master core computer networking concepts, subnetting, packet analysis, router/switch configurations, and modern network security protocols.',
    shortDescription: 'Hands-on network engineering, protocols, Wireshark traffic inspection, and firewall management.',
    duration: '4 Weeks / 8 Weeks',
    mode: 'ONLINE' as InternshipMode,
    eligibility: 'BE/B.Tech (CS/IT/EC) or Diploma/BCA, 2nd Year and above',
    skills: ['TCP/IP', 'Routing & Switching', 'Wireshark', 'Network Security', 'Firewalls', 'Linux'],
    responsibilities: [
      'Analyze network traffic and capture packets with Wireshark',
      'Configure virtual routers, switches, and subnets',
      'Simulate client-server communication topologies',
      'Troubleshoot network connectivity and firewall policies',
    ],
    learningOutcomes: [
      'Design and document structured IP address plans and VLANs',
      'Diagnose network latencies and security bottlenecks',
      'Implement robust firewall and access list rules',
      'Gain practical industry-level network troubleshooting skills',
    ],
    status: 'ACTIVE' as CourseStatus,
    icon: 'Terminal',
    color: '#0284C7',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 9,
    title: 'Mobile Development Internship',
    slug: 'mobile-development-internship',
    domain: 'COMPUTER_SCIENCE_ENGINEERING' as InternshipDomain,
    technology: 'Flutter, React Native, Android Studio, Firebase, REST APIs',
    description: 'Design and build cross-platform mobile applications from interactive UI/UX components to state management, local storage, and cloud backend integration.',
    shortDescription: 'Build modern iOS & Android mobile apps with Flutter / React Native and cloud APIs.',
    duration: '8 Weeks / 12 Weeks',
    mode: 'ONLINE' as InternshipMode,
    eligibility: 'BE/B.Tech/BCA/BSc (CS/IT) or equivalent, basic programming knowledge required',
    skills: ['Mobile UI/UX', 'Flutter / React Native', 'Firebase', 'State Management', 'REST APIs', 'Git'],
    responsibilities: [
      'Develop pixel-perfect mobile user interface screens',
      'Integrate RESTful backends and real-time database feeds',
      'Implement authentication, push notifications, and offline caching',
      'Test apps across diverse screen resolutions and devices',
    ],
    learningOutcomes: [
      'Build and publish production-grade mobile applications',
      'Master cross-platform mobile architecture and state handling',
      'Connect apps with cloud services and analytics',
      'Deliver real mobile portfolio projects',
    ],
    status: 'ACTIVE' as CourseStatus,
    icon: 'Globe',
    color: '#8B5CF6',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ===================== CIVIL INTERNSHIP =====================
export const AN_SURVEY_PARTNER: IndustryPartner = {
  id: 1,
  name: 'AN Survey Consultant',
  description: 'AN Survey Consultant is a professional surveying and civil engineering consultancy providing expertise in land surveying, topographic surveys, building layout, and civil engineering consulting services.',
  website: '#',
  contact: 'contact@ansurvey.com',
  isActive: true,
};

export const CIVIL_INTERNSHIP: Internship = {
  id: 10,
  title: 'Civil Engineering Internship',
  slug: 'civil-engineering-internship',
  domain: 'CIVIL_ENGINEERING' as InternshipDomain,
  technology: 'AutoCAD, Total Station, GPS/GNSS, Levelling',
  description: 'A comprehensive Civil Engineering internship offered in association with AN Survey Consultant. Gain practical exposure to land surveying, AutoCAD drafting, site visits, construction supervision, and civil engineering fieldwork. This internship bridges the gap between academic knowledge and industry practice.',
  shortDescription: 'Practical Civil Engineering internship with field experience, surveying, and AutoCAD — in association with AN Survey Consultant.',
  duration: '4 Weeks / 8 Weeks',
  mode: 'HYBRID' as InternshipMode,
  eligibility: 'BE/B.Tech (Civil Engineering) or Diploma in Civil, 2nd Year and above',
  skills: ['AutoCAD', 'Surveying', 'Total Station', 'Levelling', 'Site Management', 'Civil Drawing'],
  responsibilities: [
    'Participate in land surveying activities',
    'Assist in AutoCAD drafting and design',
    'Attend site visits and construction supervision',
    'Document field measurements and observations',
    'Prepare survey reports',
  ],
  learningOutcomes: [
    'Conduct topographic and boundary surveys',
    'Use Total Station and GPS for precise measurements',
    'Create professional AutoCAD drawings',
    'Apply civil engineering principles in the field',
    'Understand construction processes and site management',
  ],
  availableSeats: 10,
  status: 'ACTIVE' as CourseStatus,
  partner: AN_SURVEY_PARTNER,
  stipend: {
    enabled: true,
    type: 'PERFORMANCE_BASED',
    performanceCriteria: 'Attendance, project quality, site performance evaluation',
    eligibility: 'Students completing full internship duration with satisfactory performance',
    notes: 'Stipend eligibility is determined at the end of the internship based on the performance evaluation criteria set by AN Survey Consultant.',
  },
  icon: 'Building2',
  color: '#D97706',
  createdAt: '2024-01-01T00:00:00Z',
};

export const INTERNSHIPS: Internship[] = [...CSE_INTERNSHIPS, CIVIL_INTERNSHIP];

/**
 * Robust helper to locate an internship by slug or known alias across local mocks and API results
 */
export function findInternshipBySlug(slug?: string, extraList: Internship[] = []): Internship | undefined {
  if (!slug) return undefined;
  const s = slug.toLowerCase().trim();
  const all = [...extraList, ...INTERNSHIPS];

  // 1. Direct slug match
  let found = all.find((i) => i.slug?.toLowerCase() === s);
  if (found) return found;

  // 2. Direct ID match if slug is numeric
  if (/^\d+$/.test(s)) {
    found = all.find((i) => i.id === parseInt(s, 10));
    if (found) return found;
  }

  // 3. Known aliases map
  const aliases: Record<string, string[]> = {
    'ai-ml-internship': ['aiml-internship', 'ai-ml', 'aiml'],
    'aiml-internship': ['ai-ml-internship', 'aiml', 'ai-ml'],
    'cloud-computing-internship': ['aws-cloud-internship', 'cloud-devops-internship', 'cloud'],
    'aws-cloud-internship': ['cloud-computing-internship', 'cloud-devops-internship', 'cloud'],
    'cloud-devops-internship': ['data-analytics-internship', 'cloud-computing-internship'],
    'data-analytics-internship': ['cloud-devops-internship', 'data-analytics'],
    'python-development-internship': ['python-internship', 'python'],
    'python-internship': ['python-development-internship', 'python'],
    'web-development-internship': ['web-development', 'fullstack'],
    'civil-engineering-internship': ['civil', 'civil-internship'],
    'civil': ['civil-engineering-internship'],
    'networking': ['networking-internship', 'network-internship'],
    'mobile-development-internship': ['mobile-internship', 'app-development-internship'],
  };

  const candidateSlugs = aliases[s] || [];
  for (const cs of candidateSlugs) {
    found = all.find((i) => i.slug?.toLowerCase() === cs);
    if (found) return found;
  }

  // 4. Keyword / title partial match
  const cleanKeyword = s.replace(/[-_]/g, ' ').replace('internship', '').trim();
  if (cleanKeyword.length > 2) {
    found = all.find((i) => {
      const islug = (i.slug || '').toLowerCase().replace(/[-_]/g, ' ');
      const ititle = (i.title || '').toLowerCase();
      return islug.includes(cleanKeyword) || ititle.includes(cleanKeyword) || cleanKeyword.includes(ititle);
    });
    if (found) return found;
  }

  return undefined;
}

// ===================== PLATFORM STATS =====================
export const PLATFORM_STATS: PlatformStats = {
  totalStudents: 500,
  totalCourses: 10,
  totalInternships: 7,
  totalCertificates: 300,
  totalProjects: 150,
  activeEnrollments: 200,
};

// ===================== TESTIMONIALS =====================
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rohan Mehta',
    role: 'Java Developer',
    company: 'TCS',
    message: 'The Java Core course at STATS INNOTECH was exceptional. Sujal\'s teaching style made complex OOP concepts crystal clear. I landed my first job within 2 months of completing the course.',
    rating: 5,
    avatar: 'RM',
    domain: 'CSE',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Data Analyst',
    company: 'Infosys',
    message: 'The Data Analytics internship gave me real hands-on experience. Working on live datasets and building dashboards made me job-ready. Highly recommend STATS INNOTECH!',
    rating: 5,
    avatar: 'PS',
    domain: 'CSE',
  },
  {
    id: 3,
    name: 'Arjun Singh',
    role: 'Civil Engineer',
    company: 'L&T Construction',
    message: 'The Civil Engineering internship with AN Survey Consultant was a game-changer. Field surveying experience combined with AutoCAD training made my resume stand out.',
    rating: 5,
    avatar: 'AS',
    domain: 'Civil',
  },
  {
    id: 4,
    name: 'Anjali Patel',
    role: 'Cloud Engineer',
    company: 'Wipro',
    message: 'Shubham\'s AWS course is absolutely brilliant. From theory to hands-on labs, everything is well-structured. I cleared my AWS certification on the first attempt!',
    rating: 5,
    avatar: 'AP',
    domain: 'CSE',
  },
  {
    id: 5,
    name: 'Vikram Nair',
    role: 'Full Stack Developer',
    company: 'Startup',
    message: 'Web Development internship was incredible. Building real projects with React and Node.js gave me confidence. The mentorship was professional and supportive.',
    rating: 5,
    avatar: 'VN',
    domain: 'CSE',
  },
];

// ===================== FAQS =====================
export const FAQS = [
  {
    id: 1,
    question: 'What certificates/documents do I receive after completing an internship?',
    answer: 'CSE internship students receive an Offer Letter upon approval and a Certificate upon completion. Civil Engineering internship students receive a Civil-specific Offer Letter and a Completion Letter upon successfully finishing the program.',
  },
  {
    id: 2,
    question: 'Is the Civil Engineering internship offered in association with AN Survey Consultant?',
    answer: 'Yes. The Civil Engineering internship is offered by STATS INNOTECH in association with AN Survey Consultant, who provides the industry resources, field training, and expert guidance for the program.',
  },
  {
    id: 3,
    question: 'How is the performance-based stipend for Civil Engineering internship determined?',
    answer: 'The stipend is based on the intern\'s performance evaluated by AN Survey Consultant. Criteria include attendance, project quality, site performance, and completion of assigned tasks. Eligibility is determined at the end of the internship.',
  },
  {
    id: 4,
    question: 'Are the courses online or offline?',
    answer: 'Most courses and CSE internships are conducted online. The Civil Engineering internship may include hybrid components with site visits and fieldwork, as per the program schedule.',
  },
  {
    id: 5,
    question: 'How do I verify a certificate issued by STATS INNOTECH?',
    answer: 'All certificates and completion letters have a unique Certificate ID and verification code. Visit our Certificate Verification page and enter the ID/code to verify authenticity.',
  },
  {
    id: 6,
    question: 'Can I enroll in multiple courses or internships simultaneously?',
    answer: 'Yes, you can enroll in multiple courses. For internships, we recommend focusing on one at a time for the best learning experience. Contact our support team for specific combinations.',
  },
];

// ===================== INDUSTRY PARTNERS =====================
export const CIVIL_PARTNER: IndustryPartner = {
  id: 1,
  name: 'AN Survey Consultant',
  description: 'Premier infrastructure and land surveying consultancy providing live site exposure, total station instruments, and certified surveying training.',
  logo: '/assets/logo-icon.png',
  website: 'https://ansurvey.com',
  contact: 'contact@ansurvey.com',
  isActive: true,
};

