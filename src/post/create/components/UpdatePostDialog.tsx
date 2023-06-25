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
  addImageUpdatePost,
  removeImageUpdatePost,
  setUpdatePost,
  setViewPostData,
  updatePostSelector,
} from '../../../redux/slices/post.slice';
import { useUpdatePost } from '../../common/hooks/use-update-post';
import { IUpdatePostRes } from '../../common/interfaces/res/post.res.interface';
import { ISavePostForm, savePostSchema } from '../schemas/save-post.schema';
import SavePostForm from './SavePostForm';

export type UpdatePostDialogProps = {
  afterUpdatePost: (data: IUpdatePostRes) => any;
};

export default function UpdatePostDialog({
  afterUpdatePost,
}: UpdatePostDialogProps) {
  const dispatch = useAppDispatch();
  const updatePostData = useAppSelector(updatePostSelector);
  const [isUpdating, setIsUpdating] = useState(false);
  const methods = useForm<ISavePostForm>({
    defaultValues: updatePostData.data,
    resolver: yupResolver(savePostSchema),
  });
  const { reset, getValues } = methods;
  const { mutate, isLoading } = useUpdatePost({
    onSuccess(data, variables, context) {
      addSnackBar({ variant: 'success', message: 'Post updated' });
      afterUpdatePost(data);
      dispatch(setUpdatePost({ isShow: false }));
      dispatch(setViewPostData(data));
    },
    onError(error, variables, context) {
      addSnackBar({ variant: 'error', message: 'Update post failed' });
    },
  });

  const handleAddImage = (url: string) => {
    dispatch(addImageUpdatePost(url));
  };
  const handleRemoveImage = (url: string) => {
    dispatch(removeImageUpdatePost(url));
  };
  const onCloseDialog = () => {
    dispatch(setUpdatePost({ isShow: false }));
  };
  const handleUpdatePost = async (formData: ISavePostForm) => {
    if (isUpdating) return;

    if (!updatePostData.data || !updatePostData.id) return;

    setIsUpdating(true);
    const postImages = updatePostData.data.images;

    const fileIds = await Promise.all(
      postImages.map(async (item) => {
        if (item.id) return item.id;

        const result = await uploadFile(
          formData.audienceType,
          item.url,
          FileType.png,
        );
        return result.id;
      }),
    );

    mutate({ ...formData, id: updatePostData.id, fileIds });
  };

  useEffect(() => {
    setIsUpdating(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!updatePostData.data) return;
    reset({
      audienceType: updatePostData.data.audienceType,
      content: updatePostData.data.content,
    });
  }, [updatePostData.data]);

  return (
    <CustomDialog
      open={updatePostData.isShow}
      onClose={onCloseDialog}
      title="Edit Post"
      sx={{ marginTop: headerHeight }}
      PaperProps={{
        sx: {
          backgroundColor: 'darkAccent.main',
          color: 'white',
          width: '100%',
          maxWidth: '700px',
        },
      }}
    >
      {updatePostData.data && (
        <SavePostForm
          isSaving={isUpdating}
          onSave={handleUpdatePost}
          methods={methods}
          isCreate={false}
          data={updatePostData.data}
          addImage={handleAddImage}
          removeImage={handleRemoveImage}
        />
      )}
    </CustomDialog>
  );
}
