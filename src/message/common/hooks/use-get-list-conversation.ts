import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { IGetListConversationReq } from '../interfaces/req/conversation.req.interface';
import { getListConversation } from '../services/conversation.service';

export function genGetListConversationQueryKey(
  params?: IGetListConversationReq,
) {
  const queryKey = [QUERY_KEYS.LIST_CONVERSATION, params];

  return queryKey;
}

export const useGetListConversation = (params?: IGetListConversationReq) => {
  const queryKey = genGetListConversationQueryKey(params);

  return {
    ...useQuery({
      queryKey,
      queryFn: () => getListConversation(params || {}),
    }),
  };
};
