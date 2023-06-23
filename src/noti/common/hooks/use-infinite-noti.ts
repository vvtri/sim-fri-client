import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { IGetListNotiReq } from '../interfaces/req/noti.req.interface';
import { IGetListNotiRes } from '../interfaces/res/noti.res.interface';
import { INoti } from '../models/noti.model';
import { getListNoti } from '../services/message.service';

export function genInfiniteNotiQueryKey(params: IGetListNotiReq) {
  const queryKey = [QUERY_KEYS.INFINITE_NOTI, params];
  return queryKey;
}

export const useInfiniteNoti = (params: IGetListNotiReq) => {
  const queryClient = useQueryClient();
  const queryKey = genInfiniteNotiQueryKey(params);

  const afterMutateRead = (res: INoti) => {
    queryClient.setQueryData<InfiniteData<IGetListNotiRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const newData = structuredClone(oldData);

        for (const page of newData.pages) {
          for (const item of page.items) {
            if (item.id === res.id) {
              item.readAt = res.readAt;
              break;
            }
          }
        }

        return newData;
      },
    );
  };

  return {
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getListNoti({ ...params, page: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
    }),
    queryKey,
    afterMutateRead,
  };
};
