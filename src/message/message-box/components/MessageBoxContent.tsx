import { CircularProgress, Stack } from '@mui/material';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef } from 'react';
import { MessageType } from 'shared';
import { Center } from '../../../common/components/utils/Center';
import { useAuth } from '../../../common/hooks/use-auth';
import { IUserProfile } from '../../../profile/common/models/user-profile.model';
import {
  genInfiniteMessageQueryKey,
  useInfiniteMessage,
} from '../../common/hooks/use-infinite-message';
import {
  IGetListMessageRes,
  IReadMessageRes,
} from '../../common/interfaces/res/message.res.interface';
import { IConversation } from '../../common/models/conversation.model';
import { IMessageUserInfo } from '../../common/models/message-user-info.model';
import { IMessage } from '../../common/models/message.model';
import { MessageBoxMessageCall } from './MessageBoxMessageLineCall';
import { MessageBoxMessageLineImage } from './MessageBoxMessageLineImage';
import { MessageBoxMessageLineSystem } from './MessageBoxMessageLineSystem';
import { MessageBoxMessageLineText } from './MessageBoxMessageLineText';
import { MessageBoxStartContent } from './MessageBoxStartContent';

function handleMapMessages(
  messages: IMessage[],
  userProfile: IUserProfile,
  conversation: IConversation,
  afterMutateMsg: (data: IMessageUserInfo, message: IMessage) => any,
) {
  const { conversationMembers, id } = conversation;

  const result: any[] = [];
  let lastDate: Dayjs | undefined = undefined;

  for (const [idx, message] of messages.entries()) {
    const shouldShowReaders = idx === 0;
    const isLatestMsg = idx === messages.length - 1;
    let component: any;

    switch (message.type) {
      case MessageType.TEXT:
        component = (
          <MessageBoxMessageLineText
            isGroup={conversation.isGroup}
            key={message.id}
            message={message}
            conversationMembers={conversationMembers}
            shouldDisplayReadUsers={shouldShowReaders}
            afterMutateMsg={afterMutateMsg}
          />
        );
        break;

      case MessageType.CALL:
        component = (
          <MessageBoxMessageCall
            key={message.id}
            message={message}
            conversationMembers={conversationMembers}
            shouldDisplayReadUsers={shouldShowReaders}
            isGroup={conversation.isGroup}
            afterMutateMsg={afterMutateMsg}
          />
        );
        break;

      case MessageType.SYSTEM:
        component = (
          <MessageBoxMessageLineSystem
            key={message.id}
            content={message.content}
            message={message}
            conversationMembers={conversationMembers}
          />
        );
        break;

      case MessageType.IMAGE:
        component = (
          <MessageBoxMessageLineImage
            conversationMembers={conversationMembers}
            isGroup={conversation.isGroup}
            message={message}
            key={message.id}
            shouldDisplayReadUsers={shouldShowReaders}
            afterMutateMsg={afterMutateMsg}
          />
        );
        break;

      default:
        break;
    }

    result.push(component);

    let isHaveDate = false;

    if (lastDate && !lastDate.isSame(message.createdAt, 'date')) {
      isHaveDate = true;
      const formatContent = dayjs(message.createdAt).format(
        'DD MMM YYYY, HH:mm',
      );

      result.push(
        <MessageBoxMessageLineSystem
          key={lastDate.unix()}
          py="10px"
          content={formatContent}
        />,
      );
    }

    lastDate = dayjs(message.createdAt);

    if (isLatestMsg && lastDate && !isHaveDate) {
      lastDate = dayjs(message.createdAt);
      const formatContent = dayjs(message.createdAt).format(
        'DD MMM YYYY, HH:mm',
      );

      result.push(
        <MessageBoxMessageLineSystem
          key={lastDate.unix()}
          py="10px"
          content={formatContent}
        />,
      );
    }
  }

  return result;
}

type MessageBoxContentProps = {
  conversation?: IConversation;
  userProfile?: IUserProfile;
  isNewConversation: boolean;
};

export const MessageBoxContent = ({
  conversation,
  isNewConversation,
  userProfile,
}: MessageBoxContentProps) => {
  const queryClient = useQueryClient();
  const { id } = conversation || {};
  const { userProfile: authProfile } = useAuth();
  const { data, isFetching, fetchNextPage, isRefetching } = useInfiniteMessage(
    id as any,
    !isNewConversation,
  );
  const ref = useRef<HTMLDivElement | null>(null);

  const messages = data?.pages.flatMap((item) => item.items) || [];

  useEffect(() => {
    if (!ref.current) return;

    const elem = ref.current;
    elem.scrollTop = elem.scrollHeight;

    const handleScrollUp = (e: any) => {
      const scrollTop = Math.abs(elem.scrollTop);
      const offsetHeight = Math.abs(elem.offsetHeight);
      const scrollHeight = Math.abs(elem.scrollHeight);
      const diff = scrollTop + offsetHeight - scrollHeight;
      if (diff > -100) fetchNextPage();
    };

    elem.addEventListener('scroll', handleScrollUp);
    return () => {
      elem.removeEventListener('scroll', handleScrollUp);
    };
  }, [ref.current]);

  const afterMutateMsg = (msgUserInfo: IReadMessageRes, message: IMessage) => {
    queryClient.setQueryData<InfiniteData<IGetListMessageRes>>(
      genInfiniteMessageQueryKey(id as any),
      (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const newData = structuredClone(oldData);

        for (const page of newData.pages) {
          for (const item of page.items) {
            if (item.id === message.id) {
              item.messageUserInfos = item.messageUserInfos.filter(
                (item) => item.id === msgUserInfo.id,
              );
              item.messageUserInfos.push(msgUserInfo);
              return newData;
            }
          }
        }

        return newData;
      },
    );
  };

  return (
    <Stack
      flexGrow="1"
      overflow="auto"
      position="relative"
      paddingX="10px"
      spacing="8px"
      direction="column-reverse"
      ref={ref}
    >
      {!isNewConversation &&
        handleMapMessages(
          messages,
          authProfile as any,
          conversation as any,
          afterMutateMsg,
        )}

      <MessageBoxStartContent
        conversation={conversation}
        isNewConversation={isNewConversation}
        userProfile={userProfile}
      />

      {isRefetching && (
        <Center width="100%" height="100%">
          <CircularProgress />
        </Center>
      )}
    </Stack>
  );
};
