import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IUpdateReadStatusNotiReq } from '../interfaces/req/noti.req.interface';
import { IUpdateReadStatusNotiRes } from '../interfaces/res/noti.res.interface';
import { updateReadStatusNoti } from '../services/message.service';

export const useReadNoti = (
  opts: Pick<
    MutationOptions<IUpdateReadStatusNotiRes, any, IUpdateReadStatusNotiReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (data: IUpdateReadStatusNotiReq) =>
        updateReadStatusNoti(data),
      ...opts,
    }),
  };
};
