import api from './api';
import type { Course } from '../types';

export interface EnrollmentPayload {
  courseId?: number;
  slug?: string;
  batchType?: string;
  paymentMethod?: string;
  paidAmount?: number;
  couponCode?: string;
}

export interface EnrollmentResponse {
  id: number;
  enrollmentId: string;
  status: string;
  progress: number;
  paymentStatus: string;
  paymentAmount: number;
  batchType: string;
  enrolledAt: string;
  course: Course;
}

export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },

  getCourseBySlug: async (slug: string): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${slug}`);
    return response.data;
  },

  enroll: async (payload: EnrollmentPayload): Promise<EnrollmentResponse> => {
    const response = await api.post<EnrollmentResponse>('/courses/enroll', payload);
    return response.data;
  },

  updateProgress: async (courseId: number, progress: number): Promise<EnrollmentResponse> => {
    const response = await api.put<EnrollmentResponse>(`/student/courses/${courseId}/progress`, { progress });
    return response.data;
  },

  updateProgressBySlug: async (slug: string, progress: number): Promise<EnrollmentResponse> => {
    const response = await api.put<EnrollmentResponse>(`/student/courses/by-slug/${slug}/progress`, { progress });
    return response.data;
  },
};
