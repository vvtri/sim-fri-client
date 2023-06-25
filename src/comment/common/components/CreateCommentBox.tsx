import { Avatar, Stack, StackProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { AudienceType, FileType } from 'shared';
import { useAuth } from '../../../common/hooks/use-auth';
import { uploadFile } from '../../../file/common/utils/upload-file.util';
import { useCreateComment } from '../hooks/use-create-comment';
import { ICreateCommentReq } from '../interfaces/req/comment.req.interface';
import { ICreateCommentRes } from '../interfaces/res/comment.res.interface';
import { SaveCommentForm, SaveCommentParams } from './SaveCommentForm';

export type CreateCommentBoxProps = {
  postId: number;
  parentId?: number;
  afterCreateComment: (data: ICreateCommentRes) => any;
  stackProps?: StackProps;
};

export const CreateCommentBox = ({
  postId,
  parentId,
  afterCreateComment,
  stackProps,
}: CreateCommentBoxProps) => {
  const { avatarUrl } = useAuth();
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const { mutateAsync, isLoading } = useCreateComment();

  const handleCreateComment = async (data: SaveCommentParams) => {
    if (!data.content) return;

    if (isCreatingComment) return;
    setIsCreatingComment(true);

    const files = await Promise.all(
      data.files.map(async (item) => {
        if (item.id) return item;
        return await uploadFile(AudienceType.PUBLIC, item.url, FileType.png);
      }),
    );

    const reqData: ICreateCommentReq = {
      ...data,
      postId,
      parentId,
      fileIds: files.map((item) => item.id) as number[],
    };

    const res = await mutateAsync(reqData);
    afterCreateComment(res);
  };

  useEffect(() => {
    setIsCreatingComment(isLoading);
  }, [isLoading]);

  return (
    <Stack direction="row" alignItems="flex-start" width="100%" {...stackProps}>
      <Avatar
        src={avatarUrl}
        sx={{ width: 32, height: 32, flexShrink: 0, mt: '2px' }}
      />
      <SaveCommentForm
        saveComment={handleCreateComment}
        isSavingComment={isCreatingComment}
      />
    </Stack>
  );
};
