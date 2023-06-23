import { Box, Typography } from '@mui/material';
import { NextPageContext } from 'next';
import { Center } from '../../../common/components/utils/Center';
import { headerHeight } from '../../../common/constants/index.constant';
import { flattenTree } from '../../../common/utils/index.util';
import { PostCard } from '../../../post/common/components/PostCard';
import { ViewPostDialog } from '../../../post/common/components/ViewDetailDialog';
import { usePostDetail } from '../../../post/common/hooks/use-post-detail';
import UpdatePostDialog from '../../../post/create/components/UpdatePostDialog';

type PostDetailProps = {
  postId: number;
  commentId: number;
};

export default function PostDetail({ commentId, postId }: PostDetailProps) {
  const {
    data,
    isLoading,
    afterCreateComment,
    afterDeleteReactComment,
    afterDeleteReactPost,
    afterReactComment,
    afterReactPost,
    afterDeletePost,
    afterUpdatePost,
    afterDeleteComment,
    afterUpdateComment,
  } = usePostDetail(postId, commentId);

  let commentIds: number[] = [];

  if (commentId && data?.firstComment) {
    const comments = flattenTree(data?.firstComment, 'children');
    commentIds = comments.map((item) => item.id);
  }

  return (
    <Center
      width="100%"
      minHeight={`calc(100vh - ${headerHeight})`}
      alignItems="flex-start"
      py="20px"
    >
      <Box width="100%" maxWidth="700px">
        {data ? (
          <PostCard
            post={data}
            afterCreateComment={afterCreateComment}
            afterDeleteReactComment={afterDeleteReactComment}
            afterDeleteReactPost={afterDeleteReactPost}
            afterReactComment={afterReactComment}
            afterReactPost={afterReactPost}
            emphasizedCommentIds={commentIds}
            afterDeletePost={afterDeletePost}
            afterDeleteComment={afterDeleteComment}
            afterUpdateComment={afterUpdateComment}
          />
        ) : (
          <Typography>Is Loading</Typography>
        )}
      </Box>

      <UpdatePostDialog afterUpdatePost={afterUpdatePost} />
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
    </Center>
  );
}

PostDetail.getInitialProps = (ctx: NextPageContext): PostDetailProps => {
  const postId = ctx.query.postId as string;
  const commentId = ctx.query.commentId as string;

  return { postId: Number(postId), commentId: Number(commentId) };
};
