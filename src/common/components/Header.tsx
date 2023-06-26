import { Notifications, Search } from '@mui/icons-material';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import { Box, CircularProgress, Stack } from '@mui/material';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import { shallowEqualArrays } from 'shallow-equal';
import { WS_MESSAGE_EVENT } from 'shared';
import { AuthControlPanel } from '../../auth/control-panel/components/AuthControlPanel';
import { useInfiniteConversation } from '../../message/common/hooks/use-infinite-conversation';
import { IGetListConversationRes } from '../../message/common/interfaces/res/conversation.res.interface';
import { ICreateConversationSocketRes } from '../../message/common/interfaces/res/conversation.socket.res.interface';
import { IConversation } from '../../message/common/models/conversation.model';
import { IMessage } from '../../message/common/models/message.model';
import { ListConversationPanel } from '../../message/conversation-panel/components/ListConversationPanel';
import { MessageBoxList } from '../../message/message-box/components/MessageBoxList';
import { useInfiniteNoti } from '../../noti/common/hooks/use-infinite-noti';
import { ListNotiPanel } from '../../noti/noti-panel/components/ListNotiPanel';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import {
  setViewImageUrl,
  viewImageUrlSelector,
} from '../../redux/slices/common.slice';
import {
  addConversationMessageBox,
  conversationListPanelSelector,
} from '../../redux/slices/message.slice';
import { setViewPost } from '../../redux/slices/post.slice';
import { searchTextSelector } from '../../redux/slices/search.slice';
import {
  AUDIO_PATH,
  QUERY_KEYS,
  headerHeight,
} from '../constants/index.constant';
import { useAuth } from '../hooks/use-auth';
import { useChatSocket } from '../hooks/use-chat-socket';
import { Center } from './utils/Center';
import { SearchInput } from './utils/SearchInput';

export const Header = () => {
  const [searchText, setSearchText] = useState('');
  const searchTextState = useAppSelector(searchTextSelector);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { userProfile, isLoading, avatarUrl } = useAuth();
  const messageIconRef = useRef<HTMLDivElement | null>(null);
  const avtIconRef = useRef<HTMLDivElement | null>(null);
  const notiIconRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { chatSocket } = useChatSocket();
  const { searchText: conversationSearchText } = useAppSelector(
    conversationListPanelSelector,
  );
  const {
    data: conversationData,
    afterReadLatestMsg,
    fetchNextPage,
    queryKey,
    afterReceivedMsg,
  } = useInfiniteConversation({
    searchText: conversationSearchText,
    limit: 21,
  });
  const {
    data: notiData,
    fetchNextPage: fetchNextPageNoti,
    afterMutateRead,
  } = useInfiniteNoti({
    limit: 20,
  });
  const imageUrl = useAppSelector(viewImageUrlSelector);
  const curRoute = useRouter().asPath;

  const closeImage = () => {
    dispatch(setViewImageUrl(undefined));
  };

  const conversations =
    conversationData?.pages.flatMap((page) => page.items) || [];

  let unreadConversation = 0;
  conversations.forEach((item) => {
    if (item.latestMessage?.user?.id === userProfile?.user.id) return;
    const isExisted = item.latestMessage?.messageUserInfos?.find(
      (item) => item.user.id === userProfile?.user.id,
    );
    if (isExisted) return;

    unreadConversation += 1;
  });

  const noties = notiData?.pages.flatMap((page) => page.items) || [];

  let unreadNoti = 0;
  noties.forEach((item) => {
    if (!item.readAt) unreadNoti += 1;
  });

  const handleSubmitSearch: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (searchText) {
      router.push(`/search?q=${searchText}`);
    }
  };

  useEffect(() => {
    setSearchText(searchTextState);
  }, [searchTextState]);

  useEffect(() => {
    dispatch(setViewPost({ isShow: false }));
  }, [curRoute]);

  useEffect(() => {
    if (!chatSocket) return;

    const handleNewConversation = (payload: ICreateConversationSocketRes) => {
      const { conversation, creatorId } = payload;

      queryClient.invalidateQueries([QUERY_KEYS.INFINITE_CONVERSATION]);
      queryClient.invalidateQueries([QUERY_KEYS.CONVERSATION_BY_USER]);

      if (creatorId === userProfile?.user.id) return;

      const audio = new Audio(AUDIO_PATH.RINGTONE);
      audio.play();
    };

    const handleNewMessage = async (newMessage: IMessage) => {
      await queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey.includes(QUERY_KEYS.LIST_CONVERSATION))
            return true;

          if (
            shallowEqualArrays(query.queryKey as any, [
              QUERY_KEYS.INFINITE_MESSAGE,
              newMessage.conversationId,
            ])
          ) {
            return true;
          }

          return false;
        },
      });

      const conversations =
        queryClient.getQueryData<InfiniteData<IGetListConversationRes>>(
          queryKey,
        );

      let conversation: IConversation | undefined = undefined;
      for (const page of conversations!.pages) {
        for (const item of page.items) {
          if (item.id === newMessage.conversationId) {
            conversation = item;
            break;
          }
        }
      }

      dispatch(
        addConversationMessageBox({ isNewConversation: false, conversation }),
      );
      afterReceivedMsg(newMessage);

      if (newMessage.user.id !== userProfile?.user.id) {
        const audio = new Audio(AUDIO_PATH.RINGTONE);
        audio.play();
      }
    };

    chatSocket.on(WS_MESSAGE_EVENT.CONVERSATION_CREATED, handleNewConversation);
    chatSocket.on(WS_MESSAGE_EVENT.MESSAGE_SENT, handleNewMessage);

    return () => {
      chatSocket.off(WS_MESSAGE_EVENT.CONVERSATION_CREATED);
      chatSocket.off(WS_MESSAGE_EVENT.MESSAGE_SENT);
    };
  }, [chatSocket]);

  return (
    <Stack
      position="sticky"
      bgcolor="#242526"
      top="0"
      left="0"
      borderBottom="1px solid #ffffff33"
      zIndex="10"
      height={headerHeight}
    >
      <Center width="100%" paddingY="10px" position="relative">
        <Stack
          direction="row"
          alignItems="center"
          spacing="10px"
          position="fixed"
          left="0"
          pl="20px"
        >
          <Link href="/">
            <Image
              src="/images/FullLogo_Transparent_NoBuffer.png"
              alt=""
              width="112"
              height="40"
            />
          </Link>

          <Box component="form" onSubmit={handleSubmitSearch}>
            <SearchInput
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: searchText ? null : (
                  <Search sx={{ mr: '6px' }} />
                ),
              }}
            />
          </Box>
        </Stack>

        {/* middle action */}
        <Stack
          width="220px"
          maxWidth="100%"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexGrow="1"
          >
            <Link href="/">
              <HomeIcon color="primary" sx={{ fontSize: '45px' }} />
            </Link>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexGrow="1"
          >
            <Link href="/friends">
              <GroupIcon color="primary" sx={{ fontSize: '45px' }} />
            </Link>
          </Box>
        </Stack>

        {/* right action */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing="10px"
          fontSize="40px"
          position="fixed"
          right="0"
          pr="20px"
        >
          <Center
            ref={messageIconRef}
            sx={{
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              bgcolor: 'comment.main',
              borderRadius: '50%',
              position: 'relative',
            }}
          >
            <MessageIcon
              sx={{ color: 'primaryText.main', width: '22px', height: '22px' }}
            />

            {!!unreadConversation && (
              <Center
                position="absolute"
                color="primaryText.main"
                bgcolor="red"
                fontSize="10px"
                top="0"
                right="0"
                borderRadius="50%"
                width="18px"
                height="18px"
                sx={{ transform: 'translate(20%,-20%)' }}
              >
                {unreadConversation}
              </Center>
            )}
          </Center>

          <Center
            sx={{
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              bgcolor: 'comment.main',
              borderRadius: '50%',
              position: 'relative',
            }}
            ref={notiIconRef}
          >
            <Notifications
              sx={{ color: 'primaryText.main', width: '22px', height: '22px' }}
            />

            {!!unreadNoti && (
              <Center
                position="absolute"
                color="primaryText.main"
                bgcolor="red"
                fontSize="10px"
                top="0"
                right="0"
                borderRadius="50%"
                width="18px"
                height="18px"
                sx={{ transform: 'translate(20%,-20%)' }}
              >
                {unreadNoti}
              </Center>
            )}
          </Center>
          <Box
            width={40}
            height={40}
            display="flex"
            alignItems="center"
            justifyContent="center"
            ref={avtIconRef}
          >
            {isLoading ? (
              <CircularProgress color="primary" size={35} />
            ) : (
              <Image
                src={avatarUrl}
                alt=""
                width="35"
                height="35"
                style={{ borderRadius: '50%', cursor: 'pointer' }}
              />
            )}
          </Box>
        </Stack>
      </Center>

      <MessageBoxList />
      <ListConversationPanel
        messageIconRef={messageIconRef}
        afterReadLatestMsg={afterReadLatestMsg}
        fetchMoreConversation={fetchNextPage}
        conversations={conversations}
      />
      <AuthControlPanel avtIconRef={avtIconRef} />
      <ListNotiPanel
        notiIconRef={notiIconRef}
        afterMutateReadNoti={afterMutateRead}
        fetchMoreConversation={fetchNextPageNoti}
        noties={noties}
      />

      {imageUrl && (
        <ReactSimpleImageViewer
          src={[imageUrl] as any}
          currentIndex={0}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={closeImage}
          backgroundStyle={{
            animation: 'createBox 0.09s',
            backgroundColor: 'rgba(0,0,0,.8)',
            paddingTop: '10vh',
            paddingBottom: '10vh',
          }}
        />
      )}
    </Stack>
  );
};
