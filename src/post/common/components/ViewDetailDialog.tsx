import { CustomDialog } from '../../../common/components/utils/CustomDialog';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  setViewPost,
  viewPostSelector,
} from '../../../redux/slices/post.slice';
import { PostCard, PostCardProps } from './PostCard';

export type ViewPostDialogProps = {} & Pick<
  PostCardProps,
  | 'afterCreateComment'
  | 'afterDeleteReactPost'
  | 'afterReactComment'
  | 'afterReactPost'
  | 'afterDeleteReactComment'
  | 'afterDeletePost'
  | 'afterDeleteComment'
  | 'afterUpdateComment'
>;

export const ViewPostDialog = ({
  afterReactPost,
  afterReactComment,
  afterCreateComment,
  afterDeleteReactPost,
  afterDeleteReactComment,
  afterDeletePost,
  afterDeleteComment,
  afterUpdateComment,
}: ViewPostDialogProps) => {
  const dispatch = useAppDispatch();
  const { isShow, post } = useAppSelector(viewPostSelector);

  const title = `${post?.user?.profile?.name}'s post`;

  return post ? (
    <CustomDialog
      title={title}
      open={isShow}
      onClose={() => dispatch(setViewPost({ isShow: false }))}
      PaperProps={{
        sx: {
          backgroundColor: 'darkAccent.main',
          color: 'white',
          width: '100%',
          maxWidth: '700px',
        },
      }}
    >
      {isShow && post && (
        <PostCard
          post={post}
          isModal
          afterReactPost={afterReactPost}
          afterReactComment={afterReactComment}
          afterCreateComment={afterCreateComment}
          afterDeleteReactPost={afterDeleteReactPost}
          afterDeleteReactComment={afterDeleteReactComment}
          afterDeletePost={afterDeletePost}
          afterDeleteComment={afterDeleteComment}
          afterUpdateComment={afterUpdateComment}
        />
      )}
    </CustomDialog>
  ) : (
    <></>
  );
};
