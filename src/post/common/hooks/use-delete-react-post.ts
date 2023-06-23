import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IDeleteReactPostReq } from '../interfaces/req/post.req.interface';
import { deleteReactPost } from '../services/post.service';

export const useDeleteReactPost = (
  opts: Pick<
    MutationOptions<void, any, IDeleteReactPostReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: IDeleteReactPostReq) => deleteReactPost(data),
      ...opts,
    }),
  };
};
