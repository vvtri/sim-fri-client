import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { getListMessage } from '../services/message.service';

export function genInfiniteMessageQueryKey(conversationId: number) {
  const queryKey = [QUERY_KEYS.INFINITE_MESSAGE, conversationId];

  return queryKey;
}

export const useInfiniteMessage = (
  conversationId: number,
  enabled?: boolean,
) => {
  const queryKey = genInfiniteMessageQueryKey(conversationId);

  return {
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        getListMessage({ conversationId, page: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
      enabled,
    }),
  };
};
