import { MutationOptions, useMutation } from '@tanstack/react-query';
import { deleteComment } from '../services/comment.service';

export const useDeleteComment = (
  opts: Pick<MutationOptions<void, any, number>, 'onError' | 'onSuccess'>,
) => {
  return {
    ...useMutation({
      mutationFn: (commentId: number) => deleteComment(commentId),
      ...opts,
    }),
  };
};
