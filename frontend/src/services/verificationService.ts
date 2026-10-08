import api from './api';

export interface VerificationResult {
  verified: boolean;
  certificateNumber?: string;
  verificationCode?: string;
  studentName?: string;
  programTitle?: string;
  type?: string;
  domain?: string;
  partnerName?: string;
  grade?: string;
  issueDate?: string;
  status?: string;
  verificationUrl?: string;
}

export const verificationService = {
  verifyCertificate: async (query: string): Promise<VerificationResult> => {
    const response = await api.get<VerificationResult>('/verify', {
      params: { query },
    });
    return response.data;
  },
};
