import { MutationOptions, useMutation } from '@tanstack/react-query';
import { deletePost } from '../services/post.service';

export const useDeletePost = (
  opts: Pick<MutationOptions<void, any, number>, 'onError' | 'onSuccess'>,
) => {
  return {
    ...useMutation({
      mutationFn: (id: number) => deletePost(id),
      ...opts,
    }),
  };
};
