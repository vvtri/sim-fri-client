import { Call, Close, Remove } from '@mui/icons-material';
import { Avatar, IconButton, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { shallowEqualArrays } from 'shallow-equal';
import { MessageType } from 'shared';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { addSnackBar } from '../../../common/utils/snackbar.util';
import { IUserProfile } from '../../../profile/common/models/user-profile.model';
import { useAppDispatch } from '../../../redux/hook';
import { removeConversationMessageBox } from '../../../redux/slices/message.slice';
import { genInfiniteConversationQueryKey } from '../../common/hooks/use-infinite-conversation';
import { useSendMessage } from '../../common/hooks/use-send-message';
import { IConversationMember } from '../../common/models/conversation-member.model';
import { IConversation } from '../../common/models/conversation.model';
import { openCallWindow } from '../../common/utils/message.util';

type MessageBoxHeaderProps = {
  conversation?: IConversation;
  userProfile?: IUserProfile;
  isNewConversation: boolean;
};

export const MessageBoxHeader = ({
  conversation,
  isNewConversation,
  userProfile,
}: MessageBoxHeaderProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { userProfile: authProfile } = useAuth();
  const { mutate: sendMessage, mutateAsync: sendMessageAsync } = useSendMessage(
    {
      onSuccess(data, variables, context) {},
      onError(error, variables, context) {},
    },
  );

  const { avatar, isGroup, name, conversationMembers } = conversation || {};
  let avtUrl: string;
  let conversationName: string;
  let otherPerson: IConversationMember | undefined = undefined;

  if (isNewConversation) {
    conversationName = userProfile!.name;
    avtUrl = userProfile!.avatar?.url || emptyAvatarUrl;
  } else {
    if (isGroup) {
      avtUrl = avatar?.url || emptyAvatarUrl;
      conversationName = name as any;
    } else {
      otherPerson =
        conversationMembers!.find(
          (item) => item.user.id !== authProfile?.user?.id,
        ) || conversationMembers?.[0];

      avtUrl = otherPerson!.user.profile.avatar?.url || emptyAvatarUrl;
      conversationName = otherPerson!.user.profile.name;
    }
  }

  const handleCall: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (isNewConversation) return;

    try {
      const data = await sendMessageAsync({
        type: MessageType.CALL,
        conversationId: conversation!.id,
      });
      const url = `/call/${conversation!.id}/${data.id}`;
      openCallWindow(url);
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as any;

          const isInfiniteConversationQuery = shallowEqualArrays(
            queryKey,
            genInfiniteConversationQueryKey({}),
          );

          if (isInfiniteConversationQuery) return true;

          return false;
        },
      });
    } catch (error) {
      addSnackBar({ variant: 'error', message: 'Some error happens' });
    }
  };

  const handleClose: MouseEventHandler<HTMLButtonElement> = (e) => {
    dispatch(
      removeConversationMessageBox({
        isNewConversation,
        conversationId: conversation?.id,
        userProfileId: userProfile?.id,
      }),
    );
  };

  return (
    <Stack
      direction="row"
      padding="8px"
      alignItems="center"
      justifyContent="space-between"
    >
      {isGroup && !otherPerson ? (
        <Stack
          direction="row"
          alignItems="center"
          spacing="10px"
          sx={{ cursor: 'default' }}
          minWidth="0"
          flexGrow="1"
        >
          <Avatar src={avtUrl} sx={{ width: '32px', height: '32px' }} />
          <Typography fontSize="0.9375rem" fontWeight="600" noWrap>
            {conversationName}
          </Typography>
        </Stack>
      ) : (
        <Link
          href={`/profile/${otherPerson?.user?.id}`}
          style={{ minWidth: '0' }}
        >
          <Stack direction="row" alignItems="center" spacing="10px">
            <Avatar src={avtUrl} sx={{ width: '32px', height: '32px' }} />
            <Typography fontSize="0.9375rem" fontWeight="600">
              {conversationName}
            </Typography>
          </Stack>
        </Link>
      )}

      <Stack direction="row" alignItems="center" flexShrink="0">
        {!isNewConversation && (
          <IconButton color="secondaryText" onClick={handleCall}>
            <Call />
          </IconButton>
        )}

        <IconButton color="secondaryText" onClick={handleClose}>
          <Remove />
        </IconButton>
        <IconButton color="secondaryText" onClick={handleClose}>
          <Close />
        </IconButton>
      </Stack>
    </Stack>
  );
};
