import { Avatar, Stack, Typography } from '@mui/material';
import { MouseEventHandler } from 'react';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { IConversation } from '../../../message/common/models/conversation.model';

type HomeFriendItemProps = {
  conversation: IConversation;
  handleClick?: MouseEventHandler<HTMLDivElement>;
};

export const HomeConversationItem = ({
  conversation,
  handleClick,
}: HomeFriendItemProps) => {
  const { userProfile } = useAuth();

  const { conversationMembers } = conversation;

  const otherPerson =
    conversationMembers.find(
      (item) => item.user.id !== userProfile?.user?.id,
    ) || conversationMembers[0];

  let avtUrl = '';
  let conversationName = '';

  if (conversation.isGroup) {
    avtUrl = conversation.avatar?.url || emptyAvatarUrl;
    conversationName = conversation.name;
  } else {
    avtUrl = otherPerson.user.profile.avatar?.url || emptyAvatarUrl;
    conversationName = otherPerson.user.profile.name;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="10px"
      padding="8px"
      borderRadius="4px"
      sx={{
        '&:hover': { bgcolor: 'hoverColor.main', transition: '.3s' },
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Avatar src={avtUrl} sx={{ width: '36px', height: '36px' }} />
      <Typography
        color="secondaryText.main"
        fontSize="0.9375rem"
        fontWeight="500"
        noWrap
      >
        {conversationName}
      </Typography>
    </Stack>
  );
};
