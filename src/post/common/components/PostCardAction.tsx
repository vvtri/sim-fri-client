import { Delete, Edit } from '@mui/icons-material';
import { Divider, Stack } from '@mui/material';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { CARD_BOX_SHADOW } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { addSnackBar } from '../../../common/utils/snackbar.util';
import { useAppDispatch } from '../../../redux/hook';
import { setUpdatePost } from '../../../redux/slices/post.slice';
import { useDeletePost } from '../hooks/use-delete-post';
import { IPost } from '../models/post.model';
import { PostCardActionItem } from './PostCardActionItem';

export type PostCardActionProps = {
  toggleIconRef: MutableRefObject<HTMLDivElement | null>;
  post: IPost;
  afterDeletePost: (id: number) => any;
};

export const PostCardAction = ({
  toggleIconRef,
  post,
  afterDeletePost,
}: PostCardActionProps) => {
  const dispatch = useAppDispatch();
  const [isShow, setIsShow] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { userProfile } = useAuth();
  const isMyPost = userProfile?.user.id === post.user.id;
  const { mutate: deletePost, isLoading: isDeletingPost } = useDeletePost({
    onSuccess(data, variables, context) {
      afterDeletePost(variables);
      addSnackBar({ variant: 'success', message: 'Delete post succeeded' });
    },
    onError(error, variables, context) {
      console.log('error', error);
      addSnackBar({ variant: 'error', message: 'Delete post failed' });
    },
  });

  const handleEditPost = () => {
    dispatch(
      setUpdatePost({
        isShow: true,
        id: post.id,
        data: {
          audienceType: post.audienceType,
          content: post.content,
          images: post.files,
        },
      }),
    );
  };

  const handleDeletePost = () => {
    if (isDeletingPost) return;

    deletePost(post.id);
  };

  useEffect(() => {
    const handlerTogglePanel = (e: MouseEvent) => {
      const target = e.target as any;

      if (toggleIconRef.current?.contains(target)) {
        return setIsShow((old) => !old);
      }

      if (!panelRef.current?.contains(target)) {
        return setIsShow(false);
      }
    };

    document.addEventListener('click', handlerTogglePanel);

    return () => {
      document.removeEventListener('click', handlerTogglePanel);
    };
  }, []);

  return (
    <Stack
      position="absolute"
      bgcolor="darkAccent.main"
      sx={{
        boxShadow: CARD_BOX_SHADOW,
        overflowY: 'auto',
        top: '100%',
        right: '40%',
        transition: '.2s',
        visibility: isShow && isMyPost ? 'visible' : 'hidden',
        opacity: isShow && isMyPost ? '1' : '0',
      }}
      width="344px"
      height="fit-content"
      zIndex="1"
      borderRadius="10px"
      p="10px"
      color="primaryText.main"
      ref={panelRef}
    >
      
      <PostCardActionItem
        content="Edit post"
        icon={<Edit />}
        onClick={handleEditPost}
      />

      <Divider sx={{ my: '10px' }} />

      <PostCardActionItem
        content="Delete post"
        icon={<Delete />}
        onClick={handleDeletePost}
      />
    </Stack>
  );
};
