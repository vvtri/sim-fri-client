import { CameraAltOutlined, InsertEmoticon } from '@mui/icons-material';
import { Box, IconButton, Popper, Stack } from '@mui/material';
import { StackProps } from '@mui/system';
import { EmojiClickData } from 'emoji-picker-react';
import {
  ChangeEventHandler,
  MouseEventHandler,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Center } from '../../../common/components/utils/Center';
import { EmojiPicker } from '../../../common/components/utils/EmojiPicker';

type ImageIconProps = {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const ImageIcon = forwardRef<HTMLInputElement, ImageIconProps>(
  ({ onChange, onClick }, ref) => (
    <IconButton color="secondaryText" sx={{ flexShrink: 0 }} onClick={onClick}>
      <CameraAltOutlined
        sx={{ display: 'block', width: '18px', height: '18px' }}
      />

      <input
        ref={ref}
        type="file"
        hidden
        accept="image/*"
        onChange={onChange}
      />
    </IconButton>
  ),
);

ImageIcon.displayName = 'ImageIcon';

type SaveCommentFormActionProps = {
  handleClickEmoji: (emoji: EmojiClickData, e: MouseEvent) => any;
  handleUploadImage: ChangeEventHandler<HTMLInputElement>;
  stackProps?: StackProps;
};

export const SaveCommentFormAction = ({
  handleClickEmoji,
  handleUploadImage,
  stackProps,
}: SaveCommentFormActionProps) => {
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const emojiIconRef = useRef<HTMLDivElement | null>(null);
  const [emojiIconEle, setEmojiIconEle] = useState<HTMLElement | null>(null);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

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
    if (emojiIconRef.current) {
      setEmojiIconEle(emojiIconRef.current);
    }
  }, [emojiIconRef.current]);

  return (
    <Stack direction="row" alignItems="center" ml="4px" {...stackProps}>
      <Box>
        <Center
          sx={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            '&:hover': { backgroundColor: 'hoverColor.main' },
            cursor: 'pointer',
            position: 'relative',
            color: 'secondaryText.main',
          }}
          ref={emojiIconRef}
        >
          <InsertEmoticon sx={{ width: '18px', height: '18px' }} />
        </Center>
      </Box>

      <Popper
        open={!!emojiIconEle}
        sx={{ zIndex: '1400' }}
        anchorEl={emojiIconEle}
        placement="top-end"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [20, 0],
            },
          },
        ]}
      >
        <EmojiPicker
          ref={emojiPickerRef}
          emojiProps={{ onEmojiClick: handleClickEmoji }}
          boxProps={{
            sx: { display: isShowEmoji ? 'block' : 'none' },
          }}
        />
      </Popper>

      <ImageIcon
        ref={inputRef2}
        onChange={handleUploadImage}
        onClick={() => inputRef2.current?.click()}
      />
    </Stack>
  );
};
