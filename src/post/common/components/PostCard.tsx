import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { PostReactionType } from 'shared';
import {
  CommentBox,
  CommentBoxProps,
} from '../../../comment/common/components/CommentBox';
import { CreateCommentBox } from '../../../comment/common/components/CreateCommentBox';
import { useInfiniteComment } from '../../../comment/common/hooks/use-infinite-comment';
import {
  ICreateCommentRes,
  IReactCommentRes,
  IUpdateCommentRes,
} from '../../../comment/common/interfaces/res/comment.res.interface';
import { ICommentReaction } from '../../../comment/common/models/comment-reaction.model';
import { IComment } from '../../../comment/common/models/comment.model';
import { CustomImageList } from '../../../common/components/utils/CustomImageList';
import { ReactionCount } from '../../../common/components/utils/ReactionCount';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import {
  genDisplayDateByTimeDiff,
  getAudienceImageLink,
} from '../../../common/utils/index.util';
import { useAppDispatch } from '../../../redux/hook';
import { setViewPost, setViewPostData } from '../../../redux/slices/post.slice';
import { useDeleteReactPost } from '../hooks/use-delete-react-post';
import { useReactPost } from '../hooks/use-react-post';
import { IDeleteReactPostReq } from '../interfaces/req/post.req.interface';
import { IReactPostRes } from '../interfaces/res/post.res.interface';
import { IPostReaction } from '../models/post-reaction.model';
import { IPost } from '../models/post.model';
import { PostCardAction, PostCardActionProps } from './PostCardAction';
import { PostReactionPopover } from './PostReactionPopover';
import { ReactionButton } from './ReactionButton';

export type PostCardProps = {
  post: IPost;
  afterReactPost: (data: IReactPostRes, myReaction: IPostReaction) => any;
  afterDeleteReactPost: (
    req: IDeleteReactPostReq,
    reactType: PostReactionType,
  ) => any;
  isModal?: boolean;
  afterCreateComment: (data: ICreateCommentRes) => any;
} & Pick<
  CommentBoxProps,
  | 'afterReactComment'
  | 'afterDeleteReactComment'
  | 'emphasizedCommentIds'
  | 'afterDeleteComment'
  | 'afterUpdateComment'
> &
  Pick<PostCardActionProps, 'afterDeletePost'>;

export const PostCard = ({
  post,
  isModal,
  emphasizedCommentIds,
  afterReactPost: parentAfterReactPost,
  afterReactComment: parentAfterReactComment,
  afterCreateComment: parentAfterCreateComment,
  afterDeleteReactPost: parentAfterDeleteReactPost,
  afterDeleteReactComment: parentAfterDeleteReactComment,
  afterDeleteComment: parentAfterDeleteComment,
  afterUpdateComment: parentAfterUpdateComment,
  afterDeletePost,
}: PostCardProps) => {
  const dispatch = useAppDispatch();

  const {
    angryCount,
    totalDirectCommentCount,
    totalCount,
    loveCount,
    likeCount,
    myReaction,
    files,
    user,
    audienceType,
    firstComment,
    createdAt,
    content,
    totalCommentCount,
  } = post;

  const [isShowReaction, setIsShowReaction] = useState(false);
  const likeBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuActionRef = useRef<HTMLDivElement | null>(null);
  const infiniteCommentParams = { postId: post.id, limit: 20 };
  const {
    data: commentsData,
    isFetching: isFetchingComments,
    isFetchingNextPage: isFetchingNextPageComments,
    fetchNextPage: fetchComments,
    afterCreateComment: afterCreateCommentInfiniteComment,
    afterReactComment: afterReactCommentInfiniteComment,
    afterDeleteReactComment: afterDeleteReactCommentInfiniteComment,
    afterUpdateComment: afterUpdateCommentInfiniteComment,
    afterDeleteComment: afterDeleteCommentInfiniteComment,
  } = useInfiniteComment(infiniteCommentParams, !!isModal);
  const { mutate: reactPost, isLoading: isReacting } = useReactPost({
    onSuccess(data, variables, context) {
      afterReactPost(data, myReaction);
    },
    onError(error, variables, context) {
      console.log('error', error);
    },
  });
  const { mutate: deleteReactPost, isLoading: isDeletingReactPost } =
    useDeleteReactPost({
      onSuccess(data, variables, context) {
        afterDeleteReactPost(variables, myReaction.type);
        setIsShowReaction(false);
      },
      onError(error, variables, context) {},
    });

  const avtUrl = user.profile.avatar?.url || emptyAvatarUrl;
  const audienceTypeImageLink = getAudienceImageLink(audienceType);
  const comments = commentsData?.pages.flatMap((page) => page.items) || [];
  const showViewMoreComment =
    (!isModal && totalDirectCommentCount > 1) ||
    (isModal && comments.length < totalDirectCommentCount);

  const afterReactPost = (data: IReactPostRes, oldReaction: IPostReaction) => {
    parentAfterReactPost(data, oldReaction);

    const newPost = structuredClone(post);
    if (isModal) {
      if (oldReaction) {
        newPost.totalCount -= 1;
        switch (oldReaction.type) {
          case PostReactionType.ANGRY:
            newPost.angryCount -= 1;
            break;
          case PostReactionType.LIKE:
            newPost.likeCount -= 1;
            break;
          case PostReactionType.LOVE:
            newPost.loveCount -= 1;
            break;
        }
      }

      switch (data.type) {
        case PostReactionType.ANGRY:
          newPost.angryCount += 1;
          break;
        case PostReactionType.LIKE:
          newPost.likeCount += 1;
          break;
        case PostReactionType.LOVE:
          newPost.loveCount += 1;
          break;
      }

      newPost.totalCount += 1;
      newPost.myReaction = data;

      dispatch(setViewPostData({ ...newPost }));
    }
  };

  const afterDeleteReactPost = (
    req: IDeleteReactPostReq,
    reactType: PostReactionType,
  ) => {
    parentAfterDeleteReactPost(req, reactType);

    const newPostData = { ...post };
    switch (reactType) {
      case PostReactionType.ANGRY:
        newPostData.angryCount -= 1;
        break;
      case PostReactionType.LIKE:
        newPostData.likeCount -= 1;
        break;
      case PostReactionType.LOVE:
        newPostData.loveCount -= 1;
        break;
    }
    newPostData.myReaction = null as any;
    newPostData.totalCount -= 1;
    dispatch(setViewPostData(newPostData));
    setIsShowReaction(false);
  };

  const afterCreateComment = (data: ICreateCommentRes) => {
    afterCreateCommentInfiniteComment(data);
    parentAfterCreateComment(data);
    if (isModal) {
      dispatch(
        setViewPostData({
          ...post,
          totalCommentCount: totalCommentCount + 1,
          ...(!data.parentId && {
            totalDirectCommentCount: totalDirectCommentCount + 1,
          }),
        }),
      );
    }
  };

  const afterUpdateComment = (data: IUpdateCommentRes) => {
    parentAfterUpdateComment(data);
    afterUpdateCommentInfiniteComment(data);
  };

  const afterDeleteComment = (data: IComment) => {
    parentAfterDeleteComment(data);
    afterDeleteCommentInfiniteComment(data);

    if (isModal) {
      dispatch(
        setViewPostData({
          ...post,
          totalCommentCount: totalCommentCount - 1,
          ...(!data.parentId && {
            totalDirectCommentCount: totalDirectCommentCount - 1,
          }),
        }),
      );
    }
  };

  const afterReactComment = (
    data: IReactCommentRes,
    comment: IComment,
    myReaction: ICommentReaction,
  ) => {
    afterReactCommentInfiniteComment(data, comment, myReaction);
    parentAfterReactComment(data, comment, myReaction);
  };

  const afterDeleteReactComment = (
    oldReaction: ICommentReaction,
    comment: IComment,
  ) => {
    parentAfterDeleteReactComment(oldReaction, comment);
    afterDeleteReactCommentInfiniteComment(oldReaction, comment);
  };

  const handleShowComments = () => {
    if (isModal) {
      if (isFetchingComments || isFetchingNextPageComments) return;

      fetchComments();
    } else {
      dispatch(setViewPost({ isShow: true, post }));
    }
  };

  const handleReact = (type: PostReactionType) => {
    if (isReacting) return;
    reactPost({ postId: post.id, type });
    setIsShowReaction(false);
  };

  const handleDeleteReactPost = () => {
    if (isDeletingReactPost) return;
    deleteReactPost({ postId: post.id });
  };

  const handleClickReactBtn = () => {
    if (myReaction) {
      handleDeleteReactPost();
    } else {
      handleReact(PostReactionType.LIKE);
    }
  };

  return (
    <Box bgcolor="darkAccent.main" borderRadius="6px" paddingX="16px" pb="12px">
      <Stack
        direction="row"
        paddingY="12px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row">
          <Link href={`/profile/${user.id}`}>
            <Avatar src={avtUrl} />
          </Link>
          <Stack ml="8px">
            <Link href={`/profile/${user.id}`}>
              <Typography
                fontSize="0.9375rem"
                sx={{ '&:hover': { textDecorationLine: 'underline' } }}
              >
                {user.profile.name}
              </Typography>
            </Link>

            <Stack direction="row" alignItems="center" spacing="4px">
              <Typography
                color="secondaryText.main"
                fontSize=".8125rem"
                sx={{ '&:hover': { textDecorationLine: 'underline' } }}
              >
                {genDisplayDateByTimeDiff(createdAt)}
              </Typography>
              <Typography color="secondaryText.main" fontSize="1rem" my="4px">
                &#183;
              </Typography>
              <Image
                src={audienceTypeImageLink}
                width={12}
                height={12}
                alt=""
                style={{
                  WebkitFilter:
                    'invert(62%) sepia(98%) saturate(12%) hue-rotate(175deg) brightness(90%) contrast(96%)',
                }}
              />
            </Stack>
          </Stack>
        </Stack>

        <Box sx={{ position: 'relative' }} ref={menuActionRef}>
          <IconButton color="secondaryText">
            <MoreHorizIcon />
          </IconButton>

          <PostCardAction
            toggleIconRef={menuActionRef}
            post={post}
            afterDeletePost={afterDeletePost}
          />
        </Box>
      </Stack>

      <Box fontSize="0.9375rem" color="primaryText.main" whiteSpace="pre-wrap">
        {content}
      </Box>

      <CustomImageList files={files} my={files.length && '10px'} />

      {!!(totalCommentCount || totalCount) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          color="secondaryText.main"
          my="4px"
        >
          <ReactionCount
            bgcolor="unset"
            angryCount={angryCount}
            likeCount={likeCount}
            loveCount={loveCount}
            totalCount={totalCount}
          />

          <Typography
            onClick={handleShowComments}
            sx={{
              ':hover': { textDecoration: 'underline' },
              cursor: 'pointer',
            }}
          >
            {totalCommentCount} comments
          </Typography>
        </Stack>
      )}

      <Divider sx={{ mt: '10px' }} />

      <Stack direction="row" mb="4px">
        <Button
          color="secondaryText"
          sx={{
            flexGrow: '1',
            fontSize: '.9375rem',
            fontWeight: '600',
            position: 'relative',
            '::before': {
              width: '100%',
              height: '10px',
              position: 'absolute',
              content: `""`,
              bottom: '100%',
            },
          }}
          ref={likeBtnRef}
          onMouseEnter={() => setIsShowReaction(true)}
          onMouseLeave={() => setIsShowReaction(false)}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            onClick={handleClickReactBtn}
            width="100%"
            height="100%"
          >
            {myReaction ? (
              <ReactionButton reaction={myReaction.type} />
            ) : (
              <>
                <ThumbUpOffAltIcon />
                <Typography fontSize="0.9375rem" fontWeight="600" ml="6px">
                  Like
                </Typography>
              </>
            )}
          </Stack>
          <PostReactionPopover
            isShow={isShowReaction}
            handleReact={handleReact}
          />
        </Button>
        <Button
          color="secondaryText"
          startIcon={<ChatBubbleOutlineIcon />}
          sx={{ flexGrow: '1', fontSize: '.9375rem', fontWeight: '600' }}
          onClick={handleShowComments}
        >
          Comment
        </Button>
        <Button
          color="secondaryText"
          startIcon={<ShareIcon />}
          sx={{ flexGrow: '1', fontSize: '.9375rem', fontWeight: '600' }}
        >
          Share
        </Button>
      </Stack>

      <Divider sx={{ mb: '8px' }} />

      <Box my="10px">
        <CreateCommentBox
          postId={post.id}
          afterCreateComment={afterCreateComment}
        />
      </Box>

      {!isModal && !!firstComment && (
        <CommentBox
          emphasizedCommentIds={emphasizedCommentIds}
          comment={firstComment}
          afterReactComment={afterReactComment}
          afterDeleteReactComment={afterDeleteReactComment}
          afterUpdateComment={afterUpdateComment}
          afterDeleteComment={afterDeleteComment}
          isShowReplyComment
        />
      )}

      {isModal && (
        <Stack spacing="15px">
          {comments.map((item) => (
            <CommentBox
              key={item.id}
              comment={item}
              afterReactComment={afterReactComment}
              afterDeleteReactComment={afterDeleteReactComment}
              afterUpdateComment={afterUpdateComment}
              afterDeleteComment={afterDeleteComment}
            />
          ))}
        </Stack>
      )}

      {showViewMoreComment && (
        <Typography
          fontSize="0.9375rem"
          color="secondaryText.main"
          fontWeight="600"
          sx={{
            mt: '10px',
            cursor: 'pointer',
            ':hover': { textDecoration: 'underline' },
          }}
          onClick={handleShowComments}
        >
          View more comments
        </Typography>
      )}

      {!totalDirectCommentCount && (
        <Typography fontSize="0.9375rem" color="secondaryText.main">
          Be the first to comment
        </Typography>
      )}
    </Box>
  );
};
