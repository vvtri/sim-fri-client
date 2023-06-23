import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { CommentReactionType } from 'shared';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { IGetListCommentReq } from '../interfaces/req/comment.req.interface';
import {
  ICreateCommentRes,
  IGetListCommentRes,
  IReactCommentRes,
} from '../interfaces/res/comment.res.interface';
import { ICommentReaction } from '../models/comment-reaction.model';
import { IComment } from '../models/comment.model';
import { getListComment } from '../services/comment.service';

export function genInfiniteCommentQueryKey(params: IGetListCommentReq) {
  const queryKey = [QUERY_KEYS.INFINITE_COMMENT, JSON.stringify(params)];
  return queryKey;
}

export const useInfiniteComment = (
  params: IGetListCommentReq,
  enabled: boolean,
) => {
  const queryClient = useQueryClient();
  const queryKey = genInfiniteCommentQueryKey(params);

  const afterCreateComment = (data: ICreateCommentRes) => {
    queryClient.setQueryData<InfiniteData<IGetListCommentRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const newData = structuredClone(oldData);
        newData.pages[0].items.unshift(data);

        return newData;
      },
    );
  };

  const afterReactComment = (
    data: IReactCommentRes,
    comment: IComment,
    myReaction: ICommentReaction,
  ) => {
    queryClient.setQueryData<InfiniteData<IGetListCommentRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const newData = structuredClone(oldData);
        for (const page of newData.pages) {
          for (const item of page.items) {
            if (item.id !== data.commentId) continue;

            if (myReaction) {
              item.totalCount -= 1;
              switch (myReaction.type) {
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
    queryClient.setQueryData<InfiniteData<IGetListCommentRes>>(
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
        getListComment({ ...params, page: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
      enabled,
    }),
    afterCreateComment,
    afterReactComment,
    afterDeleteReactComment,
    afterUpdateComment,
    afterDeleteComment,
  };
};
