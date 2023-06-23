import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { getParentTreeComment } from '../services/comment.service';

export function genParentTreeCommentQueryKey(commentId: number) {
  const queryKey = [QUERY_KEYS.PARENT_TREE_COMMENT, commentId];
  return queryKey;
}

export const useParentTreeComment = (commentId: number, enabled: boolean) => {
  const queryClient = useQueryClient();
  const queryKey = genParentTreeCommentQueryKey(commentId);

  return {
    ...useQuery({
      queryKey,
      queryFn: () => getParentTreeComment(commentId),
      enabled,
    }),
  };
};
