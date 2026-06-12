import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';
import { ImageModel, UploadImageRequest } from './types';

// API Functions
const userImagesApi = {
  getMyImages: () => {
    return axiosClient.get<any, { success: boolean; message: string; data: ImageModel[] }>('/images/my');
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

    return axiosClient.post<any, ImageModel>('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteImage: (id: string) => {
    return axiosClient.delete<any, { success: boolean }>(`/images/${id}`);
  },

  getSavedImages: () => {
    return axiosClient.get<any, { success: boolean; message: string; data: ImageModel[] }>('/images/saved');
  },

  getSavedImageIds: () => {
    return axiosClient.get<any, { success: boolean; message: string; data: number[] }>('/images/saved/ids');
  },

  saveImage: (id: string | number) => {
    return axiosClient.post<any, { success: boolean; message: string }>(`/images/${id}/save`);
  },

  unsaveImage: (id: string | number) => {
    return axiosClient.delete<any, { success: boolean; message: string }>(`/images/${id}/save`);
  }
};

// React Query Hooks
export const useGetMyImages = () => {
  return useQuery({
    queryKey: ['my', 'images'],
    queryFn: userImagesApi.getMyImages,
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userImagesApi.uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my', 'images'] });
      // We don't invalidate public images yet because it might be pending approval
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userImagesApi.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my', 'images'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'images'] });
    },
  });
};

export const useGetSavedImages = () => {
  return useQuery({
    queryKey: ['saved', 'images'],
    queryFn: userImagesApi.getSavedImages,
  });
};

export const useGetSavedImageIds = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['saved', 'image-ids'],
    queryFn: userImagesApi.getSavedImageIds,
    ...options,
  });
};

export const useSaveImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userImagesApi.saveImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved', 'images'] });
      queryClient.invalidateQueries({ queryKey: ['saved', 'image-ids'] });
    },
  });
};

export const useUnsaveImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userImagesApi.unsaveImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved', 'images'] });
      queryClient.invalidateQueries({ queryKey: ['saved', 'image-ids'] });
    },
  });
};

export default userImagesApi;
