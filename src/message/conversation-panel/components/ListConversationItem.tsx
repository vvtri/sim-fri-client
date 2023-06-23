import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { MessageReadInfoStatus, MessageType } from 'shared';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { genDisplayDateByTimeDiff } from '../../../common/utils/index.util';
import { IUserProfile } from '../../../profile/common/models/user-profile.model';
import { useAppDispatch } from '../../../redux/hook';
import {
  addConversationMessageBox,
  setConversationListPanelIsShow,
} from '../../../redux/slices/message.slice';
import { IConversation } from '../../common/models/conversation.model';
import { IMessageUserInfo } from '../../common/models/message-user-info.model';

export type ListConversationItemProps = {
  conversation: IConversation;
  afterReadLatestMsg: (
    msgUserInfo: IMessageUserInfo,
    conversationId: number,
  ) => any;
};

export const ListConversationItem = ({
  conversation,
  afterReadLatestMsg,
}: ListConversationItemProps) => {
  const dispatch = useAppDispatch();
  const { userProfile } = useAuth();

  const { avatar, isGroup, name, conversationMembers, latestMessage } =
    conversation;
  let avtUrl: string;
  let conversationName: string;

  const msgUserInfo = latestMessage?.messageUserInfos.find(
    (item) => item.user.id === userProfile?.user.id,
  );

  const [isReadLatestMsg, setIsReadLatestMsg] = useState(
    msgUserInfo?.status === MessageReadInfoStatus.READ ||
      latestMessage?.user?.id === userProfile?.user.id,
  );

  if (isGroup) {
    avtUrl = avatar?.url || emptyAvatarUrl;
    conversationName = name;
  } else {
    const otherPerson =
      conversationMembers.find(
        (item) => item.user.id !== userProfile?.user?.id,
      ) || conversationMembers[0];

    avtUrl = otherPerson.user.profile.avatar?.url || emptyAvatarUrl;
    conversationName = otherPerson.user.profile.name;
  }

  let msgContent: string = '';
  let senderName = '';
  const displayTime = ` ${genDisplayDateByTimeDiff(latestMessage?.createdAt)}`;

  if (latestMessage) {
    if (latestMessage.type !== MessageType.SYSTEM) {
      senderName =
        latestMessage.user.id === userProfile?.user.id
          ? 'You'
          : latestMessage.user.profile.name;
    }
    switch (latestMessage.type) {
      case MessageType.TEXT:
        msgContent = `${senderName}: ${latestMessage.content}`;
        break;
      case MessageType.SYSTEM:
        msgContent = `${latestMessage.content}`;
        break;
      case MessageType.CALL:
        msgContent = `${senderName}: create a call`;
        break;
      case MessageType.IMAGE:
        msgContent = `${senderName}: send an image`;
        break;
      default:
        throw new Error(`Message type ${latestMessage.type} not implemented`);
    }
  }

  const handleClick = (e: any) => {
    setIsReadLatestMsg(true);
    dispatch(
      addConversationMessageBox({ isNewConversation: false, conversation }),
    );
    dispatch(setConversationListPanelIsShow(false));

    const user = structuredClone(userProfile!.user);
    user.profile = userProfile as IUserProfile;
    const msgReadInfo = {
      user,
      id: -Date.now(),
      status: MessageReadInfoStatus.READ,
    } as IMessageUserInfo;

    afterReadLatestMsg(msgReadInfo, conversation.id);
  };

  return (
    <Stack
      direction="row"
      spacing="10px"
      padding="10px"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        '&:hover': { backgroundColor: 'comment.main', cursor: 'pointer' },
      }}
      onClick={handleClick}
      borderRadius="10px"
    >
      <Stack direction="row" alignItems="center" spacing="10px" width="100%">
        <Avatar src={avtUrl} />

        <Stack flexGrow="1" minWidth="0">
          <Typography fontSize="0.9375rem" color="primaryText.main" noWrap>
            {conversationName}
          </Typography>

          {/* latest message */}
          {latestMessage && (
            <Stack direction="row" alignItems="center">
              <Typography
                fontSize="0.8125rem"
                color="secondaryText.main"
                minWidth="0"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                width="fit-content"
              >
                {msgContent} &#183;
              </Typography>
              <Typography
                fontSize="0.8125rem"
                color="secondaryText.main"
                flexShrink="0"
                ml="4px"
              >
                {displayTime}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>

      {!isReadLatestMsg && (
        <Box
          borderRadius="50%"
          bgcolor="primary.main"
          width="12px"
          height="12px"
        />
      )}
    </Stack>
  );
};
