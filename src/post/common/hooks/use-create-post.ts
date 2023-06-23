import { MutationOptions, useMutation } from '@tanstack/react-query';
import { ISavePostReq } from '../interfaces/req/post.req.interface';
import { ICreatePostRes } from '../interfaces/res/post.res.interface';
import { createPost } from '../services/post.service';

export const useCreatePost = (
  opts: Pick<
    MutationOptions<ICreatePostRes, any, ISavePostReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: ISavePostReq) => createPost(data),
      ...opts,
    }),
  };
};
