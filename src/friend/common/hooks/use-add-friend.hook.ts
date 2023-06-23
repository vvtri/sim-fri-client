import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IAddFriendReq } from '../interfaces/req/friend-request.req.dto';
import { IAddFriendRes } from '../interfaces/res/friend-request.res.dto';
import { addFriend } from '../services/friend.services';

export const useAddFriend = (
  opts: Pick<
    MutationOptions<IAddFriendRes, any, IAddFriendReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (userId: number) => addFriend(userId),
      ...opts,
    }),
  };
};
