import {
  Avatar,
  AvatarGroup,
  Box,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { MessageReadInfoStatus } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { ViewableImage } from '../../../common/components/utils/ViewableImage';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { useIsInViewport } from '../../../common/hooks/use-is-in-viewport';
import { useReadMessage } from '../../common/hooks/use-read-message';
import { IConversationMember } from '../../common/models/conversation-member.model';
import { IMessageUserInfo } from '../../common/models/message-user-info.model';
import { IMessage } from '../../common/models/message.model';
import { MessageBoxMessageLineActionIcon } from './MessageBoxMessageLineActionIcons';
import { MessageBoxMessageLineTimeTooltip } from './MessageBoxMessageLineTimeTooltip';

type MessageBoxMessageImageLineProps = {
  message: IMessage;
  conversationMembers: IConversationMember[];
  shouldDisplayReadUsers?: boolean;
  isGroup: boolean;
  afterMutateMsg: (data: IMessageUserInfo, message: IMessage) => any;
};

export const MessageBoxMessageLineImage = ({
  conversationMembers,
  message,
  shouldDisplayReadUsers,
  isGroup,
  afterMutateMsg,
}: MessageBoxMessageImageLineProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInViewport = useIsInViewport(ref);
  const { mutate, isLoading: isReadingMsg } = useReadMessage({
    onSuccess: (data) => afterMutateMsg(data, message),
    onError(error, variables, context) {
      console.log('error', error);
    },
  });
  const { userProfile } = useAuth();
  const [isHover, setIsHover] = useState(false);

  const { file, createdAt, user } = message;

  const messageUserInfos = message.messageUserInfos.map((item) => {
    const user = conversationMembers.find((cm) => item.user.id === cm.user.id)
      ?.user as IUser;
    item.user = user;
    return item;
  });
  const author = conversationMembers.find(
    (item) => item.user.id === message.user.id,
  );
  const authorAvt = author?.user.profile.avatar?.url || emptyAvatarUrl;
  const isMyMsg = user.id === userProfile?.user.id;

  useEffect(() => {
    if (isReadingMsg || !isInViewport || isMyMsg) return;

    const msgUserInfo = messageUserInfos.find(
      (item) => item.user.id === userProfile?.user.id,
    );

    if (msgUserInfo?.status === MessageReadInfoStatus.READ) {
      return;
    }

    mutate(message.id);
  }, [isInViewport, isReadingMsg]);

  return (
    <Stack>
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        justifyContent={isMyMsg ? 'flex-end' : 'flex-start'}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        spacing="10px"
        ref={ref}
      >
        {isHover && isMyMsg && <MessageBoxMessageLineActionIcon />}

        <Stack direction="row" alignItems="flex-end" spacing="4px">
          {/* avatar section */}
          {!isMyMsg && (
            <Avatar
              src={authorAvt}
              sx={{ width: '28px', height: '28px', mb: '4px' }}
            />
          )}

          {/* content + name section */}
          <Stack>
            {!isMyMsg && isGroup && (
              <Typography
                fontSize="0.75rem"
                color="secondaryText.main"
                pl="10px"
                pb="4px"
              >
                {author?.user.profile.name}
              </Typography>
            )}

            <MessageBoxMessageLineTimeTooltip
              date={createdAt}
              tooltipProps={{ placement: isMyMsg ? 'left' : 'right' }}
            >
              <ViewableImage component="img" src={message.file.url} maxWidth="190px" />
            </MessageBoxMessageLineTimeTooltip>
          </Stack>
        </Stack>

        {isHover && !isMyMsg && <MessageBoxMessageLineActionIcon />}
      </Stack>

      {shouldDisplayReadUsers && (
        <Stack justifyContent="flex-end" direction="row">
          <AvatarGroup variant="circular" max={5}>
            {messageUserInfos
              .filter((item) => item.user.id !== userProfile?.user.id)
              .map((item) => {
                const avtUrl = item.user.profile.avatar?.url || emptyAvatarUrl;
                const tooltipText = `Seen by ${
                  item.user.profile.name
                } at ${dayjs(item.createdAt).format('HH:mm')}`;

                return (
                  <Tooltip title={tooltipText} key={item.id}>
                    <Avatar
                      src={avtUrl}
                      sx={{
                        width: '14px',
                        height: '14px',
                        border: 'none !important',
                      }}
                    />
                  </Tooltip>
                );
              })}
          </AvatarGroup>
        </Stack>
      )}
    </Stack>
  );
};
