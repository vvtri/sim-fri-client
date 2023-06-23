import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import {
  PostCard,
  PostCardProps,
} from '../../../post/common/components/PostCard';
import { IPost } from '../../../post/common/models/post.model';
import UpdatePostDialog, {
  UpdatePostDialogProps,
} from '../../../post/create/components/UpdatePostDialog';

type ListPostProps = {
  fetchNextPage: () => any;
  isFetching: boolean;
  posts: IPost[];
} & Pick<
  PostCardProps,
  | 'afterCreateComment'
  | 'afterDeleteReactPost'
  | 'afterReactComment'
  | 'afterReactPost'
  | 'afterDeleteReactComment'
  | 'afterDeletePost'
  |'afterDeleteComment'
  |'afterUpdateComment'
> &
  Pick<UpdatePostDialogProps, 'afterUpdatePost'>;

export const ProfileListPost = ({
  afterCreateComment,
  afterDeleteReactPost,
  afterReactComment,
  afterDeleteReactComment,
  afterReactPost,
  afterUpdatePost,
  afterDeletePost,
  afterDeleteComment,afterUpdateComment,
  fetchNextPage,
  isFetching,
  posts,
}: ListPostProps) => {
  const queryClient = useQueryClient();
  const listRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(isFetching);

  useEffect(() => {
    const handleScroll = (e: any) => {
      const elem = listRef.current;
      if (!elem || isFetchingRef.current) return;

      const shouldLoadMore =
        window.scrollY + window.innerHeight + 500 >=
        elem.offsetTop + elem.scrollHeight;

      if (shouldLoadMore) fetchNextPage();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  return (
    <>
      <Stack ref={listRef} spacing="14px">
        {posts.map((post) => (
          <PostCard
            post={post}
            isModal={false}
            key={post.id}
            afterReactPost={afterReactPost}
            afterReactComment={afterReactComment}
            afterCreateComment={afterCreateComment}
            afterDeleteReactPost={afterDeleteReactPost}
            afterDeleteReactComment={afterDeleteReactComment}
            afterDeletePost={afterDeletePost}
            afterDeleteComment={afterDeleteComment}
            afterUpdateComment={afterUpdateComment}
          />
        ))}
      </Stack>
      <UpdatePostDialog afterUpdatePost={afterUpdatePost} />
      {isFetching && <Typography>Is Fetching ...</Typography>}
    </>
  );
};
