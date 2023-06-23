import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IMessageUserInfo } from '../models/message-user-info.model';
import { readMessage } from '../services/message.service';

export const useReadMessage = (
  opts: Pick<
    MutationOptions<IMessageUserInfo, any, number>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (messageId: number) => readMessage(messageId),
      ...opts,
    }),
  };
};
