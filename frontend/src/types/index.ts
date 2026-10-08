// ===================== ENUMS =====================
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'ACTIVE' | 'INACTIVE' | 'COMING_SOON' | 'FULL';
export type InternshipDomain = 'COMPUTER_SCIENCE_ENGINEERING' | 'CIVIL_ENGINEERING' | 'CSE' | 'CIVIL' | string;
export type InternshipMode = 'ONLINE' | 'OFFLINE' | 'HYBRID';
export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'PENDING';
export type DocumentType = 'OFFER_LETTER' | 'CERTIFICATE' | 'COMPLETION_LETTER';
export type QueryCategory =
  | 'COURSE_ISSUE' | 'INTERNSHIP_ISSUE' | 'OFFER_LETTER' | 'CERTIFICATE'
  | 'COMPLETION_LETTER' | 'CIVIL_INTERNSHIP' | 'STIPEND' | 'PAYMENT'
  | 'TECHNICAL_ISSUE' | 'ACCOUNT' | 'OTHER';
export type QueryStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

// ===================== COURSE =====================
export interface Course {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  technology: string;
  instructor: string;
  duration: string;
  level: CourseLevel;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  curriculum: CurriculumModule[];
  learningOutcomes: string[];
  requirements: string[];
  startDate?: string;
  endDate?: string;
  availableSeats?: number;
  status: CourseStatus;
  rating?: number;
  totalStudents?: number;
  createdAt: string;
}

export interface CurriculumModule {
  id: number;
  title: string;
  duration: string;
  topics: string[];
}

// ===================== INTERNSHIP =====================
export interface Internship {
  id: number;
  title: string;
  slug: string;
  domain: InternshipDomain;
  technology?: string;
  description: string;
  shortDescription: string;
  duration: string;
  mode: InternshipMode;
  eligibility: string;
  skills: string[];
  responsibilities: string[];
  learningOutcomes: string[];
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  availableSeats?: number;
  status: CourseStatus;
  mentor?: string;
  resources?: InternshipResource[];
  partner?: IndustryPartner;
  partnerName?: string;
  stipend?: StipendInfo;
  stipendAmount?: string;
  stipendType?: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface StipendInfo {
  enabled: boolean;
  type: 'PERFORMANCE_BASED' | 'FIXED' | 'NOT_APPLICABLE';
  amount?: string;
  currency?: string;
  performanceCriteria?: string;
  eligibility?: string;
  notes?: string;
}

export interface InternshipResource {
  id: number;
  title: string;
  type: 'DOCUMENT' | 'VIDEO' | 'IMAGE' | 'LINK' | 'OTHER';
  url: string;
  accessLevel: 'PUBLIC' | 'ENROLLED';
  createdAt: string;
}

// ===================== PARTNER =====================
export interface IndustryPartner {
  id: number;
  name: string;
  industry?: string;
  location?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  mouValidTill?: string;
  description?: string;
  logo?: string;
  website?: string;
  contact?: string;
  isActive?: boolean;
  createdAt?: string;
}

// ===================== USER / STUDENT =====================
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT';
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Student {
  id: number;
  studentId: string;
  user: User;
  college?: string;
  degree?: string;
  branch?: string;
  year?: number;
  graduationYear?: number;
  phone?: string;
  skills?: string[] | string;
  linkedin?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resume?: string;
  resumeUrl?: string;
  profilePhoto?: string;
  createdAt: string;
}

// ===================== ENROLLMENT =====================
export interface CourseEnrollment {
  id: number;
  enrollmentId: string;
  student: Student;
  course: Course;
  status: EnrollmentStatus;
  progress: number;
  batchType?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface InternshipApplication {
  id: number;
  applicationId: string;
  student: Student;
  internship: Internship;
  status: ApplicationStatus;
  coverLetter?: string;
  additionalInfo?: string;
  civilSpecialization?: string;
  relevantTools?: string;
  surveyingExperience?: string;
  academicProjects?: string;
  preferredDuration?: string;
  preferredMode?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  statementOfPurpose?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}


export interface InternshipEnrollment {
  id: number;
  enrollmentId: string;
  application: InternshipApplication;
  status: EnrollmentStatus;
  mentor?: string;
  startDate?: string;
  endDate?: string;
  performanceScore?: number;
  performanceNotes?: string;
  stipendEligible?: boolean;
  stipendAmount?: string;
  enrolledAt: string;
  completedAt?: string;
}

// ===================== DOCUMENTS =====================
export interface Document {
  id: number;
  documentId: string;
  verificationCode: string;
  type: DocumentType;
  domain: InternshipDomain | 'COURSE';
  student: Student;
  fileUrl?: string;
  issuedAt: string;
  isValid: boolean;
  qrCode?: string;
  metadata?: Record<string, string>;
}

// ===================== QUERY =====================
export interface StudentQuery {
  id: number;
  queryId: string;
  student: Student;
  category: QueryCategory;
  subject: string;
  message: string;
  status: QueryStatus;
  adminResponse?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface SupportQuery {
  id: number;
  student?: Student;
  category: string;
  subject: string;
  message: string;
  priority?: string;
  status: string;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface OfferLetter {
  id: number;
  referenceNumber: string;
  verificationCode?: string;
  student?: Student;
  internship?: Internship;
  domain: string;
  partnerName?: string;
  roleTitle: string;
  stipendDetails?: string;
  startDate?: string;
  endDate?: string;
  issuedDate?: string;
  status: string;
  pdfPath?: string;
}

export interface Certificate {
  id: number;
  certificateNumber: string;
  verificationCode: string;
  student?: Student;
  type: string;
  title: string;
  domain: string;
  partnerName?: string;
  grade?: string;
  issueDate?: string;
  status: string;
  pdfPath?: string;
  createdAt?: string;
}


// ===================== ENQUIRY =====================
export interface ContactEnquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ===================== API RESPONSES =====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
  student?: Student;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  college?: string;
  degree?: string;
  branch?: string;
  year?: number;
}

// ===================== STATS =====================
export interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalInternships: number;
  totalCertificates: number;
  totalProjects: number;
  activeEnrollments: number;
}

export interface AdminDashboardStats {
  totalStudents: number;
  cseStudents: number;
  civilStudents: number;
  totalCourses: number;
  cseInternships: number;
  civilInternships: number;
  activeEnrollments: number;
  pendingApplications: number;
  totalCertificates: number;
  totalCompletionLetters: number;
  totalOfferLetters: number;
  pendingQueries: number;
  totalEnquiries: number;
}

// ===================== FILTERS =====================
export interface CourseFilters {
  search?: string;
  category?: string;
  technology?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  sortBy?: 'title' | 'price' | 'createdAt' | 'rating';
  sortDir?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface InternshipFilters {
  search?: string;
  domain?: InternshipDomain;
  technology?: string;
  status?: CourseStatus;
  page?: number;
  size?: number;
}
