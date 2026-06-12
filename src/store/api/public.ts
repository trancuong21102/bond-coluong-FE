import { useQuery } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';
import { Category, GetPublicImagesQuery, ImageModel, PaginatedResponse } from './types';

// API Functions
const publicApi = {
  getCategories: () => {
    return axiosClient.get<any, { success: boolean; message: string; data: Category[] }>('/public/categories');
  },
  
  getCategoryBySlug: (slug: string) => {
    return axiosClient.get<any, { success: boolean; message: string; data: Category }>(`/public/categories/${slug}`);
  },
  
  getCategoryImages: (slug: string) => {
    return axiosClient.get<any, { success: boolean; message: string; data: ImageModel[] }>(`/public/categories/${slug}/images`);
  },
  
  getImages: (params?: GetPublicImagesQuery) => {
    return axiosClient.get<any, PaginatedResponse<ImageModel>>('/public/images', { params });
  },
  
  getImageById: (id: string) => {
    return axiosClient.get<any, { success: boolean; message: string; data: ImageModel }>(`/public/images/${id}`);
  }
};

// React Query Hooks
export const useGetPublicCategories = () => {
  return useQuery({
    queryKey: ['public', 'categories'],
    queryFn: publicApi.getCategories,
  });
};

export const useGetPublicCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['public', 'category', slug],
    queryFn: () => publicApi.getCategoryBySlug(slug),
    enabled: !!slug,
  });
};

export const useGetPublicCategoryImages = (slug: string) => {
  return useQuery({
    queryKey: ['public', 'category', slug, 'images'],
    queryFn: () => publicApi.getCategoryImages(slug),
    enabled: !!slug,
  });
};

export const useGetPublicImages = (params?: GetPublicImagesQuery) => {
  return useQuery({
    queryKey: ['public', 'images', params],
    queryFn: () => publicApi.getImages(params),
  });
};

export const useGetPublicImageById = (id: string) => {
  return useQuery({
    queryKey: ['public', 'image', id],
    queryFn: () => publicApi.getImageById(id),
    enabled: !!id,
  });
};

export default publicApi;
