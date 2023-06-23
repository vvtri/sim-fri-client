import { Stack } from '@mui/material';
import { useAppSelector } from '../../../redux/hook';
import { conversationMessageBoxSelector } from '../../../redux/slices/message.slice';
import { CreateConversationBox } from '../../conversation-panel/components/CreateConversationBox';
import { MessageBox } from './MessageBox';

export const MessageBoxList = () => {
  const { openConversations } = useAppSelector(conversationMessageBoxSelector);

  return (
    <Stack
      direction="row-reverse"
      position="fixed"
      bottom="0"
      right="80px"
      spacing="10px"
    >
      {openConversations.slice(0, 3).map((item) => {
        if (item.isCreateConversation) {
          return <CreateConversationBox key={`create_conversation`} />;
        } else {
          return (
            <MessageBox
              key={`${item.isNewConversation} ${item.conversation?.id} ${item.userProfile?.id}`}
              {...item}
            />
          );
        }
      })}
    </Stack>
  );
};
