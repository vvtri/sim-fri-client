import { InsertEmoticon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  FormControl,
  IconButton,
  ImageList,
  ImageListItem,
  InputBase,
  MenuItem,
  Popper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { EmojiClickData } from 'emoji-picker-react';
import Image from 'next/image';
import {
  ChangeEventHandler,
  ClipboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { AudienceType } from 'shared';
import FormProvider from '../../../common/components/hook-forms/FormProvider';
import { Center } from '../../../common/components/utils/Center';
import { EmojiPicker } from '../../../common/components/utils/EmojiPicker';
import { useAuth } from '../../../common/hooks/use-auth';
import { SavePostState } from '../../../redux/slices/post.slice';
import { ISavePostForm } from '../schemas/save-post.schema';

type SavePostFormProps = {
  data: SavePostState;
  onSave: (data: ISavePostForm) => any;
  isSaving: boolean;
  addImage: (url: string) => any;
  removeImage: (url: string) => any;
  isCreate: boolean;
  methods: UseFormReturn<ISavePostForm, any>;
};

export default function SavePostForm({
  addImage,
  data,
  removeImage,
  isCreate,
  onSave,
  isSaving,
  methods,
}: SavePostFormProps) {
  const { userProfile: user, avatarUrl } = useAuth();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isShowEmojiPickerPanel, setIsShowEmojiPickerPanel] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const { register, control, formState, handleSubmit, setValue, getValues } =
    methods;

  const handleAddImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      addImage(url);
    }
  };

  const handleRemoveImage = (url: string) => {
    removeImage(url);
  };

  const handleSavePost: Parameters<typeof handleSubmit>[0] = async (
    value,
    e,
  ) => {
    if (isSaving) return;
    onSave({ ...value });
  };

  const handleClickEmoji = (emoji: EmojiClickData, e: MouseEvent) => {
    setValue('content', getValues('content') + emoji.emoji);
  };

  const pasteHandler = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;

    for (const item of items) {
      if (item.type.indexOf('image') !== 0) continue;

      const blob = item.getAsFile();
      if (!blob) continue;
      const url = URL.createObjectURL(blob);
      addImage(url);
    }
  };

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as any;

      if (anchorRef.current?.contains(target)) {
        return setIsShowEmojiPickerPanel((old) => !old);
      }

      if (!emojiPickerRef.current?.contains(target)) {
        setIsShowEmojiPickerPanel(false);
      }
    };

    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, []);

  useEffect(() => {
    if (anchorRef.current) setAnchorEl(anchorRef.current);
  }, [anchorRef.current]);

  return (
    <Box padding="20px">
      <FormProvider methods={methods} onSubmit={handleSubmit(handleSavePost)}>
        <Stack direction="row" spacing="10px" alignItems="center">
          <Avatar src={avatarUrl} />
          <Stack>
            <Typography fontSize="0.9375rem" fontWeight="600">
              {user?.name}
            </Typography>
            <Select
              variant="standard"
              defaultValue={AudienceType.PUBLIC}
              sx={{
                color: 'white',
                fontSize: '0.85rem',
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
              {...register('audienceType')}
            >
              <MenuItem value={AudienceType.PUBLIC}>Public</MenuItem>
              <MenuItem value={AudienceType.FRIEND}>Friend</MenuItem>
              <MenuItem value={AudienceType.ONLY_ME}>Only me</MenuItem>
            </Select>
          </Stack>
        </Stack>

        <Box mt="20px">
          <FormControl fullWidth>
            <InputBase
              multiline
              sx={{ outline: 'none', bgcolor: 'unset', color: 'inherit' }}
              fullWidth
              inputProps={{
                onPaste: pasteHandler,
              }}
              {...register('content')}
            />
          </FormControl>
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="6px"
          border="1px solid #3E4042"
          mt="20px"
          padding="14px"
        >
          <Typography sx={{ cursor: 'default' }}>Add to your post</Typography>
          <Stack direction="row" alignItems="center">
            <Box component="label">
              <IconButton
                sx={{
                  width: '36px',
                  height: '36px',
                  '&:hover': { backgroundColor: 'hoverColor.main' },
                }}
                onClick={(e) => fileRef.current?.click()}
              >
                <Image
                  width={24}
                  height={24}
                  src="/images/photo-icon.png"
                  alt=""
                />
                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAddImage}
                />
              </IconButton>
            </Box>

            <Center
              sx={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                '&:hover': { backgroundColor: 'hoverColor.main' },
                cursor: 'pointer',
                color: '#f7b928',
                position: 'relative',
              }}
              ref={anchorRef}
            >
              <InsertEmoticon />
            </Center>

            <Popper
              open={!!anchorEl}
              sx={{ zIndex: '1400' }}
              anchorEl={anchorEl}
              placement="top"
              modifiers={[{ name: 'offset', options: { offset: [0, 20] } }]}
              ref={emojiPickerRef}
            >
              <EmojiPicker
                emojiProps={{ onEmojiClick: handleClickEmoji }}
                boxProps={{
                  sx: {
                    display: isShowEmojiPickerPanel ? 'block' : 'none',
                  },
                }}
              />
            </Popper>
          </Stack>
        </Stack>

        <ImageList cols={2} rowHeight={150}>
          {data.images.map((item, idx) => (
            <ImageListItem key={item.url} sx={{ position: 'relative' }}>
              <IconButton
                color="primary"
                sx={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'darkAccent.main',
                  color: 'secondaryText.main',
                  padding: '4px',
                  '&:hover': { backgroundColor: 'darkAccent.main' },
                }}
                onClick={() => handleRemoveImage(item.url)}
              >
                <CloseIcon />
              </IconButton>
              <img src={item.url} height="100%" />
            </ImageListItem>
          ))}
        </ImageList>

        <LoadingButton
          disabled={isSaving}
          loading={isSaving}
          variant="contained"
          fullWidth
          type="submit"
          color={formState.isValid ? 'primary' : 'secondaryButton'}
          sx={{
            mt: '16px',
            cursor: formState.isValid ? 'pointer' : 'not-allowed',
          }}
        >
          {isCreate ? 'Post' : 'Save'}
        </LoadingButton>
      </FormProvider>
    </Box>
  );
}
