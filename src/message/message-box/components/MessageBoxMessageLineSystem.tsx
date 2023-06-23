import { Stack, StackProps, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { MessageReadInfoStatus } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { useAuth } from '../../../common/hooks/use-auth';
import { useIsInViewport } from '../../../common/hooks/use-is-in-viewport';
import { useReadMessage } from '../../common/hooks/use-read-message';
import { IConversationMember } from '../../common/models/conversation-member.model';
import { IMessage } from '../../common/models/message.model';

type MessageBoxMessageLineSystemProps = {
  content: string;
  message?: IMessage;
  conversationMembers?: IConversationMember[];
} & StackProps;

export const MessageBoxMessageLineSystem = ({
  content,
  message,
  conversationMembers,
  ...rest
}: MessageBoxMessageLineSystemProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { userProfile } = useAuth();
  const isInViewport = useIsInViewport(ref);
  const { mutate, isLoading: isReadingMessage } = useReadMessage({});
  const readingMessageRef = useRef(isReadingMessage);

  const messageUserInfos =
    message?.messageUserInfos.map((item) => {
      const user = conversationMembers?.find(
        (cm) => item.user.id === cm.user.id,
      )?.user as IUser;
      item.user = user;
      return item;
    }) || [];

  useEffect(() => {
    if (
      readingMessageRef.current ||
      !message ||
      !conversationMembers?.length ||
      !isInViewport
    ) {
      return;
    }

    const msgUserInfo = messageUserInfos.find(
      (item) => item.user.id === userProfile?.user.id,
    );

    if (msgUserInfo?.status === MessageReadInfoStatus.READ) {
      return;
    }

    mutate(message.id);
  }, [isInViewport, readingMessageRef]);

  useEffect(() => {
    readingMessageRef.current = isReadingMessage;
  }, [isReadingMessage]);

  return (
    <Stack
      width="100%"
      alignItems="center"
      justifyContent="center"
      ref={ref}
      {...rest}
    >
      <Typography fontSize="0.75rem" color="secondaryText.main">
        {content}
      </Typography>
    </Stack>
  );
};
