import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from './types';

// API Functions
const userCategoriesApi = {
  getMyCategories: () => {
    return axiosClient.get<any, { success: boolean; message: string; data: Category[] }>('/categories/my');
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

    return axiosClient.post<any, Category>('/categories', formData, {
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

    return axiosClient.put<any, Category>(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteCategory: (id: string) => {
    return axiosClient.delete<any, { success: boolean }>(`/categories/${id}`);
  }
};

// React Query Hooks
export const useGetMyCategories = () => {
  return useQuery({
    queryKey: ['my', 'categories'],
    queryFn: userCategoriesApi.getMyCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userCategoriesApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userCategoriesApi.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userCategoriesApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
    },
  });
};

export default userCategoriesApi;
