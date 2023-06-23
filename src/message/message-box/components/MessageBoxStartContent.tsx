import { Avatar, Stack, Typography } from '@mui/material';
import { ConversationMemberRole } from 'shared';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { IUserProfile } from '../../../profile/common/models/user-profile.model';
import { IConversation } from '../../common/models/conversation.model';
import { MessageBoxMessageLineSystem } from './MessageBoxMessageLineSystem';

type MessageBoxContentProps = {
  conversation?: IConversation;
  userProfile?: IUserProfile;
  isNewConversation: boolean;
};

export const MessageBoxStartContent = ({
  conversation,
  isNewConversation,
  userProfile,
}: MessageBoxContentProps) => {
  const { userProfile: authProfile } = useAuth();
  const { avatar, isGroup, name, conversationMembers } = conversation || {};
  let avtUrl: string;
  let conversationName: string;
  let conversationInfo: string;

  if (isNewConversation) {
    avtUrl = userProfile?.avatar?.url || emptyAvatarUrl;
    conversationName = userProfile!.name;
    conversationInfo = `You aren't friends on SimFri`;
  } else {
    if (isGroup) {
      avtUrl = avatar?.url || emptyAvatarUrl;
      conversationName = name as any;
      const owner = conversationMembers!.find(
        (item) => item.role === ConversationMemberRole.OWNER,
      );
      const isOwner = owner?.user.id === authProfile?.user.id;
      conversationInfo = isOwner
        ? `You created this group`
        : `${owner?.user.profile.name} created this group`;
    } else {
      const otherPerson =
        conversationMembers!.find(
          (item) => item.user.id !== authProfile?.user?.id,
        ) || conversationMembers?.[0];

      avtUrl = otherPerson!.user.profile.avatar?.url || emptyAvatarUrl;
      conversationName = otherPerson!.user.profile.name;

      conversationInfo = true
        ? `You're friends on SimFri`
        : `You aren't friends on SimFri`;
    }
  }

  return (
    <>
      <MessageBoxMessageLineSystem content={conversationInfo} pb="30px" />

      <Stack
        width="100%"
        alignItems="center"
        justifyContent="center"
        pt="40px"
        spacing="10px"
        px="20px"
      >
        <Avatar src={avtUrl} sx={{ width: '60px', height: '60px' }} />
        <Typography fontSize="1.0625rem" fontWeight="600" textAlign="center">
          {conversationName}
        </Typography>
      </Stack>
    </>
  );
};
