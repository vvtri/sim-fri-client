import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IReactToMessageReq } from '../interfaces/req/message.req.interface';
import { IReactToMessageRes } from '../interfaces/res/message.res.interface';
import { reactToMessage } from '../services/message.service';

export const useReactMessage = (
  opts: Pick<
    MutationOptions<IReactToMessageRes, any, IReactToMessageReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: IReactToMessageReq) => reactToMessage(data),
      ...opts,
    }),
  };
};
