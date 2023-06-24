import {
  AddCircle,
  AddPhotoAlternate,
  InsertEmoticon,
  Send,
} from '@mui/icons-material';
import { Box, IconButton, Popper, Stack, StackProps } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { EmojiClickData } from 'emoji-picker-react';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AudienceType, FileType, MessageType } from 'shared';
import { Center } from '../../../common/components/utils/Center';
import { EmojiPicker } from '../../../common/components/utils/EmojiPicker';
import { MultilineInput } from '../../../common/components/utils/MultilineInput';
import { uploadFileBuffer } from '../../../file/common/utils/upload-file.util';
import { IUserProfile } from '../../../profile/common/models/user-profile.model';
import { useAppDispatch } from '../../../redux/hook';
import { addConversationThunk } from '../../../redux/slices/message.slice';
import { useSendMessage } from '../../common/hooks/use-send-message';
import { IConversation } from '../../common/models/conversation.model';

type MessageBoxActionProps = {
  conversation?: IConversation;
  userIds?: number[];
  userProfile?: IUserProfile;
  isNewConversation: boolean;
  isCreateConversation?: boolean;
  stackProps?: StackProps;
};

export const MessageBoxAction = ({
  isNewConversation,
  conversation,
  userProfile,
  isCreateConversation,
  stackProps,
  userIds,
}: MessageBoxActionProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const isSendingMsgRef = useRef(false);
  const [content, setContent] = useState('');
  const emojiIconRef = useRef<HTMLDivElement | null>(null);
  const [emojiIconEle, setEmojiIconEle] = useState<HTMLElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const { mutate, isLoading: isSendingMsg } = useSendMessage({
    onSuccess(data, variables, context) {
      if (isNewConversation || isCreateConversation)
        dispatch(
          addConversationThunk({
            userId: userProfile?.user?.id,
            conversationId: data.conversationId,
            shouldCloseCreate: true,
          }),
        );
    },
    onError(error, variables, context) {
      console.log('error', error);
    },
  });
  const inputImgRef = useRef<HTMLInputElement | null>(null);

  const handleSendMessage = () => {
    const text = content?.trim();
    if (!text || isSendingMsgRef.current) return;
    if (!conversation && !userProfile && !userIds?.length) return;

    isSendingMsgRef.current = true;
    if (isCreateConversation) {
      mutate({
        content: text,
        type: MessageType.TEXT,
        userIds,
      });
    } else if (isNewConversation) {
      mutate({
        content: text,
        type: MessageType.TEXT,
        userIds: [userProfile!.user.id],
      });
    } else {
      mutate({
        content: text,
        type: MessageType.TEXT,
        conversationId: conversation!.id,
      });
      setContent('');
    }
  };

  const handleInputEnter: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUploadFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const image = e.target.files?.[0];
    if (!image || isSendingMsgRef.current) return;

    const fileType =
      FileType[image.name.split('.').pop() as FileType] || FileType.png;

    isSendingMsgRef.current = true;
    const file = await uploadFileBuffer(fileType, AudienceType.PUBLIC, image);

    if (isCreateConversation) {
      mutate({
        fileId: file.id,
        type: MessageType.IMAGE,
        userIds,
      });
    } else if (isNewConversation) {
      mutate({
        fileId: file.id,
        type: MessageType.IMAGE,
        userIds: [userProfile!.user.id],
      });
    } else {
      mutate({
        fileId: file.id,
        type: MessageType.IMAGE,
        conversationId: conversation?.id,
      });
    }
  };

  const handleClickImage = () => {
    if (!inputImgRef.current) return;

    inputImgRef.current.click();
  };

  const handleClickEmoji = (emoji: EmojiClickData, e: MouseEvent) => {
    setContent((old) => `${old}${emoji.emoji}`);
  };

  useEffect(() => {
    if (!isSendingMsgRef.current) return;

    isSendingMsgRef.current = isSendingMsg;
  }, [isSendingMsg]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as any;

      if (emojiIconRef.current?.contains(target)) {
        return setIsShowEmoji((old) => !old);
      }

      if (!emojiPickerRef.current?.contains(target)) {
        setIsShowEmoji(false);
      }
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  useEffect(() => {
    if (emojiIconRef.current) setEmojiIconEle(emojiIconRef.current);
  }, [emojiIconRef.current]);

  return (
    <Stack
      direction="row"
      paddingY="12px"
      paddingX="10px"
      spacing="10px"
      alignItems="center"
      {...stackProps}
    >
      <IconButton sx={{ width: '20px', height: '20px' }} color="primary">
        <AddCircle />
      </IconButton>
      {!content && (
        <IconButton
          sx={{ width: '20px', height: '20px' }}
          color="primary"
          onClick={handleClickImage}
        >
          <AddPhotoAlternate />
        </IconButton>
      )}
      <Stack
        flexGrow="1"
        bgcolor="comment.main"
        borderRadius="20px"
        minWidth="0"
        justifyContent="space-between"
        direction="row"
        alignItems="center"
      >
        <Box m="6px 10px 5px 12px">
          <MultilineInput
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleInputEnter}
            placeholder="Aa"
          />
        </Box>

        <Center
          sx={{
            width: '29px',
            height: '29px',
            borderRadius: '50%',
            '&:hover': { backgroundColor: 'hoverColor.main' },
            cursor: 'pointer',
            position: 'relative',
            color: 'primary.main',
            mr: '8px',
            flexShrink: '0',
          }}
          ref={emojiIconRef}
        >
          <InsertEmoticon sx={{ width: '20px', height: '20px' }} />
        </Center>

        <Popper
          open={!!emojiIconEle}
          sx={{ zIndex: '1400' }}
          anchorEl={emojiIconEle}
          placement="top-end"
          modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
        >
          <EmojiPicker
            ref={emojiPickerRef}
            emojiProps={{ onEmojiClick: handleClickEmoji }}
            boxProps={{
              sx: {
                display: isShowEmoji ? 'block' : 'none',
              },
            }}
          />
        </Popper>
      </Stack>

      <Box
        component="input"
        ref={inputImgRef}
        type="file"
        display="none"
        accept="image/*"
        onChange={handleUploadFile}
      />

      {/* {content ? (
        <IconButton
          sx={{ width: '20px', height: '20px' }}
          color="primary"
          onClick={handleSendMessage}
        >
          <Send />
        </IconButton>
      ) : (
        <IconButton sx={{ width: '20px', height: '20px' }} color="primary">
          <ThumbUp />
        </IconButton>
      )} */}
      <IconButton
        sx={{ width: '20px', height: '20px' }}
        color={
          content?.trim() && (!conversation || !userProfile || !userIds?.length)
            ? 'primary'
            : 'secondaryText'
        }
        onClick={handleSendMessage}
      >
        <Send sx={{ width: '20px', height: '20px' }} />
      </IconButton>
    </Stack>
  );
};
