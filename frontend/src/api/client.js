import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const RESUME_API = '/api/resumes';
export const AI_API = '/api/ai';
export const USER_API = '/api/users';
export const PAYMENT_API = '/api/payments';

