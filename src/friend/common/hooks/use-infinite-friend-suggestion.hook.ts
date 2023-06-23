import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { getListFriendSuggestion } from '../services/friend.services';

export function genInfiniteFriendSuggestionQueryKey(limit: number) {
  const queryKey = [QUERY_KEYS.INFINITE_FRIEND_SUGGESTION, limit];

  return queryKey;
}

export const useInfiniteFriendSuggestion = (limit: number) => {
  const queryKey = genInfiniteFriendSuggestionQueryKey(limit);

  return {
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        getListFriendSuggestion({ page: pageParam, limit }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
    }),
  };
};
