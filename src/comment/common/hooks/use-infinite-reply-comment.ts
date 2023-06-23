import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { CommentReactionType } from 'shared';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { IGetListReplyCommentReq } from '../interfaces/req/comment.req.interface';
import {
  ICreateCommentRes,
  IGetListReplyCommentRes,
  IReactCommentRes,
} from '../interfaces/res/comment.res.interface';
import { ICommentReaction } from '../models/comment-reaction.model';
import { IComment } from '../models/comment.model';
import { getListReplyComment } from '../services/comment.service';

export function genInfiniteReplyCommentQueryKey(
  params: IGetListReplyCommentReq,
) {
  const queryKey = [QUERY_KEYS.INFINITE_COMMENT, JSON.stringify(params)];
  return queryKey;
}

export const useInfiniteReplyComment = (params: IGetListReplyCommentReq) => {
  const queryClient = useQueryClient();
  const queryKey = genInfiniteReplyCommentQueryKey(params);

  const afterReactComment = (
    data: IReactCommentRes,
    comment: IComment,
    oldReaction: ICommentReaction,
  ) => {
    queryClient.setQueryData<InfiniteData<IGetListReplyCommentRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const newData = structuredClone(oldData);
        for (const page of newData.pages) {
          for (const item of page.items) {
            if (item.id !== data.commentId) continue;

            if (oldReaction) {
              item.totalCount -= 1;
              switch (oldReaction.type) {
                case CommentReactionType.ANGRY:
                  item.angryCount -= 1;
                  break;
                case CommentReactionType.LIKE:
                  item.likeCount -= 1;
                  break;
                case CommentReactionType.LOVE:
                  item.loveCount -= 1;
                  break;
              }
            }
            switch (data.type) {
              case CommentReactionType.ANGRY:
                item.angryCount += 1;
                break;
              case CommentReactionType.LIKE:
                item.likeCount += 1;
                break;
              case CommentReactionType.LOVE:
                item.loveCount += 1;
                break;
            }

            item.totalCount += 1;
            item.myReaction = data;
            return newData;
          }
        }
      },
    );
  };

  const afterDeleteReactComment = (
    oldReaction: ICommentReaction,
    comment: IComment,
  ) => {
    queryClient.setQueryData<InfiniteData<IGetListReplyCommentRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const newData = structuredClone(oldData);
        for (const page of newData.pages) {
          for (const item of page.items) {
            if (item.id !== oldReaction.commentId) continue;

            switch (oldReaction.type) {
              case CommentReactionType.ANGRY:
                item.angryCount -= 1;
                break;
              case CommentReactionType.LIKE:
                item.likeCount -= 1;
                break;
              case CommentReactionType.LOVE:
                item.loveCount -= 1;
                break;
            }
            item.totalCount -= 1;
            item.myReaction = null as any;
            return newData;
          }
        }
      },
    );
  };

  const afterCreateComment = (res: ICreateCommentRes) => {
    queryClient.setQueryData<InfiniteData<IGetListReplyCommentRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages) return oldData;

        const newData = structuredClone(oldData);
        newData.pages[newData.pages.length - 1].items.push(res);

        return newData;
      },
    );
  };

  const afterUpdateComment = (res: ICreateCommentRes) => {
    queryClient.invalidateQueries(queryKey);
  };

  const afterDeleteComment = (res: ICreateCommentRes) => {
    queryClient.invalidateQueries(queryKey);
  };

  return {
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        getListReplyComment({ ...params, page: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
    }),
    afterReactComment,
    afterDeleteReactComment,
    afterCreateComment,
    afterUpdateComment,
    afterDeleteComment,
  };
};
