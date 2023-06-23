import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { countFriend } from '../services/friend.services';
export function genCountFriendQueryKey(userId: number) {
  const queryKey = [QUERY_KEYS.COUNT_FRIEND, userId];

  return queryKey;
}

export const useCountFriend = (userId: number) => {
  const queryKey = genCountFriendQueryKey(userId);

  return {
    ...useQuery({
      queryKey,
      queryFn: () => countFriend(userId),
    }),
  };
};
