import { MutationOptions, useMutation } from '@tanstack/react-query';
import { ISendMessageReq } from '../interfaces/req/message.req.interface';
import { ISendMessageRes } from '../interfaces/res/message.res.interface';
import { sendMessage } from '../services/message.service';

export const useSendMessage = (
  opts: Pick<
    MutationOptions<ISendMessageRes, any, ISendMessageReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: ISendMessageReq) => sendMessage(data),
      ...opts,
    }),
  };
};
