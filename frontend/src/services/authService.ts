import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
}

export interface BackendAuthResponse {
  token: string;
  tokenType: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  studentId?: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<BackendAuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<BackendAuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/register', payload);
    return response.data;
  },
};
