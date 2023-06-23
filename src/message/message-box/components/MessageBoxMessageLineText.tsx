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
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { useIsInViewport } from '../../../common/hooks/use-is-in-viewport';
import { useReadMessage } from '../../common/hooks/use-read-message';
import { IConversationMember } from '../../common/models/conversation-member.model';
import { IMessageUserInfo } from '../../common/models/message-user-info.model';
import { IMessage } from '../../common/models/message.model';
import { MessageBoxMessageLineActionIcon } from './MessageBoxMessageLineActionIcons';

type MessageBoxMessageLineTextProps = {
  message: IMessage;
  conversationMembers: IConversationMember[];
  shouldDisplayReadUsers?: boolean;
  isGroup: boolean;
  afterMutateMsg: (data: IMessageUserInfo, message: IMessage) => any;
};

export const MessageBoxMessageLineText = ({
  message,
  conversationMembers,
  shouldDisplayReadUsers,
  isGroup,
  afterMutateMsg,
}: MessageBoxMessageLineTextProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInViewport = useIsInViewport(ref);
  const { mutate, isLoading: isMutateReadMessage } = useReadMessage({
    onSuccess: (data) => afterMutateMsg(data, message),
    onError(error, variables, context) {
      console.log('error', error);
    },
  });
  const { userProfile } = useAuth();
  const [isHover, setIsHover] = useState(false);

  const { content, createdAt } = message;
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
    if (isMutateReadMessage) return;

    const msgUserInfo = messageUserInfos.find(
      (item) => item.user.id === userProfile?.user.id,
    );

    if (msgUserInfo?.status === MessageReadInfoStatus.READ || !isInViewport) {
      return;
    }

    mutate(message.id);
  }, [isInViewport, isMutateReadMessage]);

  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent={isMyMsg ? 'flex-end' : 'flex-start'}
        alignItems="flex-end"
        spacing="4px"
        ref={ref}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {isHover && isMyMsg && <MessageBoxMessageLineActionIcon pb="10px" />}

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

            <Box
              borderRadius="20px"
              bgcolor={isMyMsg ? 'primary.main' : 'divider'}
              padding="8px 12px"
              maxWidth="190px"
            >
              <Tooltip
                title={`Sent at  ${dayjs(createdAt).format(
                  'DD/MM/YYYY HH:mm',
                )}`}
                placement={isMyMsg ? 'left' : 'right'}
                PopperProps={{
                  popperOptions: {
                    modifiers: [{ name: 'preventOverflow', enabled: true }],
                  },
                }}
              >
                <Typography fontSize="0.9375rem">{content}</Typography>
              </Tooltip>
            </Box>
          </Stack>
        </Stack>

        {isHover && !isMyMsg && <MessageBoxMessageLineActionIcon pb="10px" />}
      </Stack>

      {shouldDisplayReadUsers && (
        <Stack justifyContent="flex-end" direction="row">
          <AvatarGroup variant="circular" max={5}>
            {messageUserInfos
              .filter(
                (item) =>
                  item.user.id !== userProfile?.user.id &&
                  item.user.id !== message.user.id,
              )
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
