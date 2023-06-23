import { SubdirectoryArrowRight } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommentReactionType } from 'shared';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { genDisplayDateByTimeDiff } from '../../../common/utils/index.util';
import { PostReactionPopover } from '../../../post/common/components/PostReactionPopover';
import { useDeleteReactComment } from '../hooks/use-delete-react-comment';
import { useInfiniteReplyComment } from '../hooks/use-infinite-reply-comment';
import { useReactComment } from '../hooks/use-react-comment';
import {
  ICreateCommentRes,
  IReactCommentRes,
  IUpdateCommentRes,
} from '../interfaces/res/comment.res.interface';
import { ICommentReaction } from '../models/comment-reaction.model';
import { IComment } from '../models/comment.model';
import { CommentBoxContent } from './CommentBoxContent';
import { CreateCommentBox } from './CreateCommentBox';
import { UpdateCommentBox } from './UpdateCommentBox';

const mapReaction = (reaction: ICommentReaction) => {
  let text: string = '';
  let color: string = '';

  switch (reaction?.type) {
    case CommentReactionType.LIKE:
      text = 'Like';
      color = 'primary.main';
      break;
    case CommentReactionType.LOVE:
      text = 'Love';
      color = 'rgb(243, 62, 88)';
      break;
    case CommentReactionType.ANGRY:
      text = 'Angry';
      color = 'rgb(233, 113, 15)';
      break;
    default:
      text = 'Like';
      color = 'inherit';
  }

  return { text, color };
};

export type CommentBoxProps = {
  comment: IComment;
  isShowCreateReply?: boolean;
  isShowReplyComment?: boolean;
  emphasizedCommentIds?: number[];
  afterReactComment: (
    data: IReactCommentRes,
    comment: IComment,
    myReaction: ICommentReaction,
  ) => any;
  afterDeleteReactComment: (
    oldComment: ICommentReaction,
    comment: IComment,
  ) => any;
  afterUpdateComment: (res: IUpdateCommentRes) => any;
  afterDeleteComment: (data: IComment) => any;
};

export const CommentBox = ({
  comment,
  emphasizedCommentIds,
  isShowCreateReply: isShowCreateReplyProps,
  isShowReplyComment: isShowReplyCmtProps,
  afterReactComment: parentAfterReactComment,
  afterDeleteReactComment: parentAfterDeleteReactComment,
  afterDeleteComment: parentAfterDeleteComment,
  afterUpdateComment: parentAfterUpdateComment,
}: CommentBoxProps) => {
  const { user, createdAt, commentFiles, childCount, myReaction, children } =
    comment;
  const [isEditing, setIsEditing] = useState(false);
  const [isShowReplyComment, setIsShowReplyComment] = useState(false);
  const [isShowCreateReply, setIsShowCreateReply] = useState(
    isShowCreateReplyProps,
  );
  const avtUrl = user.profile.avatar?.url || emptyAvatarUrl;
  const [isShowReaction, setIsShowReaction] = useState(false);
  const queryParams = { parentId: comment.id };
  const {
    data: replyCommentsData,
    isLoading: isLoadingReplyData,
    afterReactComment: afterReactCommentInfiniteReplyComment,
    afterDeleteReactComment: afterDeleteReactCommentInfiniteReplyComment,
    afterUpdateComment: afterUpdateCommentInfiniteReplyComment,
    afterCreateComment: afterCreateCommentInfiniteReplyComment,
    afterDeleteComment: afterDeleteCommentInfiniteComment,
  } = useInfiniteReplyComment(queryParams);
  const { mutate: reactComment, isLoading: isReactComment } = useReactComment({
    onSuccess(data, variables, context) {
      afterReactComment(data, comment, comment.myReaction);
    },
    onError(error, variables, context) {
      console.log('error', error);
    },
  });
  const { mutate: deleteReactComment, isLoading: isDeletingReactComment } =
    useDeleteReactComment({
      onSuccess(data, variables, context) {
        afterDeleteReactComment(comment.myReaction, comment);
      },
      onError(error, variables, context) {},
    });

  const { color, text } = mapReaction(myReaction);

  let replyComments =
    replyCommentsData?.pages.flatMap((item) => item.items) || [];

  if (children) {
    replyComments = replyComments.filter((item) =>
      children.some((item2) => item2.id !== item.id),
    );

    replyComments.unshift(...children);
  }

  const afterCreateComment = (data: ICreateCommentRes) => {
    afterCreateCommentInfiniteReplyComment(data);
    setIsShowCreateReply(false);
    setIsShowReplyComment(true);
  };

  const afterUpdateComment = (data: ICreateCommentRes) => {
    parentAfterUpdateComment(data);
    afterUpdateCommentInfiniteReplyComment(data);
    setIsEditing(false);
  };

  const afterDeleteComment = (data: IComment) => {
    parentAfterDeleteComment(data);
    afterDeleteCommentInfiniteComment(data);
  };

  const afterReactComment = (
    data: IReactCommentRes,
    comment: IComment,
    myReaction: ICommentReaction,
  ) => {
    parentAfterReactComment(data, comment, myReaction);
    afterReactCommentInfiniteReplyComment(data, comment, myReaction);
  };

  const afterDeleteReactComment = (
    oldReaction: ICommentReaction,
    comment: IComment,
  ) => {
    parentAfterDeleteReactComment(oldReaction, comment);
    afterDeleteReactCommentInfiniteReplyComment(oldReaction, comment);
  };

  const handleViewMoreComment = () => {
    setIsShowReplyComment(true);
    setIsShowCreateReply(false);
  };

  const handleReactComment = (type: CommentReactionType) => {
    reactComment({ commentId: comment.id, type });
  };

  const handleDeleteReactComment = () => {
    deleteReactComment({ commentId: comment.id });
  };

  const handleClickReaction = () => {
    if (myReaction) handleDeleteReactComment();
    else handleReactComment(CommentReactionType.LIKE);
  };

  const handleClickReply = () => {
    setIsShowCreateReply((old) => !old);
  };

  const handleEditComment = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const emphasizedIdx = emphasizedCommentIds?.findIndex(
      (item) => item === comment.id,
    );
    setIsShowReplyComment(Number(emphasizedIdx) >= 1);
  }, [emphasizedCommentIds]);

  return (
    <Stack direction="row" alignItems="flex-start" color="primaryText.main">
      <Link href={`/profile/${user.id}`}>
        <Avatar
          src={avtUrl}
          sx={{ width: 32, height: 32, flexShrink: 0, mt: '2px', mr: '6px' }}
        />
      </Link>

      <Stack width="100%">
        {isEditing ? (
          <>
            <UpdateCommentBox
              afterUpdateComment={afterUpdateComment}
              comment={comment}
            />
            <Typography
              fontSize="0.8125rem"
              color="primary.main"
              onClick={() => setIsEditing(false)}
              ml="15px"
              sx={{
                cursor: 'pointer',
                ':hover': { textDecoration: 'underline' },
              }}
            >
              Cancel
            </Typography>
          </>
        ) : (
          <>
            {/* content + name section */}
            <CommentBoxContent
              handleEditComment={handleEditComment}
              comment={comment}
              emphasizedCommentIds={emphasizedCommentIds}
              afterDeleteComment={afterDeleteComment}
            />

            {/* image section */}
            <Box
              display="flex"
              width="100%"
              gap="10px"
              flexWrap="wrap"
              mt={commentFiles.length && '10px'}
            >
              {commentFiles?.map((item) => (
                <Box
                  key={item.id}
                  position="relative"
                  height="100px"
                  width="fit-content"
                  maxWidth="100%"
                >
                  <Box
                    component="img"
                    src={item.file.url}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* reaction section */}
            <Stack
              direction="row"
              fontSize="0.75rem"
              px="14px"
              spacing="12px"
              mt="6px"
              alignItems="center"
            >
              <Box
                fontWeight="700"
                sx={{
                  cursor: 'pointer',
                  ':hover': { textDecoration: 'underline' },
                  position: 'relative',
                  '::before': {
                    width: '100%',
                    height: '10px',
                    position: 'absolute',
                    content: `""`,
                    bottom: '100%',
                  },
                  color,
                }}
                onMouseEnter={() => setIsShowReaction(true)}
                onMouseLeave={() => setIsShowReaction(false)}
              >
                <Box onClick={handleClickReaction}>{text}</Box>
                <PostReactionPopover
                  isShow={isShowReaction}
                  handleReact={(type) => {
                    handleReactComment(type);
                  }}
                />
              </Box>
              <Typography
                fontWeight="700"
                sx={{
                  cursor: 'pointer',
                  ':hover': { textDecoration: 'underline' },
                }}
                onClick={handleClickReply}
              >
                Reply
              </Typography>
              <Typography sx={{ cursor: 'default' }}>
                {genDisplayDateByTimeDiff(createdAt)}
              </Typography>
            </Stack>
          </>
        )}

        {!!(!isShowReplyComment && childCount) && (
          <Stack
            direction="row"
            alignItems="center"
            ml="14px"
            fontSize="0.9375rem"
            fontWeight="400"
            sx={{ cursor: 'pointer' }}
            onClick={handleViewMoreComment}
            mt="8px"
          >
            <SubdirectoryArrowRight
              sx={{
                width: '18px',
                height: '18px',
              }}
            />
            <Typography>{childCount} reply</Typography>
          </Stack>
        )}

        <Stack spacing="18px" mt={isShowReplyComment ? '8px' : '0'}>
          {isShowReplyComment &&
            replyComments.map((item) => (
              <CommentBox
                emphasizedCommentIds={emphasizedCommentIds}
                comment={item}
                key={item.id}
                afterReactComment={afterReactComment}
                afterDeleteReactComment={afterDeleteReactComment}
                afterUpdateComment={afterUpdateComment}
                afterDeleteComment={afterDeleteComment}
              />
            ))}
        </Stack>

        {isShowCreateReply && (
          <CreateCommentBox
            postId={comment.postId}
            afterCreateComment={afterCreateComment}
            parentId={comment.id}
            stackProps={{ mt: '10px' }}
          />
        )}
      </Stack>
    </Stack>
  );
};
