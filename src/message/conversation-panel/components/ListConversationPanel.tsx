import { Box, Typography } from '@mui/material';
import { MutableRefObject, UIEventHandler, useEffect, useRef } from 'react';
import { Center } from '../../../common/components/utils/Center';
import {
  CARD_BOX_SHADOW,
  headerHeight,
} from '../../../common/constants/index.constant';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  conversationListPanelSelector,
  setConversationListPanelIsShow,
  toggleConversationListPanelIsShow,
} from '../../../redux/slices/message.slice';
import { IConversation } from '../../common/models/conversation.model';
import {
  ListConversationItem,
  ListConversationItemProps,
} from './ListConversationItem';
import { ListConversationPanelHeader } from './ListConversationPanelHeader';

type ListConversationPanelProps = {
  messageIconRef: MutableRefObject<HTMLDivElement | null>;
  conversations: IConversation[];
  fetchMoreConversation: () => any;
  afterReadLatestMsg: ListConversationItemProps['afterReadLatestMsg'];
};

export const ListConversationPanel = ({
  messageIconRef,
  conversations,
  fetchMoreConversation,
  afterReadLatestMsg,
}: ListConversationPanelProps) => {
  const dispatch = useAppDispatch();
  const { isShow } = useAppSelector(conversationListPanelSelector);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handlerFetchConversations: UIEventHandler<HTMLDivElement> = (e) => {
    const elem = e.target as HTMLDivElement;

    const diff = elem.scrollTop + elem.offsetHeight + 300 - elem.scrollHeight;

    if (diff > 0) fetchMoreConversation();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as any;

      if (messageIconRef.current?.contains(target)) {
        return dispatch(toggleConversationListPanelIsShow());
      }

      if (!panelRef.current?.contains(target)) {
        return dispatch(setConversationListPanelIsShow(false));
      }
    };
    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  return (
    <Box
      position="fixed"
      zIndex="100"
      sx={{
        top: headerHeight,
        right: '20px',
        backgroundColor: 'darkAccent.main',
        boxShadow: CARD_BOX_SHADOW,
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        overflowY: 'auto',
      }}
      maxWidth="360px"
      width="100%"
      maxHeight={`calc(100% - ${headerHeight} - 10px)`}
      padding="10px"
      color="white"
      ref={panelRef}
      display={isShow ? 'block' : 'none'}
      onScroll={handlerFetchConversations}
    >
      <ListConversationPanelHeader />

      {!conversations.length && (
        <Center py="15px">
          <Typography>You don't have any conversation</Typography>
        </Center>
      )}

      {conversations.map((item) => (
        <ListConversationItem
          key={item.id}
          conversation={item}
          afterReadLatestMsg={afterReadLatestMsg}
        />
      ))}
    </Box>
  );
};
