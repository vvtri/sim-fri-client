import { Send } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';
import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
} from '@mui/material';
import { EmojiClickData } from 'emoji-picker-react';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from 'react';
import { MultilineInput } from '../../../common/components/utils/MultilineInput';
import { addSnackBar } from '../../../common/utils/snackbar.util';
import { IComment } from '../models/comment.model';
import { SaveCommentFormAction } from './SaveCommentFormAction';

export type SaveCommentParams = {
  content: string;
  files: { id?: number; url: string }[];
};

export type SaveCommentBoxProps = {
  comment?: IComment;
  saveComment: (params: SaveCommentParams) => any;
  isSavingComment: boolean;
  isActive?: boolean;
};

export const SaveCommentForm = ({
  saveComment,
  comment,
  isSavingComment,
  isActive: parentIsActive,
}: SaveCommentBoxProps) => {
  const [content, setContent] = useState(comment?.content || '');
  const [images, setImages] = useState<{ id?: number; url: string }[]>(
    comment?.commentFiles.map((item) => ({
      id: item.fileId,
      url: item.file.url,
    })) || [],
  );
  const [isActive, setIsActive] = useState(!!parentIsActive);
  const inputRef1 = useRef<HTMLInputElement | null>(null);

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setImages((images) => [...images, { url }]);
      e.target.value = '';
    }
  };

  const handleSaveComment = async () => {
    try {
      await saveComment({ content, files: images });
      setContent('');
      setImages([]);
      if (comment)
        addSnackBar({
          variant: 'success',
          message: 'Edit comment succeeded',
        });
      else
        addSnackBar({
          variant: 'success',
          message: 'Create comment succeeded',
        });
    } catch (error) {
      console.log('error', error);
      if (comment)
        addSnackBar({ variant: 'success', message: 'Edit comment failed' });
      else
        addSnackBar({ variant: 'success', message: 'Create comment failed' });
    }
  };
  const handleClickEmoji = (emoji: EmojiClickData, e: MouseEvent) => {
    setContent((old) => `${old}${emoji.emoji}`);
  };

  const handleEnterComment: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveComment();
    }
  };

  return (
    <Stack width="100%">
      <Stack
        width="100%"
        bgcolor="comment.main"
        borderRadius="20px"
        overflow="hidden"
        ml="8px"
      >
        <Stack flexGrow="1" direction="row" alignItems="center" ml="10px">
          <Box
            sx={{
              '& *::placeholder': {
                color: 'secondaryText.main',
                fontSize: '0.9375rem',
                fontWeight: 400,
              },
              flexGrow: 1,
            }}
          >
            <MultilineInput
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write an answer..."
              color="secondaryText.main"
              style={{ height: 20, marginLeft: '4px' }}
              onKeyDown={handleEnterComment}
              onFocus={() => setIsActive(true)}
            />
          </Box>

          <SaveCommentFormAction
            handleClickEmoji={handleClickEmoji}
            handleUploadImage={handleUploadImage}
          />
        </Stack>

        <Collapse in={isActive}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <SaveCommentFormAction
              handleClickEmoji={handleClickEmoji}
              handleUploadImage={handleUploadImage}
            />

            <IconButton
              color={content ? 'primary' : 'secondaryText'}
              sx={{
                flexShrink: 0,
                cursor: 'pointer',
                '&.MuiButtonBase-root.Mui-disabled.MuiIconButton-root': {
                  color: 'secondaryText.main',
                },
              }}
              onClick={handleSaveComment}
              disabled={!content}
            >
              {isSavingComment ? (
                <CircularProgress size="18px" />
              ) : (
                <Send sx={{ width: '18px', height: '18px' }} />
              )}
            </IconButton>
          </Stack>
        </Collapse>
      </Stack>

      <Box
        display="flex"
        width="100%"
        gap="10px"
        flexWrap="wrap"
        mb={images.length && '20px'}
        mt={images.length && '20px'}
      >
        {images.map((item) => (
          <Box
            key={item.url}
            position="relative"
            height="100px"
            width="fit-content"
            maxWidth="100%"
          >
            <Box
              component="img"
              src={item.url}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                bgcolor: 'darkAccent.main',
              }}
              disableRipple
              size="small"
              onClick={() =>
                setImages((oldData) =>
                  oldData.filter((oldDataItem) => oldDataItem !== item),
                )
              }
            >
              <Close
                color="secondaryText"
                sx={{ width: '20px', height: '20px' }}
              />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};
