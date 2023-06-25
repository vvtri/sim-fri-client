import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { UIEventHandler, useEffect, useRef, useState } from 'react';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { Center } from '../../../common/components/utils/Center';
import {
  CARD_BOX_SHADOW,
  headerHeight,
} from '../../../common/constants/index.constant';
import { useInfinitePeople } from '../../../search/common/hooks/use-infinite-people.hook';
import { MessageBoxAction } from '../../message-box/components/MessageBoxAction';
import { CreateConversationBoxHeader } from './CreateConversationBoxHeader';
import { CreateConversationBoxMemberItem } from './CreateConversationBoxMemberItem';
import { CreateConversationBoPeopleItem } from './CreateConversationBoxPeopleItem';

type CreateConversationBoxProps = {};

export const CreateConversationBox = ({}: CreateConversationBoxProps) => {
  const [content, setContent] = useState('');
  const [width, setWidth] = useState('10ch');
  const [members, setMembers] = useState<IUser[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data, isFetching, isFetchingNextPage, fetchNextPage } =
    useInfinitePeople(
      { searchText: content, excludedIds: members.map((item) => item.id) },
      { enabled: !!content },
    );

  const people = data?.pages.flatMap((item) => item.items) || [];

  const handleRemoveMember = (member: IUser) => {
    setMembers((old) => old.filter((item) => item.id !== member.id));
  };

  const handleAddMember = (people: IUser) => {
    setMembers((old) => {
      const newMembers = old.filter((item) => item.id !== people.id);
      newMembers.push(people);
      return [...newMembers];
    });
    inputRef.current?.focus();
    setContent('');
  };

  const handlerFetchPeople: UIEventHandler<HTMLDivElement> = (e) => {
    const elem = e.target as HTMLDivElement;

    const diff = elem.scrollTop + elem.offsetHeight + 300 - elem.scrollHeight;

    if (diff > 0) fetchNextPage();
  };

  useEffect(() => {
    if (!inputRef.current) return;
    setWidth(`${content.length < 10 ? 10 : content.length}ch`);
  }, [content]);

  return (
    <Stack
      height="455px"
      maxHeight={`calc(100vh - ${headerHeight} - 10px)`}
      width="328px"
      bgcolor="darkAccent.main"
      sx={{ boxShadow: CARD_BOX_SHADOW }}
      borderRadius="5px"
      overflow="hidden"
      color="primaryText.main"
      justifyContent="space-between"
      onScroll={handlerFetchPeople}
    >
      <CreateConversationBoxHeader />

      <Stack
        direction="row"
        spacing="10px"
        px="15px"
        flex="1 1 auto"
        maxHeight="50%"
        sx={{ overflowY: 'auto' }}
      >
        <Typography fontSize="0.9375rem" mt="10px">
          To:
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          gap="6px"
          minWidth="0"
          alignItems="flex-start"
          alignContent="flex-start"
        >
          {members.map((item) => (
            <CreateConversationBoxMemberItem
              member={item}
              key={item.id}
              handleRemove={handleRemoveMember}
            />
          ))}

          <Box mt="10px">
            <Box
              component="input"
              type="text"
              sx={{ outline: 'none' }}
              bgcolor="unset"
              border="none"
              color="primaryText.main"
              fontSize="1rem"
              width={width}
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxWidth="100%"
            />
          </Box>
        </Box>
      </Stack>

      <Divider sx={{ my: '10px' }} />

      <Stack
        flex="100 1 auto"
        minWidth="0"
        px="8px"
        sx={{ overflowY: 'auto' }}
        alignContent="flex-start"
        alignItems="flex-start"
      >
        {people.map((item) => (
          <CreateConversationBoPeopleItem
            key={item.id}
            people={item}
            handleAddMember={handleAddMember}
          />
        ))}

        {isFetching && (
          <Center width="100%" height="100%">
            <CircularProgress />
          </Center>
        )}

        {!isFetching && !people.length && content && (
          <Center width="100%" height="100%">
            <Typography>No people found</Typography>
          </Center>
        )}
      </Stack>

      <MessageBoxAction
        isNewConversation={false}
        isCreateConversation
        stackProps={{ flex: '0 0 auto' }}
        userIds={members.map((item) => item.id)}
      />
    </Stack>
  );
};
