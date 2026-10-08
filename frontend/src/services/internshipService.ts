import api from './api';
import type { Internship } from '../types';

export interface InternshipApplyPayload {
  internshipId?: number;
  slug?: string;
  preferredDuration?: string;
  preferredMode?: string;
  resumeUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
  statementOfPurpose?: string;
}

export interface InternshipApplicationResponse {
  id: number;
  applicationId: string;
  preferredDuration?: string;
  preferredMode?: string;
  resumeUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
  statementOfPurpose?: string;
  status: string;
  appliedAt: string;
  internship: Internship;
}

export const internshipService = {
  getAllInternships: async (domain?: string): Promise<Internship[]> => {
    const params = domain ? { domain } : {};
    const response = await api.get<Internship[]>('/internships', { params });
    return response.data;
  },

  getInternshipBySlug: async (slug: string): Promise<Internship> => {
    const response = await api.get<Internship>(`/internships/${slug}`);
    return response.data;
  },

  apply: async (payload: InternshipApplyPayload): Promise<InternshipApplicationResponse> => {
    const response = await api.post<InternshipApplicationResponse>('/internships/apply', payload);
    return response.data;
  },
};
