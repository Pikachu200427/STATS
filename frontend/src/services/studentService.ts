import api from './api';
import type { Student, CourseEnrollment, InternshipApplication, OfferLetter, Certificate, SupportQuery } from '../types';

export interface DashboardData {
  student: Student;
  enrolledCoursesCount: number;
  activeApplicationsCount: number;
  offerLettersCount: number;
  certificatesCount: number;
  enrollments: CourseEnrollment[];
  applications: InternshipApplication[];
  recentQueries: SupportQuery[];
}

export interface SupportQueryPayload {
  category: string;
  subject: string;
  message: string;
  priority?: string;
}

export const studentService = {
  getProfile: async (): Promise<Student> => {
    const response = await api.get<Student>('/student/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<Student> & { firstName?: string; lastName?: string }): Promise<Student> => {
    const response = await api.put<Student>('/student/profile', data);
    return response.data;
  },


  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/student/dashboard');
    return response.data;
  },

  getEnrolledCourses: async (): Promise<CourseEnrollment[]> => {
    const response = await api.get<CourseEnrollment[]>('/student/courses');
    return response.data;
  },

  getApplications: async (): Promise<InternshipApplication[]> => {
    const response = await api.get<InternshipApplication[]>('/student/internships');
    return response.data;
  },

  getOfferLetters: async (): Promise<OfferLetter[]> => {
    const response = await api.get<OfferLetter[]>('/student/offer-letters');
    return response.data;
  },

  getCertificates: async (): Promise<Certificate[]> => {
    const response = await api.get<Certificate[]>('/student/certificates');
    return response.data;
  },

  getQueries: async (): Promise<SupportQuery[]> => {
    const response = await api.get<SupportQuery[]>('/student/queries');
    return response.data;
  },

  submitQuery: async (payload: SupportQueryPayload): Promise<SupportQuery> => {
    const response = await api.post<SupportQuery>('/student/queries', payload);
    return response.data;
  },
};
