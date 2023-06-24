import { Box, BoxProps } from '@mui/material';
import { EmojiStyle, Props, Theme } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { fontFamily } from '../../constants/index.constant';

const EmojiPickerReact = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false },
);

type EmojiPickerProps = {
  boxProps?: BoxProps;
  emojiProps?: Props;
};

export const EmojiPicker = forwardRef<HTMLDivElement, EmojiPickerProps>(
  ({ boxProps, emojiProps }: EmojiPickerProps, ref) => {
    const sxBoxProps = boxProps?.sx;
    delete boxProps?.sx;

    return (
      <Box
        fontSize="0.875rem"
        ref={ref}
        sx={{
          '.EmojiPickerReact *': { fontFamily: `${fontFamily}!important` },
          '.EmojiPickerReact': {
            '--epr-emoji-size': '25px',
          },
          '.epr-preview .__EmojiPicker__': {
            fontSize: '35px !important',
          },
          ...sxBoxProps,
        }}
        {...boxProps}
      >
        <EmojiPickerReact
          emojiStyle={EmojiStyle.NATIVE}
          skinTonesDisabled
          searchDisabled
          theme={Theme.DARK}
          height={350}
          {...emojiProps}
        />
      </Box>
    );
  },
);

EmojiPicker.displayName = 'EmojiPicker';
