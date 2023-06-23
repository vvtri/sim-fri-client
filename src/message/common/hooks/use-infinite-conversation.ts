import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { IGetListConversationReq } from '../interfaces/req/conversation.req.interface';
import { IGetListConversationRes } from '../interfaces/res/conversation.res.interface';
import { IConversation } from '../models/conversation.model';
import { IMessageUserInfo } from '../models/message-user-info.model';
import { IMessage } from '../models/message.model';
import { getListConversation } from '../services/conversation.service';

export function genInfiniteConversationQueryKey(
  params: IGetListConversationReq,
) {
  const queryKey = [QUERY_KEYS.INFINITE_CONVERSATION, params];
  return queryKey;
}

export const useInfiniteConversation = (params: IGetListConversationReq) => {
  const queryClient = useQueryClient();
  const queryKey = genInfiniteConversationQueryKey(params);

  const afterReadLatestMsg = (
    msgUserInfo: IMessageUserInfo,
    conversationId: number,
  ) => {
    queryClient.setQueryData<InfiniteData<IGetListConversationRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const newData = structuredClone(oldData);

        let conversation: IConversation | undefined = undefined;
        for (const page of newData.pages) {
          for (const item of page.items) {
            if (item.id === conversationId) {
              conversation = item;
              break;
            }
          }
        }

        if (!conversation) return newData;

        conversation.latestMessage?.messageUserInfos.push(msgUserInfo);
        return newData;
      },
    );
  };

  const afterReceivedMsg = (newMessage: IMessage) => {
    queryClient.setQueryData<InfiniteData<IGetListConversationRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const newData = structuredClone(oldData);

        let conversation: IConversation | undefined = undefined;
        for (const page of newData.pages) {
          for (const item of page.items) {
            if (item.id === newMessage.conversationId) {
              conversation = item;
              break;
            }
          }
        }

        if (!conversation) return newData;

        conversation.latestMessage = newMessage;
        return newData;
      },
    );
  };

  return {
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        getListConversation({ ...params, page: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
    }),
    queryKey,
    afterReadLatestMsg,
    afterReceivedMsg,
  };
};
