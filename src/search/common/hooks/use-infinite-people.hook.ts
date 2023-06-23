import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { ISearchPeopleReq } from '../interfaces/req/search-people.req.interface';
import { searchPeople } from '../services/search-people.service';

export const useInfinitePeople = (
  params: ISearchPeopleReq,
  opts?: Pick<UseInfiniteQueryOptions, 'enabled'>,
) => {
  const queryKey = [QUERY_KEYS.INFINITE_PEOPLE, params];
  return {
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => searchPeople({ ...params, page: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
      ...opts,
      keepPreviousData: false,
    }),
  };
};
