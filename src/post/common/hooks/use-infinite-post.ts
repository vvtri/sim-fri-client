import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { CommentReactionType, PostReactionType } from 'shared';
import {
  ICreateCommentRes,
  IReactCommentRes,
  IUpdateCommentRes,
} from '../../../comment/common/interfaces/res/comment.res.interface';
import { ICommentReaction } from '../../../comment/common/models/comment-reaction.model';
import { IComment } from '../../../comment/common/models/comment.model';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import {
  IDeleteReactPostReq,
  IGetListPostsReq,
} from '../interfaces/req/post.req.interface';
import {
  ICreatePostRes,
  IGetListPostsRes,
  IReactPostRes,
  IUpdatePostRes,
} from '../interfaces/res/post.res.interface';
import { IPostReaction } from '../models/post-reaction.model';
import { getListPosts } from '../services/post.service';

export function genInfinitePostQueryKey(params: IGetListPostsReq) {
  const queryKey = [QUERY_KEYS.INFINITE_POSTS, params];

  return queryKey;
}

export const useInfinitePost = (params: IGetListPostsReq) => {
  const queryKey = genInfinitePostQueryKey(params);
  const queryClient = useQueryClient();

  const afterCreatePost = (data: ICreatePostRes) => {
    queryClient.setQueryData<InfiniteData<IGetListPostsRes>>(
      queryKey,
      (oldData) => {
        const newData = structuredClone(oldData);
        if (!newData) return;

        if (newData?.pages?.[0]?.items?.length) {
          newData.pages[0].items.unshift(data);
        } else {
          newData.pages[0].items = [data];
        }

        return newData;
      },
    );
  };

  const afterUpdatePost = (res: IUpdatePostRes) => {
    queryClient.setQueryData<InfiniteData<IGetListPostsRes>>(
      queryKey,
      (oldData) => {
        const newData = structuredClone(oldData);
        if (!newData) return;

        newData.pages.some((page, pageIdx) =>
          page.items.some((item, itemIdx) => {
            if (item.id !== res.id) return false;

            newData.pages[pageIdx].items[itemIdx] = res;
            return true;
          }),
        );

        return newData;
      },
    );
  };

  const afterDeletePost = (postId: number) => {
    queryClient.setQueryData<InfiniteData<IGetListPostsRes>>(
      queryKey,
      (oldData) => {
        const newData = structuredClone(oldData);
        if (!newData) return;

        newData.pages.some((page, pageIdx) =>
          page.items.some((item, itemIdx) => {
            if (item.id !== postId) return false;

            newData.pages[pageIdx].items.splice(itemIdx, 1);
            return true;
          }),
        );

        return newData;
      },
    );
  };

  const afterReactPost = (data: IReactPostRes, myReaction: IPostReaction) => {
    queryClient.setQueryData<InfiniteData<IGetListPostsRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages) return oldData;

        const clonedData = structuredClone(oldData);

        for (const page of clonedData.pages) {
          for (const item of page.items) {
            if (item.id !== data.postId) continue;

            if (myReaction) {
              item.totalCount -= 1;
              switch (myReaction.type) {
                case PostReactionType.ANGRY:
                  item.angryCount -= 1;
                  break;
                case PostReactionType.LIKE:
                  item.likeCount -= 1;
                  break;
                case PostReactionType.LOVE:
                  item.loveCount -= 1;
                  break;
              }
            }
            switch (data.type) {
              case PostReactionType.ANGRY:
                item.angryCount += 1;
                break;
              case PostReactionType.LIKE:
                item.likeCount += 1;
                break;
              case PostReactionType.LOVE:
                item.loveCount += 1;
                break;
            }

            item.totalCount += 1;
            item.myReaction = data;

            break;
          }
        }

        return clonedData;
      },
    );
  };

  const afterDeleteReactPost = (
    req: IDeleteReactPostReq,
    reactType: PostReactionType,
  ) => {
    queryClient.setQueryData<InfiniteData<IGetListPostsRes>>(
      queryKey,
      (oldData) => {
        if (!oldData?.pages) return oldData;

        const clonedData = structuredClone(oldData);

        for (const page of clonedData.pages) {
          for (const item of page.items) {
            if (item.id !== req.postId) continue;

            switch (reactType) {
              case PostReactionType.ANGRY:
                item.angryCount -= 1;
                break;
              case PostReactionType.LIKE:
                item.likeCount -= 1;
                break;
              case PostReactionType.LOVE:
                item.loveCount -= 1;
                break;
            }

            item.myReaction = null as any;
            item.totalCount -= 1;
            break;
          }
        }

        return clonedData;
      },
    );
  };

  const afterCreateComment = (commentRes: ICreateCommentRes) => {
    const postData =
      queryClient.getQueryData<InfiniteData<IGetListPostsRes>>(queryKey);
    if (!postData?.pages.length) return;

    let newPostData;

    postData.pages.some((page, pageIdx) => {
      page.items.some((item, itemIdx) => {
        if (item.id !== commentRes.postId) return false;

        newPostData = structuredClone(postData);
        const newPostItem = newPostData.pages[pageIdx].items[itemIdx];
        newPostItem.firstComment = commentRes;
        newPostItem.totalCommentCount += 1;
        newPostItem.totalDirectCommentCount += 1;

        queryClient.setQueryData(queryKey, newPostData);

        return true;
      });
    });
  };

  const afterReactComment = (
    data: IReactCommentRes,
    comment: IComment,
    myReaction: ICommentReaction,
  ) => {
    const postData =
      queryClient.getQueryData<InfiniteData<IGetListPostsRes>>(queryKey);
    if (!postData?.pages.length) return;

    let newPostData;

    postData.pages.some((page, pageIdx) => {
      page.items.some((item, itemIdx) => {
        if (item.firstComment?.id !== comment.id) return false;

        newPostData = structuredClone(postData);
        const firstComment =
          newPostData.pages[pageIdx].items[itemIdx].firstComment;

        if (myReaction) {
          firstComment.totalCount -= 1;
          switch (myReaction.type) {
            case CommentReactionType.ANGRY:
              firstComment.angryCount -= 1;
              break;
            case CommentReactionType.LIKE:
              firstComment.likeCount -= 1;
              break;
            case CommentReactionType.LOVE:
              firstComment.loveCount -= 1;
              break;
          }
        }

        switch (data.type) {
          case CommentReactionType.ANGRY:
            firstComment.angryCount += 1;
            break;
          case CommentReactionType.LIKE:
            firstComment.likeCount += 1;
            break;
          case CommentReactionType.LOVE:
            firstComment.loveCount += 1;
            break;
        }
        firstComment.totalCount += 1;
        firstComment.myReaction = data;

        queryClient.setQueryData(queryKey, newPostData);

        return true;
      });
    });
  };

  const afterDeleteReactComment = (
    oldReaction: ICommentReaction,
    comment: IComment,
  ) => {
    const postData =
      queryClient.getQueryData<InfiniteData<IGetListPostsRes>>(queryKey);
    if (!postData?.pages.length) return;

    let newPostData;

    postData.pages.some((page, pageIdx) => {
      page.items.some((item, itemIdx) => {
        if (item.firstComment?.id !== comment.id) return false;

        newPostData = structuredClone(postData);
        const firstComment =
          newPostData.pages[pageIdx].items[itemIdx].firstComment;

        switch (oldReaction.type) {
          case CommentReactionType.ANGRY:
            firstComment.angryCount -= 1;
            break;
          case CommentReactionType.LIKE:
            firstComment.likeCount -= 1;
            break;
          case CommentReactionType.LOVE:
            firstComment.loveCount -= 1;
            break;
        }
        firstComment.totalCount -= 1;
        firstComment.myReaction = null as any;

        queryClient.setQueryData(queryKey, newPostData);

        return true;
      });
    });
  };

  const afterUpdateComment = (res: IUpdateCommentRes) => {
    const postData =
      queryClient.getQueryData<InfiniteData<IGetListPostsRes>>(queryKey);
    if (!postData?.pages.length) return;

    let newPostData;

    postData.pages.some((page, pageIdx) => {
      page.items.some((item, itemIdx) => {
        if (item.firstComment?.id !== res.id) return false;

        newPostData = structuredClone(postData);
        const newPostItem = newPostData.pages[pageIdx].items[itemIdx];
        newPostItem.firstComment = { ...newPostItem.firstComment, ...res };

        queryClient.setQueryData(queryKey, newPostData);

        return true;
      });
    });
  };

  const afterDeleteComment = (comment: IComment) => {
    const data =
      queryClient.getQueryData<InfiniteData<IGetListPostsRes>>(queryKey);

    if (!data?.pages) return;

    data.pages.some((page, pageIdx) =>
      page.items.some((item) => {
        if (item.firstComment?.id !== comment.id) return false;

        queryClient.invalidateQueries(queryKey, {
          refetchPage: (lastPage, index, allPages) => index === pageIdx,
        });
        return true;
      }),
    );
  };

  return {
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getListPosts({ ...params, page: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = lastPage.meta.currentPage;
        const totalPages = lastPage.meta.totalPages || 0;

        return currentPage >= totalPages ? undefined : currentPage + 1;
      },
    }),
    afterDeleteReactPost,
    afterReactPost,
    afterReactComment,
    afterCreateComment,
    afterCreatePost,
    afterUpdatePost,
    afterDeletePost,
    afterDeleteReactComment,
    afterUpdateComment,
    afterDeleteComment,
  };
};
