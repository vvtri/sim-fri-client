import { MutationOptions, useMutation } from '@tanstack/react-query';
import { ICreateCommentReq } from '../interfaces/req/comment.req.interface';
import { ICreateCommentRes } from '../interfaces/res/comment.res.interface';
import { createComment } from '../services/comment.service';

export const useCreateComment = (
  opts?: Pick<
    MutationOptions<ICreateCommentRes, any, ICreateCommentReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: ICreateCommentReq) => createComment(data),
      ...opts,
    }),
  };
};
