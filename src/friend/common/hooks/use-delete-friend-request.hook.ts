import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IDeleteFriendRes } from '../interfaces/res/friend-request.res.dto';
import { deleteFriendRequest } from '../services/friend.services';

export const useDeleteFriendRequest = (
  opts: Pick<
    MutationOptions<IDeleteFriendRes, any, number>,
    'onError' | 'onSuccess'
  >,
) => {
  return {
    ...useMutation({
      mutationFn: (userId: number) => deleteFriendRequest(userId),
      ...opts,
    }),
  };
};
