import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';
import { 
  AdminGetImagesQuery, 
  Category, 
  CreateCategoryRequest, 
  ImageModel, 
  PaginatedResponse, 
  RejectImageRequest, 
  UpdateCategoryRequest, 
  UploadImageRequest, 
  User 
} from './types';

// API Functions
const adminApi = {
  // Users
  getAllUsers: () => {
    return axiosClient.get<any, User[]>('/admin/users');
  },
  
  // Categories
  getAllCategories: () => {
    return axiosClient.get<any, Category[]>('/admin/categories');
  },
  
  createCategory: (data: CreateCategoryRequest) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description !== undefined) {
      formData.append('description', data.description);
    }
    if (data.isPublic !== undefined) {
      formData.append('isPublic', data.isPublic.toString());
    }
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    return axiosClient.post<any, Category>('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateCategory: ({ id, data }: { id: string; data: UpdateCategoryRequest }) => {
    const formData = new FormData();
    if (data.name !== undefined) {
      formData.append('name', data.name);
    }
    if (data.description !== undefined) {
      formData.append('description', data.description);
    }
    if (data.isPublic !== undefined) {
      formData.append('isPublic', data.isPublic.toString());
    }
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    return axiosClient.put<any, Category>(`/admin/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  toggleCategoryPublic: (id: string) => {
    return axiosClient.patch<any, Category>(`/admin/categories/${id}/toggle-public`);
  },
  
  deleteCategory: (id: string) => {
    return axiosClient.delete<any, { success: boolean }>(`/admin/categories/${id}`);
  },
  
  // Images
  getAllImages: (params?: AdminGetImagesQuery) => {
    return axiosClient.get<any, PaginatedResponse<ImageModel>>('/admin/images', { params });
  },
  
  uploadImage: (data: UploadImageRequest) => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('title', data.title);
    formData.append('categoryId', data.categoryId);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.isPublic !== undefined) {
      formData.append('isPublic', data.isPublic.toString());
    }

    return axiosClient.post<any, ImageModel>('/admin/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  approveImage: (id: string) => {
    return axiosClient.patch<any, ImageModel>(`/admin/images/${id}/approve`);
  },
  
  rejectImage: ({ id, data }: { id: string; data: RejectImageRequest }) => {
    return axiosClient.patch<any, ImageModel>(`/admin/images/${id}/reject`, data);
  },
  
  toggleImagePublic: (id: string) => {
    return axiosClient.patch<any, ImageModel>(`/admin/images/${id}/toggle-public`);
  },
  
  deleteImage: (id: string) => {
    return axiosClient.delete<any, { success: boolean }>(`/admin/images/${id}`);
  }
};

// React Query Hooks - Users
export const useAdminGetAllUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getAllUsers,
  });
};

// React Query Hooks - Categories
export const useAdminGetAllCategories = () => {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminApi.getAllCategories,
  });
};

export const useAdminCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
    },
  });
};

export const useAdminUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
    },
  });
};

export const useAdminToggleCategoryPublic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.toggleCategoryPublic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
    },
  });
};

export const useAdminDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
    },
  });
};

// React Query Hooks - Images
export const useAdminGetAllImages = (params?: AdminGetImagesQuery) => {
  return useQuery({
    queryKey: ['admin', 'images', params],
    queryFn: () => adminApi.getAllImages(params),
  });
};

export const useAdminUploadImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'images'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'images'] });
    },
  });
};

export const useAdminApproveImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.approveImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'images'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'images'] });
    },
  });
};

export const useAdminRejectImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.rejectImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'images'] });
    },
  });
};

export const useAdminToggleImagePublic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.toggleImagePublic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'images'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'images'] });
    },
  });
};

export const useAdminDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'images'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'images'] });
    },
  });
};

export default adminApi;
