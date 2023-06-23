import { Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import { PostCard } from '../../../post/common/components/PostCard';
import { ViewPostDialog } from '../../../post/common/components/ViewDetailDialog';
import { useInfinitePost } from '../../../post/common/hooks/use-infinite-post';
import UpdatePostDialog from '../../../post/create/components/UpdatePostDialog';
import { useAppSelector } from '../../../redux/hook';
import { searchTextSelector } from '../../../redux/slices/search.slice';

type SearchPostContainerProps = {};

export const SearchPostContainer = ({}: SearchPostContainerProps) => {
  const searchText = useAppSelector(searchTextSelector);

  const postContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    afterCreateComment,
    afterDeleteReactComment,
    afterDeleteReactPost,
    afterReactComment,
    afterReactPost,
    afterDeletePost,
    afterUpdatePost,
    afterDeleteComment,
    afterUpdateComment,
  } = useInfinitePost({
    searchText,
    excludeMe: true,
    limit: 20,
  });
  const isFetchingRef = useRef(isFetching || isFetchingNextPage);

  const posts = data?.pages.flatMap((item) => item.items) || [];

  useEffect(() => {
    const handler = (e: any) => {
      const elem = postContainerRef.current;
      if (!elem || isFetchingRef.current) return;

      const shouldLoadMore =
        window.scrollY + window.innerHeight + 500 >=
        elem.offsetTop + elem.scrollHeight;

      if (shouldLoadMore) fetchNextPage();
    };

    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    isFetchingRef.current = isFetching || isFetchingNextPage;
  }, [isFetching, isFetchingNextPage]);

  return (
    <>
      <Stack width="100%" ref={postContainerRef} spacing="20px">
        {posts.map((item) => (
          <PostCard
            key={item.id}
            post={item}
            afterCreateComment={afterCreateComment}
            afterDeleteReactComment={afterDeleteReactComment}
            afterDeleteReactPost={afterDeleteReactPost}
            afterReactComment={afterReactComment}
            afterReactPost={afterReactPost}
            afterDeletePost={afterDeletePost}
            afterDeleteComment={afterDeleteComment}
            afterUpdateComment={afterUpdateComment}
          />
        ))}
      </Stack>

      <ViewPostDialog
        afterCreateComment={afterCreateComment}
        afterDeleteReactComment={afterDeleteReactComment}
        afterDeleteReactPost={afterDeleteReactPost}
        afterReactComment={afterReactComment}
        afterReactPost={afterReactPost}
        afterDeletePost={afterDeletePost}
        afterDeleteComment={afterDeleteComment}
        afterUpdateComment={afterUpdateComment}
      />

      <UpdatePostDialog afterUpdatePost={afterUpdatePost} />
    </>
  );
};
