import { Divider, Stack } from '@mui/material';
import {
  CARD_BOX_SHADOW,
  headerHeight,
} from '../../../common/constants/index.constant';
import { IUserProfile } from '../../../profile/common/models/user-profile.model';
import { IConversation } from '../../common/models/conversation.model';
import { MessageBoxAction } from './MessageBoxAction';
import { MessageBoxContent } from './MessageBoxContent';
import { MessageBoxHeader } from './MessageBoxHeader';

type MessageBoxProps = {
  conversation?: IConversation;
  userProfile?: IUserProfile;
  isNewConversation: boolean;
};

export const MessageBox = ({ ...rest }: MessageBoxProps) => {
  return (
    <Stack
      height="455px"
      maxHeight={`calc(100vh - ${headerHeight} - 10px)`}
      width="328px"
      bgcolor="darkAccent.main"
      sx={{ boxShadow: CARD_BOX_SHADOW }}
      borderRadius="5px"
      overflow="hidden"
    >
      <MessageBoxHeader {...rest} />
      <Divider />

      <MessageBoxContent {...rest} />

      <MessageBoxAction {...rest} />
    </Stack>
  );
};
