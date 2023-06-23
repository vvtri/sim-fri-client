import { ChatBubble } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { CommentReactionType, NotiType, PostReactionType } from 'shared';
import { Center } from '../../../common/components/utils/Center';
import {
  IMAGE_PATHS,
  emptyAvatarUrl,
} from '../../../common/constants/index.constant';
import { genDisplayDateByTimeDiff } from '../../../common/utils/index.util';
import { useAppDispatch } from '../../../redux/hook';
import { setNotiListPanelIsShow } from '../../../redux/slices/noti.slice';
import { useReadNoti } from '../../common/hooks/use-read-noti';
import { INoti } from '../../common/models/noti.model';

const mapNotiReaction = (
  reactionType: PostReactionType | CommentReactionType,
) => {
  switch (reactionType) {
    case PostReactionType.ANGRY:
    case CommentReactionType.ANGRY:
      return (
        <Box
          component="img"
          src={IMAGE_PATHS.ANGRY_ICON}
          sx={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
          }}
        />
      );

    case PostReactionType.LOVE:
    case CommentReactionType.LOVE:
      return (
        <Box
          component="img"
          src={IMAGE_PATHS.LOVE_ICON}
          sx={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
          }}
        />
      );

    case PostReactionType.LIKE:
    case CommentReactionType.LIKE:
      return (
        <Box
          component="img"
          src={IMAGE_PATHS.LIKE_ICON}
          sx={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
          }}
        />
      );

    default:
      throw new Error(`Noti reaction type ${reactionType} not implemented`);
  }
};

const getNotiIcon = (noti: INoti) => {
  switch (noti.type) {
    case NotiType.COMMENT_POST:
    case NotiType.REPLY_COMMENT:
      return (
        <Center
          bgcolor="#26BD4C"
          color="white"
          borderRadius="50%"
          width="28px"
          height="28px"
        >
          <ChatBubble sx={{ width: '18px', height: '18px' }} />
        </Center>
      );

    case NotiType.COMMENT_REACTION:
    case NotiType.POST_REACTION:
      return mapNotiReaction(noti.reactionType);
    default:
      throw new Error(`Noti type ${noti.type} not implemented`);
  }
};

type ListNotiPanelItemProps = {
  noti: INoti;
  afterMutateReadNoti: (res: INoti) => any;
};

export const ListNotiPanelItem = ({
  noti,
  afterMutateReadNoti,
}: ListNotiPanelItemProps) => {
  const dispatch = useAppDispatch();
  const { senderUser, content, updatedAt, readAt } = noti;
  const { mutate, isLoading } = useReadNoti({
    onSuccess(data, variables, context) {
      afterMutateReadNoti(data);
    },
    onError(error, variables, context) {},
  });

  const thumbnailUrl = senderUser.profile.avatar?.url || emptyAvatarUrl;

  const handleClick = () => {
    dispatch(setNotiListPanelIsShow(false));
    mutate({ notiId: noti.id, isRead: true });
  };

  return (
    <Link href={noti.link}>
      <Stack
        direction="row"
        spacing="10px"
        padding="10px"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          borderRadius: '10px',
          '&:hover': { backgroundColor: 'comment.main', cursor: 'pointer' },
        }}
        color={readAt ? 'secondaryText.main' : 'primaryText.main'}
        onClick={handleClick}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing="14px"
          flexGrow="1"
          minWidth="0"
        >
          <Box width="50px" height="50px" position="relative">
            <Avatar src={thumbnailUrl} sx={{ width: '50px', height: '50px' }} />

            <Box position="absolute" right="-6px" bottom="-6px">
              {getNotiIcon(noti)}
            </Box>
          </Box>

          <Stack>
            <Typography
              fontSize="0.9375rem"
              color="inherit"
              dangerouslySetInnerHTML={{ __html: content }}
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            />

            <Typography
              fontSize="0.8125rem"
              color={readAt ? 'secondaryText.main' : 'primary.main'}
            >
              {genDisplayDateByTimeDiff(noti.updatedAt, { suffix: 'ago' })}
            </Typography>
          </Stack>
        </Stack>

        {!readAt && (
          <Box
            borderRadius="50%"
            bgcolor="primary.main"
            width="12px"
            height="12px"
            flexShrink="0"
          />
        )}
      </Stack>
    </Link>
  );
};
