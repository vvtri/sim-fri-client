import { InsertEmoticon, MoreVert, Reply } from '@mui/icons-material';
import { IconButton, Stack, StackProps } from '@mui/material';

type MessageBoxMessageLineIconProps = StackProps & {};

export const MessageBoxMessageLineActionIcon = ({
  ...rest
}: MessageBoxMessageLineIconProps) => {
  return (
    <Stack
      direction="row"
      width="74px"
      justifyContent="space-between"
      {...rest}
    >
      <IconButton color="primaryIcon" sx={{ width: '22px', height: '22px' }}>
        <MoreVert sx={{ fontSize: '20px' }} />
      </IconButton>
      <IconButton color="primaryIcon" sx={{ width: '22px', height: '22px' }}>
        <Reply sx={{ fontSize: '20px' }} />
      </IconButton>
      <IconButton color="primaryIcon" sx={{ width: '22px', height: '22px' }}>
        <InsertEmoticon sx={{ fontSize: '20px' }} />
      </IconButton>
    </Stack>
  );
};
