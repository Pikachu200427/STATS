import api from './api';
import type {
  Student,
  Course,
  Internship,
  InternshipApplication,
  CourseEnrollment,
  OfferLetter,
  Certificate,
  SupportQuery,
  IndustryPartner,
  ContactEnquiry,
} from '../types';

export interface AdminDashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalInternships: number;
  totalEnrollments: number;
  totalApplications: number;
  pendingApplications: number;
  totalOfferLetters: number;
  totalCertificates: number;
  openQueries: number;
  unreadMessages: number;
  activePartners: number;
}

export interface AdminAnalyticsData {
  totalStudents: number;
  totalCourses: number;
  totalInternships: number;
  totalEnrollments: number;
  totalApplications: number;
  totalRevenue: number;
  applicationStatusBreakdown: Record<string, number>;
  enrollmentStatusBreakdown: Record<string, number>;
  totalCertificates: number;
  totalOfferLetters: number;
}

export interface IssueOfferLetterPayload {
  studentId: number | string;
  internshipId: number | string;
  startDate?: string;
  stipend?: string;
  file?: File;
  sendEmail?: boolean;
}

export interface IssueCertificatePayload {
  studentId: number | string;
  type: string;
  title: string;
  domain: string;
  grade?: string;
  file?: File;
  sendEmail?: boolean;
}

export const adminService = {
  // Dashboard & Analytics
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const res = await api.get<AdminDashboardStats>('/admin/dashboard');
    return res.data;
  },

  getAnalytics: async (): Promise<AdminAnalyticsData> => {
    const res = await api.get<AdminAnalyticsData>('/admin/analytics');
    return res.data;
  },

  // Students
  getStudents: async (): Promise<Student[]> => {
    const res = await api.get<Student[]>('/admin/students');
    return res.data;
  },

  // Courses
  getCourses: async (): Promise<Course[]> => {
    const res = await api.get<Course[]>('/admin/courses');
    return res.data;
  },

  createCourse: async (course: Partial<Course>): Promise<Course> => {
    const res = await api.post<Course>('/admin/courses', course);
    return res.data;
  },

  updateCourse: async (id: number | string, course: Partial<Course>): Promise<Course> => {
    const res = await api.put<Course>(`/admin/courses/${id}`, course);
    return res.data;
  },

  deleteCourse: async (id: number | string): Promise<void> => {
    await api.delete(`/admin/courses/${id}`);
  },

  // Internships
  getInternships: async (): Promise<Internship[]> => {
    const res = await api.get<Internship[]>('/admin/internships');
    return res.data;
  },

  createInternship: async (internship: Partial<Internship>): Promise<Internship> => {
    const res = await api.post<Internship>('/admin/internships', internship);
    return res.data;
  },

  updateInternship: async (id: number | string, internship: Partial<Internship>): Promise<Internship> => {
    const res = await api.put<Internship>(`/admin/internships/${id}`, internship);
    return res.data;
  },

  deleteInternship: async (id: number | string): Promise<void> => {
    await api.delete(`/admin/internships/${id}`);
  },

  // Applications
  getApplications: async (): Promise<InternshipApplication[]> => {
    const res = await api.get<InternshipApplication[]>('/admin/applications');
    return res.data;
  },

  reviewApplication: async (
    id: number | string,
    status: string,
    reviewNotes?: string
  ): Promise<InternshipApplication> => {
    const params = new URLSearchParams();
    params.append('status', status);
    if (reviewNotes) params.append('reviewNotes', reviewNotes);

    const res = await api.patch<InternshipApplication>(`/admin/applications/${id}?${params.toString()}`);
    return res.data;
  },

  // Enrollments
  getEnrollments: async (): Promise<CourseEnrollment[]> => {
    const res = await api.get<CourseEnrollment[]>('/admin/enrollments');
    return res.data;
  },

  updateEnrollmentStatus: async (id: number | string, status: string): Promise<CourseEnrollment> => {
    const res = await api.patch<CourseEnrollment>(`/admin/enrollments/${id}/status?status=${encodeURIComponent(status)}`);
    return res.data;
  },

  // Offer Letters
  getOfferLetters: async (): Promise<OfferLetter[]> => {
    const res = await api.get<OfferLetter[]>('/admin/offer-letters');
    return res.data;
  },

  issueOfferLetter: async (payload: IssueOfferLetterPayload): Promise<OfferLetter> => {
    const formData = new FormData();
    formData.append('studentId', String(payload.studentId));
    formData.append('internshipId', String(payload.internshipId));
    if (payload.startDate) formData.append('startDate', payload.startDate);
    if (payload.stipend) formData.append('stipend', payload.stipend);
    if (payload.file) formData.append('file', payload.file);
    if (payload.sendEmail !== undefined) formData.append('sendEmail', String(payload.sendEmail));

    const res = await api.post<OfferLetter>('/admin/offer-letters', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadOfferLetterDocument: async (id: number | string, file: File, sendEmail = true): Promise<OfferLetter> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sendEmail', String(sendEmail));

    const res = await api.post<OfferLetter>(`/admin/offer-letters/${id}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Certificates
  getCertificates: async (): Promise<Certificate[]> => {
    const res = await api.get<Certificate[]>('/admin/certificates');
    return res.data;
  },

  issueCertificate: async (payload: IssueCertificatePayload): Promise<Certificate> => {
    const formData = new FormData();
    formData.append('studentId', String(payload.studentId));
    formData.append('type', payload.type);
    formData.append('title', payload.title);
    formData.append('domain', payload.domain);
    if (payload.grade) formData.append('grade', payload.grade);
    if (payload.file) formData.append('file', payload.file);
    if (payload.sendEmail !== undefined) formData.append('sendEmail', String(payload.sendEmail));

    const res = await api.post<Certificate>('/admin/certificates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadCertificateDocument: async (id: number | string, file: File, sendEmail = true): Promise<Certificate> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sendEmail', String(sendEmail));

    const res = await api.post<Certificate>(`/admin/certificates/${id}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Support Queries
  getQueries: async (): Promise<SupportQuery[]> => {
    const res = await api.get<SupportQuery[]>('/admin/queries');
    return res.data;
  },

  replyQuery: async (id: number | string, reply: string, status = 'RESOLVED'): Promise<SupportQuery> => {
    const res = await api.post<SupportQuery>(`/admin/queries/${id}/reply`, {
      reply,
      adminReply: reply,
      status,
    });
    return res.data;
  },

  // Contact Enquiries
  getEnquiries: async (): Promise<ContactEnquiry[]> => {
    const res = await api.get<ContactEnquiry[]>('/admin/enquiries');
    return res.data;
  },

  markEnquiryRead: async (id: number | string): Promise<ContactEnquiry> => {
    const res = await api.patch<ContactEnquiry>(`/admin/enquiries/${id}/read`);
    return res.data;
  },

  deleteEnquiry: async (id: number | string): Promise<void> => {
    await api.delete(`/admin/enquiries/${id}`);
  },

  // Partners
  getPartners: async (): Promise<IndustryPartner[]> => {
    const res = await api.get<IndustryPartner[]>('/admin/partners');
    return res.data;
  },

  createPartner: async (partner: Partial<IndustryPartner>): Promise<IndustryPartner> => {
    const res = await api.post<IndustryPartner>('/admin/partners', partner);
    return res.data;
  },

  deletePartner: async (id: number | string): Promise<void> => {
    await api.delete(`/admin/partners/${id}`);
  },
};
