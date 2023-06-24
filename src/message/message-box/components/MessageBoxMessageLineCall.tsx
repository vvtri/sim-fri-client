import { Call } from '@mui/icons-material';
import { Avatar, AvatarGroup, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import dayjs from 'dayjs';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { MessageReadInfoStatus } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { Center } from '../../../common/components/utils/Center';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { useIsInViewport } from '../../../common/hooks/use-is-in-viewport';
import { useReadMessage } from '../../common/hooks/use-read-message';
import { IConversationMember } from '../../common/models/conversation-member.model';
import { IMessageUserInfo } from '../../common/models/message-user-info.model';
import { IMessage } from '../../common/models/message.model';
import { openCallWindow } from '../../common/utils/message.util';
import { MessageBoxMessageLineActionIcon } from './MessageBoxMessageLineActionIcons';
import { MessageBoxMessageLineTimeTooltip } from './MessageBoxMessageLineTimeTooltip';

type MessageBoxMessageCallProps = {
  message: IMessage;
  conversationMembers: IConversationMember[];
  shouldDisplayReadUsers?: boolean;
  isGroup: boolean;
  afterMutateMsg: (data: IMessageUserInfo, message: IMessage) => any;
};

export const MessageBoxMessageCall = ({
  conversationMembers,
  message,
  shouldDisplayReadUsers,
  isGroup,
  afterMutateMsg,
}: MessageBoxMessageCallProps) => {
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
  const isMyMsg = message.user.id === userProfile?.user.id;

  useEffect(() => {
    if (isReadingMsg || !isInViewport) return;

    const msgUserInfo = messageUserInfos.find(
      (item) => item.user.id === userProfile?.user.id,
    );

    if (msgUserInfo?.status === MessageReadInfoStatus.READ) {
      return;
    }

    mutate(message.id);
  }, [isInViewport, isReadingMsg]);

  const handleClick: MouseEventHandler<HTMLDivElement> = () => {
    const url = `/call/${message.conversationId}/${message.id}`;
    openCallWindow(url);
  };

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
          {!isMyMsg && (
            <Avatar
              src={authorAvt}
              sx={{ width: '28px', height: '28px', mb: '4px' }}
            />
          )}

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
              date={message.createdAt}
              tooltipProps={{ placement: isMyMsg ? 'left' : 'right' }}
            >
              <Stack
                bgcolor="comment.main"
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                overflow="hidden"
                paddingY="10px"
                paddingX="20px"
                borderRadius="20px"
                spacing="10px"
                sx={{
                  '&:hover': { bgcolor: 'hoverColor.main' },
                  cursor: 'pointer',
                }}
                onClick={handleClick}
              >
                <Center
                  sx={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                  }}
                >
                  <Call
                    sx={{
                      color: 'white',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                    }}
                  />
                </Center>

                <Stack>
                  <Typography fontSize="0.9375rem" fontWeight="600">
                    {isGroup ? 'Group call' : 'Video call'}
                  </Typography>
                  <Typography fontSize="0.8125rem">Tap to join</Typography>
                </Stack>
              </Stack>
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
