import axios from 'axios';
import { User } from '../types/types';

const API_URL = 'http://localhost:5001/api/users';

interface AuthResponse {
  id(arg0: string, id: any): unknown;
  user: User;
  token: string;
}

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const getProfile = async (token: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
};