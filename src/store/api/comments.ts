import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from './axiosClient';
import { CommentModel } from './types';

export const useGetComments = (imageId?: number) => {
  return useQuery({
    queryKey: ['comments', imageId],
    queryFn: async () => {
      if (!imageId) return { data: [] };
      const response = await axiosClient.get<{ data: CommentModel[] }>(`/images/${imageId}/comments`);
      // Since the interceptor returns the body which looks like { success: true, data: [...] },
      // response here IS that body. We return it directly.
      return response as unknown as { data: CommentModel[] };
    },
    enabled: !!imageId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId, content }: { imageId: number; content: string }) => {
      const response = await axiosClient.post(`/images/${imageId}/comments`, { content });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.imageId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      const response = await axiosClient.delete(`/comments/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all comments just to be safe, or we could pass imageId
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
