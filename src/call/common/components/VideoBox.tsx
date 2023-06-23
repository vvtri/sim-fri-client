import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { PeerInfo } from './CallScreen';

type VideoBoxProps = {
  peerInfo: PeerInfo;
};

export const VideoBox = ({ peerInfo }: VideoBoxProps) => {
  const { isMuteMic, isOffCamera, peer, socketId, user, cbAfterRender } =
    peerInfo;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream>();

  const avtUrl = user.profile.avatar?.url || emptyAvatarUrl;

  useEffect(() => {
    peer.on('stream', (stream) => {
      setStream(stream);
    });
    cbAfterRender?.();
  }, []);

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [ref.current, stream]);


  return (
    <Stack
      borderRadius="10px"
      height="100%"
      width="100%"
      sx={{ backgroundColor: 'white' }}
      position="relative"
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
    >
      <Stack
        position="absolute"
        top="10px"
        right="10px"
        bgcolor="darkAccent.main"
        spacing="10px"
        color="white"
        padding="8px"
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing="5px"
        >
          {isMuteMic ? <MicOff /> : <Mic />}
          {isOffCamera ? <VideocamOff /> : <Videocam />}
        </Stack>
        <Typography>{user.profile.name}</Typography>
      </Stack>

      {stream?.getVideoTracks()?.some((item) => item.enabled) ? (
        <Box
          display="block"
          component="video"
          autoPlay
          ref={ref}
          width="100%"
          height="100%"
        />
      ) : (
        <Box component="img" width="100%" height="100%" src={avtUrl} />
      )}
    </Stack>
  );
};
