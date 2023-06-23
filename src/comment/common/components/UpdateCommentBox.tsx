import { Stack, StackProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { AudienceType, FileType } from 'shared';
import { useAuth } from '../../../common/hooks/use-auth';
import { uploadFile } from '../../../file/common/utils/upload-file.util';
import { useUpdateComment } from '../hooks/use-update-comment';
import { IUpdateCommentReq } from '../interfaces/req/comment.req.interface';
import { IUpdateCommentRes } from '../interfaces/res/comment.res.interface';
import { IComment } from '../models/comment.model';
import { SaveCommentForm, SaveCommentParams } from './SaveCommentForm';

export type UpdateCommentBoxProps = {
  afterUpdateComment: (data: IUpdateCommentRes) => any;
  stackProps?: StackProps;
  comment: IComment;
};

export const UpdateCommentBox = ({
  comment,
  afterUpdateComment,
  stackProps,
}: UpdateCommentBoxProps) => {
  const { avatarUrl } = useAuth();
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const { mutateAsync, isLoading } = useUpdateComment();

  const handleUpdateComment = async (data: SaveCommentParams) => {
    if (isUpdatingComment) return;
    setIsUpdatingComment(true);

    const files = await Promise.all(
      data.files.map(async (item) => {
        if (item.id) return item;
        return await uploadFile(AudienceType.PUBLIC, item.url, FileType.png);
      }),
    );

    const reqData: IUpdateCommentReq = {
      ...data,
      fileIds: files.map((item) => item.id) as number[],
      id: comment.id,
    };

    const res = await mutateAsync(reqData);
    afterUpdateComment(res);
  };

  useEffect(() => {
    setIsUpdatingComment(isLoading);
  }, [isLoading]);

  return (
    <Stack direction="row" alignItems="flex-start" width="100%" {...stackProps}>
      <SaveCommentForm
        saveComment={handleUpdateComment}
        isSavingComment={isUpdatingComment}
        comment={comment}
        isActive
      />
    </Stack>
  );
};
