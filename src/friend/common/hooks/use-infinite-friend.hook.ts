import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { IGetListFriendRequestReq } from '../interfaces/req/friend-request.req.dto';
import { getListFriend } from '../services/friend.services';

type InfiniteFriendPayload = Pick<
  IGetListFriendRequestReq,
  'searchText' | 'status' | 'userId' | 'limit'
>;

export function genInfiniteFriendQueryKey({
  searchText,
  status,
  userId,
  limit,
}: InfiniteFriendPayload) {
  const queryKey = [
    QUERY_KEYS.INFINITE_FRIEND,
    searchText,
    status,
    userId,
    limit,
  ];

  return queryKey;
}

export const useInfiniteFriend = (payload: InfiniteFriendPayload) => {
  const queryKey = genInfiniteFriendQueryKey(payload);

  return {
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        getListFriend({ page: pageParam, ...payload }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
    }),
  };
};
