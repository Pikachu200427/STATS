import api from './api';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
}

export const contactService = {
  sendMessage: async (payload: ContactPayload): Promise<ContactResponse> => {
    const response = await api.post<ContactResponse>('/contact', payload);
    return response.data;
  },
};
