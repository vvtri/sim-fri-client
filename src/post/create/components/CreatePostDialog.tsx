import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileType } from 'shared';
import { CustomDialog } from '../../../common/components/utils/CustomDialog';
import { headerHeight } from '../../../common/constants/index.constant';
import { addSnackBar } from '../../../common/utils/snackbar.util';
import { uploadFile } from '../../../file/common/utils/upload-file.util';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  addImageCreatePost,
  createPostSelector,
  initialCreatePostData,
  removeImageCreatePost,
  setCreatePost,
} from '../../../redux/slices/post.slice';
import { useCreatePost } from '../../common/hooks/use-create-post';
import { ICreatePostRes } from '../../common/interfaces/res/post.res.interface';
import { ISavePostForm, savePostSchema } from '../schemas/save-post.schema';
import SavePostForm from './SavePostForm';

type CreatePostDialogProps = {
  afterCreate: (data: ICreatePostRes) => any;
};

export default function CreatePostDialog({
  afterCreate,
}: CreatePostDialogProps) {
  const dispatch = useAppDispatch();
  const createPostData = useAppSelector(createPostSelector);
  const [isCreating, setIsCreating] = useState(false);
  const methods = useForm<ISavePostForm>({
    defaultValues: createPostData.data,
    resolver: yupResolver(savePostSchema),
  });
  const { reset, getValues } = methods;
  const { mutate, isLoading } = useCreatePost({
    onSuccess(data, variables, context) {
      addSnackBar({ variant: 'success', message: 'Post created' });
      reset();
      dispatch(
        setCreatePost({
          ...createPostData,
          isShow: false,
          data: initialCreatePostData,
        }),
      );
      afterCreate(data);
    },
    onError(error, variables, context) {
      addSnackBar({ variant: 'error', message: 'Create post failed' });
    },
  });

  const handleAddImage = (url: string) => {
    dispatch(addImageCreatePost(url));
  };
  const handleRemoveImage = (url: string) => {
    dispatch(removeImageCreatePost(url));
  };
  const onCloseDialog = () => {
    dispatch(
      setCreatePost({
        isShow: false,
        data: {
          ...createPostData.data,
          content: getValues('content'),
          audienceType: getValues('audienceType'),
        },
      }),
    );
  };

  const handleCreatePost = async (formData: ISavePostForm) => {
    if (isCreating) return;

    let fileIds: number[] = [];
    const postImages = createPostData.data.images;

    setIsCreating(true);
    if (postImages.length) {
      const result = await Promise.all(
        postImages.map((item) =>
          uploadFile(formData.audienceType, item.url, FileType.png),
        ),
      );

      fileIds = result.map((item) => item.id);
    }

    mutate({ ...formData, fileIds });
  };

  useEffect(() => {
    setIsCreating(isLoading);
  }, [isLoading]);

  return (
    <CustomDialog
      open={createPostData.isShow}
      onClose={onCloseDialog}
      title="Create Post"
      sx={{ marginTop: headerHeight }}
      PaperProps={{
        sx: {
          backgroundColor: 'darkAccent.main',
          color: 'white',
          width: '100%',
          maxWidth: '500px',
        },
      }}
    >
      <SavePostForm
        isSaving={isCreating}
        onSave={handleCreatePost}
        methods={methods}
        isCreate
        data={createPostData.data}
        addImage={handleAddImage}
        removeImage={handleRemoveImage}
      />
    </CustomDialog>
  );
}
