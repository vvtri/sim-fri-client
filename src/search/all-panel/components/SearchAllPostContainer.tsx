import { Stack } from '@mui/material';
import { useRef } from 'react';
import { PostCard } from '../../../post/common/components/PostCard';
import { ViewPostDialog } from '../../../post/common/components/ViewDetailDialog';
import { useInfinitePost } from '../../../post/common/hooks/use-infinite-post';
import UpdatePostDialog from '../../../post/create/components/UpdatePostDialog';
import { useAppSelector } from '../../../redux/hook';
import { searchTextSelector } from '../../../redux/slices/search.slice';

type SearchAllPostContainerProps = {};

export const SearchAllPostContainer = ({}: SearchAllPostContainerProps) => {
  const searchText = useAppSelector(searchTextSelector);

  const postContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
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
    limit: 6,
  });

  const posts = data?.pages.flatMap((item) => item.items) || [];

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
