import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IDeleteReactCommentReq } from '../interfaces/req/comment.req.interface';
import { deleteReactComment } from '../services/comment.service';

export const useDeleteReactComment = (
  opts: Pick<
    MutationOptions<void, any, IDeleteReactCommentReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: IDeleteReactCommentReq) => deleteReactComment(data),
      ...opts,
    }),
  };
};
