import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { getFriend } from '../services/friend.services';

export function genGetFriendQueryKey(userId: number) {
  const queryKey = [QUERY_KEYS.GET_FRIEND, userId];

  return queryKey;
}

export const useGetFriend = (userId: number) => {
  const queryKey = genGetFriendQueryKey(userId);

  return {
    ...useQuery({
      queryKey,
      queryFn: () => getFriend(userId),
    }),
  };
};
