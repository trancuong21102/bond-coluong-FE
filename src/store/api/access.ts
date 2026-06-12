import { useMutation } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';

export const useRequestCategoryAccess = () => {
  return useMutation({
    mutationFn: async (categoryId: string | number) => {
      const response = await axiosClient.post(`/categories/${categoryId}/request-access`);
      return response;
    },
  });
};
