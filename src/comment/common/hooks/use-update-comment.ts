import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IUpdateCommentReq } from '../interfaces/req/comment.req.interface';
import { IUpdateCommentRes } from '../interfaces/res/comment.res.interface';
import { updateComment } from '../services/comment.service';

export const useUpdateComment = (
  opts?: Pick<
    MutationOptions<IUpdateCommentRes, any, IUpdateCommentReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: IUpdateCommentReq) => updateComment(data),
      ...opts,
    }),
  };
};
