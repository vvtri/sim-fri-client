import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { isFriend } from '../services/friend.services';

export function genIsFriendQueryKey(userId: number) {
  const queryKey = [QUERY_KEYS.IS_FRIEND, userId];

  return queryKey;
}

export const useIsFriend = (userId: number) => {
  const queryKey = genIsFriendQueryKey(userId);

  return {
    ...useQuery({
      queryKey,
      queryFn: () => isFriend(userId),
    }),
  };
};
