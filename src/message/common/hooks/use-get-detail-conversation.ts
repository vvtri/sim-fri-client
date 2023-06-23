import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { getDetailConversation } from '../services/conversation.service';

export const useGetDetailConversation = (id: number) => {
  const queryKey = [QUERY_KEYS.DETAIL_CONVERSATION, id];

  return {
    ...useQuery({ queryKey, queryFn: () => getDetailConversation(id) }),
  };
};
