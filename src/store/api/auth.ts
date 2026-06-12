import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';
import { AuthResponse, LoginRequest, RegisterRequest, User, UpdateProfileRequest, ChangePasswordRequest } from './types';
import useAuthStore from '@/lib/store/authStore';

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
  },

  updateProfile: (data: UpdateProfileRequest) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.avatar) formData.append('avatar', data.avatar);

    return axiosClient.put<any, { success: boolean; message: string; data: User }>('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  changePassword: (data: ChangePasswordRequest) => {
    return axiosClient.put<any, { success: boolean; message: string }>('/auth/change-password', data);
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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      if (response?.data) {
        updateUser(response.data);
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
};

export default authApi;
