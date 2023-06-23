import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { getConversationByUser } from '../services/conversation.service';

export function genGetConversationByUserQueryKey(userId: number) {
  const queryKey = [QUERY_KEYS.CONVERSATION_BY_USER, userId];

  return queryKey;
}

export const useGetConversationByUser = (userId: number, enabled: boolean) => {
  const queryKey = genGetConversationByUserQueryKey(userId);

  return {
    ...useQuery({
      queryKey,
      queryFn: () => getConversationByUser(userId, {}),
      enabled,
    }),
  };
};
