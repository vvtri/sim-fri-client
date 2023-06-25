import { Box, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { PostReactionType } from 'shared';
import {
  ICreateCommentRes,
  IReactCommentRes,
} from '../../../comment/common/interfaces/res/comment.res.interface';
import { ICommentReaction } from '../../../comment/common/models/comment-reaction.model';
import { IComment } from '../../../comment/common/models/comment.model';
import { Center } from '../../../common/components/utils/Center';
import { PostCard } from '../../../post/common/components/PostCard';
import { ViewPostDialog } from '../../../post/common/components/ViewDetailDialog';
import { useInfinitePost } from '../../../post/common/hooks/use-infinite-post';
import { IDeleteReactPostReq } from '../../../post/common/interfaces/req/post.req.interface';
import {
  ICreatePostRes,
  IReactPostRes,
} from '../../../post/common/interfaces/res/post.res.interface';
import { IPostReaction } from '../../../post/common/models/post-reaction.model';
import { CreatePostBox } from '../../../post/create/components/CreatePostBox';
import CreatePostDialog from '../../../post/create/components/CreatePostDialog';
import UpdatePostDialog from '../../../post/create/components/UpdatePostDialog';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  setViewPostData,
  viewPostSelector,
} from '../../../redux/slices/post.slice';

export const HomePostContainer = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const queryKey = {};
  const {
    data,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    afterDeleteReactPost: afterDeleteReactPostInfinitePost,
    afterReactPost: afterReactPostInfinitePost,
    afterCreateComment: afterCreateCommentInfinitePost,
    afterReactComment: afterReactCommentInfinitePost,
    afterCreatePost: afterCreatePostInfinitePost,
    afterDeleteReactComment: afterDeleteReactCommentInfinitePost,
    afterUpdatePost: afterUpdateInfinitePost,
    afterDeletePost: afterDeleteInfinitePost,
    afterDeleteComment: afterDeleteCommentInfinitePost,
    afterUpdateComment: afterUpdateCommentInfinitePost,
  } = useInfinitePost(queryKey);
  const postContainerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(isFetching);
  const { isShow, post } = useAppSelector(viewPostSelector);

  const posts = data?.pages.flatMap((item) => item.items) || [];

  const afterReactPost = (data: IReactPostRes, myReaction: IPostReaction) => {
    afterReactPostInfinitePost(data, myReaction);
  };

  const afterDeleteReactPost = (
    req: IDeleteReactPostReq,
    reactType: PostReactionType,
  ) => {
    afterDeleteReactPostInfinitePost(req, reactType);

    if (!isShow || post?.id !== req.postId) return;
    dispatch(setViewPostData({ ...post, myReaction: null as any }));
  };

  const afterReactComment = (
    data: IReactCommentRes,
    comment: IComment,
    myReaction: ICommentReaction,
  ) => {
    afterReactCommentInfinitePost(data, comment, myReaction);
  };

  const afterCreatePost = (data: ICreatePostRes) => {
    afterCreatePostInfinitePost(data);
  };

  const afterCreateComment = (data: ICreateCommentRes) => {
    afterCreateCommentInfinitePost(data);
  };

  const afterDeleteReactComment = (
    oldReaction: ICommentReaction,
    comment: IComment,
  ) => {
    afterDeleteReactCommentInfinitePost(oldReaction, comment);
  };

  useEffect(() => {
    const handler = () => {
      const elem = postContainerRef.current;
      if (!elem || isFetchingRef.current) return;

      const isScrollNearEnd =
        window.scrollY + window.innerHeight + 500 >=
        elem.offsetTop + elem.scrollHeight;

      if (isScrollNearEnd) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handler);

    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, []);

  useEffect(() => {
    isFetchingRef.current = isFetching || isFetchingNextPage;
  }, [isFetching, isFetchingNextPage]);

  return (
    <Box maxWidth="600px" mt="20px" flexGrow="1" sx={{ overflowY: 'auto' }}>
      <CreatePostDialog afterCreate={afterCreatePost} />
      <UpdatePostDialog afterUpdatePost={afterUpdateInfinitePost} />
      <ViewPostDialog
        afterCreateComment={afterCreateComment}
        afterReactPost={afterReactPost}
        afterReactComment={afterReactComment}
        afterDeleteReactPost={afterDeleteReactPost}
        afterDeleteReactComment={afterDeleteReactComment}
        afterDeletePost={afterDeleteInfinitePost}
        afterDeleteComment={afterDeleteCommentInfinitePost}
        afterUpdateComment={afterUpdateCommentInfinitePost}
      />

      <Stack spacing="20px" ref={postContainerRef}>
        <CreatePostBox />

        {posts.map((item) => (
          <PostCard
            key={item.id}
            post={item}
            isModal={false}
            afterReactPost={afterReactPost}
            afterReactComment={afterReactComment}
            afterCreateComment={afterCreateComment}
            afterDeleteReactPost={afterDeleteReactPost}
            afterDeleteReactComment={afterDeleteReactComment}
            afterDeletePost={afterDeleteInfinitePost}
            afterDeleteComment={afterDeleteCommentInfinitePost}
            afterUpdateComment={afterUpdateCommentInfinitePost}
          />
        ))}
      </Stack>

      {!hasNextPage && (
        <Center py="20px">
          <Typography textAlign="center">No more post</Typography>
        </Center>
      )}
    </Box>
  );
};
