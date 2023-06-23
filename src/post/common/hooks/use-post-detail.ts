import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { CommentReactionType, PostReactionType } from 'shared';
import {
  ICreateCommentRes,
  IReactCommentRes,
} from '../../../comment/common/interfaces/res/comment.res.interface';
import { ICommentReaction } from '../../../comment/common/models/comment-reaction.model';
import { IComment } from '../../../comment/common/models/comment.model';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { IDeleteReactPostReq } from '../interfaces/req/post.req.interface';
import {
  IGetPostDetailRes,
  IReactPostRes,
  IUpdatePostRes,
} from '../interfaces/res/post.res.interface';
import { IPostReaction } from '../models/post-reaction.model';
import { getPostDetail } from '../services/post.service';

export function genPostDetailQueryKey(id: number, commentId?: number) {
  const queryKey = [QUERY_KEYS.POST_DETAIL, id, commentId];

  return queryKey;
}

export const usePostDetail = (postId: number, commentId?: number) => {
  const queryKey = genPostDetailQueryKey(postId, commentId);
  const queryClient = useQueryClient();
  const router = useRouter();

  const findCommentInChild = (
    comment: IComment,
    commentId: number,
  ): IComment | null => {
    if (comment.id === commentId) return comment;

    for (const item of comment.children) {
      const result = findCommentInChild(item, commentId);

      if (result) return result;
    }

    return null;
  };

  const afterReactPost = (data: IReactPostRes, myReaction: IPostReaction) => {
    queryClient.setQueryData<IGetPostDetailRes>(queryKey, (oldData) => {
      if (!oldData) return oldData;

      const clonedData = structuredClone(oldData);

      if (myReaction) {
        clonedData.totalCount -= 1;
        switch (myReaction.type) {
          case PostReactionType.ANGRY:
            clonedData.angryCount -= 1;
            break;
          case PostReactionType.LIKE:
            clonedData.likeCount -= 1;
            break;
          case PostReactionType.LOVE:
            clonedData.loveCount -= 1;
            break;
        }
      }
      switch (data.type) {
        case PostReactionType.ANGRY:
          clonedData.angryCount += 1;
          break;
        case PostReactionType.LIKE:
          clonedData.likeCount += 1;
          break;
        case PostReactionType.LOVE:
          clonedData.loveCount += 1;
          break;
      }

      clonedData.totalCount += 1;
      clonedData.myReaction = data;

      return clonedData;
    });
  };

  const afterDeleteReactPost = (
    req: IDeleteReactPostReq,
    reactType: PostReactionType,
  ) => {
    queryClient.setQueryData<IGetPostDetailRes>(queryKey, (oldData) => {
      if (!oldData) return oldData;

      const clonedData = structuredClone(oldData);

      switch (reactType) {
        case PostReactionType.ANGRY:
          clonedData.angryCount -= 1;
          break;
        case PostReactionType.LIKE:
          clonedData.likeCount -= 1;
          break;
        case PostReactionType.LOVE:
          clonedData.loveCount -= 1;
          break;
      }

      clonedData.myReaction = null as any;
      clonedData.totalCount -= 1;

      return clonedData;
    });
  };

  const afterCreateComment = (commentRes: ICreateCommentRes) => {
    queryClient.setQueryData<IGetPostDetailRes>(queryKey, (oldData) => {
      if (!oldData) return;
      const newData = structuredClone(oldData);

      newData.firstComment = commentRes;
      return newData;
    });
  };

  const afterReactComment = (
    data: IReactCommentRes,
    comment: IComment,
    myReaction: ICommentReaction,
  ) => {
    const postData = queryClient.getQueryData<IGetPostDetailRes>(queryKey);

    if (!postData) return;
    if (Number(comment.mpath.split('.')[0]) != postData.firstComment?.id)
      return;

    const newPostData = structuredClone(postData);

    const commentAffected = findCommentInChild(
      newPostData.firstComment,
      comment.id,
    );
    if (!commentAffected) return;

    if (myReaction) {
      commentAffected.totalCount -= 1;
      switch (myReaction.type) {
        case CommentReactionType.ANGRY:
          commentAffected.angryCount -= 1;
          break;
        case CommentReactionType.LIKE:
          commentAffected.likeCount -= 1;
          break;
        case CommentReactionType.LOVE:
          commentAffected.loveCount -= 1;
          break;
      }
    }

    switch (data.type) {
      case CommentReactionType.ANGRY:
        commentAffected.angryCount += 1;
        break;
      case CommentReactionType.LIKE:
        commentAffected.likeCount += 1;
        break;
      case CommentReactionType.LOVE:
        commentAffected.loveCount += 1;
        break;
    }
    commentAffected.totalCount += 1;
    commentAffected.myReaction = data;

    queryClient.setQueryData(queryKey, newPostData);
  };

  const afterDeleteReactComment = (
    oldReaction: ICommentReaction,
    comment: IComment,
  ) => {
    const postData = queryClient.getQueryData<IGetPostDetailRes>(queryKey);

    if (!postData) return;
    if (Number(comment.mpath.split('.')[0]) != postData.firstComment?.id)
      return;

    const newPostData = structuredClone(postData);
    const commentAffected = findCommentInChild(
      newPostData.firstComment,
      comment.id,
    );

    if (!commentAffected) return;

    switch (oldReaction.type) {
      case CommentReactionType.ANGRY:
        commentAffected.angryCount -= 1;
        break;
      case CommentReactionType.LIKE:
        commentAffected.likeCount -= 1;
        break;
      case CommentReactionType.LOVE:
        commentAffected.loveCount -= 1;
        break;
    }
    commentAffected.totalCount -= 1;
    commentAffected.myReaction = null as any;

    queryClient.setQueryData(queryKey, newPostData);
  };

  const afterUpdatePost = (data: IUpdatePostRes) => {
    queryClient.setQueryData(queryKey, data);
  };

  const afterDeletePost = () => {
    router.push('/');
  };

  const afterUpdateComment = (commentRes: ICreateCommentRes) => {
    queryClient.setQueryData<IGetPostDetailRes>(queryKey, (oldData) => {
      if (!oldData || oldData.firstComment?.id !== commentRes.id) return;
      const newData = structuredClone(oldData);

      newData.firstComment = { ...newData.firstComment, ...commentRes };
      return newData;
    });
  };

  const afterDeleteComment = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return {
    ...useQuery({
      queryKey,
      queryFn: () =>
        getPostDetail(postId, {
          ...(commentId && { commentId: commentId }),
        }),
    }),
    afterDeleteReactPost,
    afterReactPost,
    afterReactComment,
    afterDeleteReactComment,
    afterDeletePost,
    afterUpdatePost,
    afterCreateComment,
    afterUpdateComment,
    afterDeleteComment,
  };
};
