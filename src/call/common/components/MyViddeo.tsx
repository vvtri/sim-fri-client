import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from '@mui/icons-material';
import { Box, IconButton, Stack } from '@mui/material';
import { MouseEventHandler, forwardRef } from 'react';

type MyVideoProps = {
  isMuteMic: boolean;
  isOffCamera: boolean;
  handleLeaveCall?: MouseEventHandler<HTMLButtonElement>;
  handleToggleMic?: MouseEventHandler<HTMLButtonElement>;
  handleToggleCamera?: MouseEventHandler<HTMLButtonElement>;
};

export const MyVideo = forwardRef<HTMLVideoElement | null, MyVideoProps>(
  (props, ref) => {
    const {
      handleLeaveCall,
      handleToggleMic,
      handleToggleCamera,
      isMuteMic,
      isOffCamera,
    } = props;

    return (
      <Stack
        direction="row"
        width="100%"
        justifyContent="center"
        alignItems="center"
        height="180px"
        spacing="6px"
        position="relative"
        flexShrink="0"
        mt="10px"
      >
        <IconButton
          sx={{ height: 'fit-content' }}
          color="_white"
          onClick={handleToggleMic}
        >
          {isMuteMic ? (
            <MicOff sx={{ width: '30px', height: '30px' }} />
          ) : (
            <Mic sx={{ width: '30px', height: '30px' }} />
          )}
        </IconButton>
        <IconButton
          sx={{ height: 'fit-content' }}
          color="_white"
          onClick={handleToggleCamera}
        >
          {isOffCamera ? (
            <VideocamOff sx={{ width: '30px', height: '30px' }} />
          ) : (
            <Videocam sx={{ width: '30px', height: '30px' }} />
          )}
        </IconButton>
        <IconButton
          sx={{
            height: 'fit-content',
            '&.MuiIconButton-root': { bgcolor: 'red' },
          }}
          color="_white"
          onClick={handleLeaveCall}
        >
          <CallEnd sx={{ width: '30px', height: '30px' }} />
        </IconButton>

        <Box
          position="absolute"
          right="10px"
          bottom="0"
          height="100%"
          width="266px"
          borderRadius="10px"
          overflow="hidden"
        >
          <Box
            component="video"
            width="100%"
            height="100%"
            autoPlay
            ref={ref}
          />
        </Box>
      </Stack>
    );
  },
);

MyVideo.displayName = 'MyVideo'