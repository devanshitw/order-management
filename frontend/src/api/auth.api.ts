import client from './client';
import { AuthResponse, User } from '../types';

export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone_number?: string;
    address?: string;
  }) => client.post('/auth/register', data) as Promise<AuthResponse>,

  login: (data: { email: string; password: string }) =>
    client.post('/auth/login', data) as Promise<AuthResponse>,

  getProfile: () => client.get('/auth/me') as Promise<User>,
};
