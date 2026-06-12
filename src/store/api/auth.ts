import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';
import { AuthResponse, LoginRequest, RegisterRequest, User } from './types';

// API Functions
const authApi = {
  register: (data: RegisterRequest) => {
    return axiosClient.post<any, { success: boolean; message: string; data: AuthResponse }>('/auth/register', data);
  },
  
  login: (data: LoginRequest) => {
    return axiosClient.post<any, { success: boolean; message: string; data: AuthResponse }>('/auth/login', data);
  },
  
  getMe: () => {
    return axiosClient.get<any, { success: boolean; message: string; data: User }>('/auth/me');
  }
};

// React Query Hooks
export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
  });
};

export const useGetMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false, // Don't retry if token is invalid
    ...options,
  });
};

export default authApi;
