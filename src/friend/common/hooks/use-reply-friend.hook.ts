import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IReplyFriendRequestReq } from '../interfaces/req/friend-request.req.dto';
import { IReplyFriendRequestRes } from '../interfaces/res/friend-request.res.dto';
import { replyFriendRequest } from '../services/friend.services';

export const useReplyFriend = (
  opts: Pick<
    MutationOptions<IReplyFriendRequestRes, any, IReplyFriendRequestReq>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (payload: IReplyFriendRequestReq) =>
        replyFriendRequest(payload),
      ...opts,
    }),
  };
};
