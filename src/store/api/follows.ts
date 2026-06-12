import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';
import { FollowStatusResponse } from './types';

export const useGetFollowStatus = (userId?: number) => {
  return useQuery({
    queryKey: ['followStatus', userId],
    queryFn: async () => {
      if (!userId) return { data: { isFollowing: false } };
      const response = await axiosClient.get<{ data: FollowStatusResponse }>(`/users/${userId}/follow-status`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await axiosClient.post(`/users/${userId}/follow`);
      return response.data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', userId] });
      queryClient.invalidateQueries({ queryKey: ['public-images'] }); // Invalidate feed
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await axiosClient.delete(`/users/${userId}/follow`);
      return response.data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', userId] });
      queryClient.invalidateQueries({ queryKey: ['public-images'] }); // Invalidate feed
    },
  });
};
