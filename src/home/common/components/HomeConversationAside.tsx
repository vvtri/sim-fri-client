import { CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Center } from '../../../common/components/utils/Center';
import { headerHeight } from '../../../common/constants/index.constant';
import { useGetListConversation } from '../../../message/common/hooks/use-get-list-conversation';
import { useAppDispatch } from '../../../redux/hook';
import { addConversationMessageBox } from '../../../redux/slices/message.slice';
import { HomeConversationItem } from './HomeConversationItem';

export const HomeConversationAside = () => {
  const dispatch = useAppDispatch();

  const { data: contacts, isFetching: isFetchingContact } =
    useGetListConversation({
      isGroup: false,
      limit: 20,
    });
  const { data: groupConversations, isFetching: isFetchingGroupConversation } =
    useGetListConversation({
      isGroup: true,
      limit: 20,
    });

  return (
    <Box
      maxWidth="300px"
      width="100%"
      padding="14px"
      paddingY="20px"
      color="secondaryText.main"
      sx={{ overflowY: 'auto' }}
      height={`calc(100vh - ${headerHeight})`}
      top={headerHeight}
      left="0"
      position="sticky"
      borderLeft="2px solid"
      borderColor="divider"
    >
      <Typography textAlign="left" fontSize="1.1125rem" fontWeight="600">
        Contact
      </Typography>

      <Stack mt="10px">
        {isFetchingContact && (
          <Center width="100%" py="30px">
            <CircularProgress />
          </Center>
        )}

        {contacts?.items.map((item) => (
          <HomeConversationItem
            key={item.id}
            conversation={item}
            handleClick={() => {
              dispatch(
                addConversationMessageBox({
                  isNewConversation: false,
                  conversation: item,
                }),
              );
            }}
          />
        ))}
      </Stack>

      <Divider sx={{ my: '20px' }} />

      <Typography textAlign="left" fontSize="1.1125rem" fontWeight="600">
        Group conversations
      </Typography>

      <Stack mt="10px">
        {isFetchingGroupConversation && (
          <Center width="100%" py="30px">
            <CircularProgress />
          </Center>
        )}

        {groupConversations?.items.map((item) => (
          <HomeConversationItem
            key={item.id}
            conversation={item}
            handleClick={() => {
              dispatch(
                addConversationMessageBox({
                  isNewConversation: false,
                  conversation: item,
                }),
              );
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};
