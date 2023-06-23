import { MutationOptions, useMutation } from '@tanstack/react-query';
import { ISavePostReq } from '../interfaces/req/post.req.interface';
import { IUpdatePostRes } from '../interfaces/res/post.res.interface';
import { updatePost } from '../services/post.service';

type MutateVariable = ISavePostReq & { id: number };

export const useUpdatePost = (
  opts: Pick<
    MutationOptions<IUpdatePostRes, any, MutateVariable>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: ({ id, ...data }: MutateVariable) => updatePost(id, data),
      ...opts,
    }),
  };
};
