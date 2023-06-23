import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IReactPostReq } from '../interfaces/req/post.req.interface';
import { IReactPostRes } from '../interfaces/res/post.res.interface';
import { reactPost } from '../services/post.service';

export const useReactPost = (
  opts: Pick<
    MutationOptions<IReactPostRes, any, IReactPostReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: IReactPostReq) => reactPost(data),
      ...opts,
    }),
  };
};
