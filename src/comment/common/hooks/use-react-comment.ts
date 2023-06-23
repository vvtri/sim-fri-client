import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IReactCommentReq } from '../interfaces/req/comment.req.interface';
import { IReactCommentRes } from '../interfaces/res/comment.res.interface';
import { reactComment } from '../services/comment.service';

export const useReactComment = (
  opts: Pick<
    MutationOptions<IReactCommentRes, any, IReactCommentReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: IReactCommentReq) => reactComment(data),
      ...opts,
    }),
  };
};
