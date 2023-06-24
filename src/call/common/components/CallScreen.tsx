import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { WS_MESSAGE_EVENT } from 'shared';
import { Instance } from 'simple-peer';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { useCallSocket } from '../../../common/hooks/use-call-socket';
import { useGetDetailConversation } from '../../../message/common/hooks/use-get-detail-conversation';
import {
  joinedRoomHandler,
  newUserJoinedHandler,
  receiveReturnSignalHandler,
  toggleCameraHandler,
  toggleMicHandler,
  userLeftRoomHandler,
} from '../handlers/call.handler';
import {
  IJoinRoomCallReqDto,
  IToggleCameraCallReqDto,
  IToggleMicCallReqDto,
} from '../interfaces/req/call.req.interface';
import { ICallJoinerInfo } from '../models/call-joiner-info.model';
import { InvalidCallDialog } from './InvalidCallDialog';
import { LeaveCallDialog } from './LeaveCallDialog';
import { MyVideo } from './MyViddeo';
import { VideoBox } from './VideoBox';

export type PeerInfo = {
  peer: Instance;
  cbAfterRender?: () => any;
} & ICallJoinerInfo;

export type PeerRef = {
  peer: Instance;
  socketId: string;
};

type CallScreenProps = {
  conversationId: string;
  roomId: string;
};

export const CallScreen = ({ conversationId, roomId }: CallScreenProps) => {
  const { callSocket, isConnected } = useCallSocket();
  const { userProfile } = useAuth();
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const [peerInfos, setPeerInfos] = useState<PeerInfo[]>([]);
  const peersRef = useRef<PeerRef[]>([]);
  const router = useRouter();
  const [isInvalidCall, setIsInvalidCall] = useState(false);
  const [isLeftCall, setIsLeftCall] = useState(false);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [isMuteMic, setIsMuteMic] = useState(false);
  const [isOffCamera, setIsOffCamera] = useState(false);
  const { data: conversation, isFetching } = useGetDetailConversation(
    Number(conversationId),
  );

  const isConversationGroup = conversation && conversation.isGroup;
  const calledUser =
    !isConversationGroup &&
    conversation?.conversationMembers.find(
      (item) => item.user.id !== userProfile?.user.id,
    );

  useEffect(() => {
    if (!isConnected) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setMyStream(stream);

        callSocket.on(
          WS_MESSAGE_EVENT.JOINED_ROOM,
          joinedRoomHandler({ stream, callSocket, peersRef, setPeerInfos }),
        );

        callSocket.on(
          WS_MESSAGE_EVENT.NEW_USER_JOINED,
          newUserJoinedHandler({ stream, callSocket, peersRef, setPeerInfos }),
        );

        callSocket.on(
          WS_MESSAGE_EVENT.RECEIVE_RETURN_SIGNAL,
          receiveReturnSignalHandler({ peersRef }),
        );

        callSocket.on(WS_MESSAGE_EVENT.INVALID_CALL, () => {
          setIsInvalidCall(true);
          setMyStream(null);
        });

        callSocket.on(
          WS_MESSAGE_EVENT.USER_LEFT_ROOM,
          userLeftRoomHandler({ peersRef, setPeerInfos }),
        );

        callSocket.on(
          WS_MESSAGE_EVENT.TOGGLE_MIC,
          toggleMicHandler({ setPeerInfos }),
        );

        callSocket.on(
          WS_MESSAGE_EVENT.TOGGLE_CAMERA,
          toggleCameraHandler({ setPeerInfos }),
        );

        const reqData: IJoinRoomCallReqDto = { roomId };
        callSocket.emit(WS_MESSAGE_EVENT.JOIN_ROOM, reqData);
      });

    return () => {
      if (!isConnected) return;

      callSocket.off(WS_MESSAGE_EVENT.JOINED_ROOM);
      callSocket.off(WS_MESSAGE_EVENT.NEW_USER_JOINED);
      callSocket.off(WS_MESSAGE_EVENT.RECEIVE_RETURN_SIGNAL);
      callSocket.off(WS_MESSAGE_EVENT.USER_LEFT_ROOM);
      callSocket.off(WS_MESSAGE_EVENT.TOGGLE_MIC);
      callSocket.off(WS_MESSAGE_EVENT.TOGGLE_CAMERA);
    };
  }, [callSocket, isConnected]);

  useEffect(() => {
    const video = myVideoRef.current;
    if (!video) return;
    if (myStream) video.srcObject = myStream;
    else video.srcObject = null;
  }, [myVideoRef.current, myStream]);

  const handleLeaveCall = () => {
    setIsLeftCall(true);
    callSocket.disconnect();
    peersRef.current.forEach((item) => item.peer.destroy());
    setPeerInfos([]);

    if (myStream) {
      myStream.getVideoTracks().forEach((item) => item.stop());
      myStream.getAudioTracks().forEach((item) => item.stop());
    }
  };

  const colCount = Math.ceil(Math.sqrt(peerInfos.length));
  const rowCount = Math.floor(
    peerInfos.length / Math.ceil(Math.sqrt(peerInfos.length)),
  );

  const handleToggleMic = () => {
    const currentMuteMicStatus = !isMuteMic;
    const req: IToggleMicCallReqDto = { isMuteMic: currentMuteMicStatus };
    callSocket.emit(WS_MESSAGE_EVENT.TOGGLE_MIC, req);
    setIsMuteMic(currentMuteMicStatus);
    if (!myStream) return;

    if (currentMuteMicStatus) {
      myStream.getAudioTracks().forEach((item) => {
        item.enabled = false;
      });
    } else {
      myStream.getAudioTracks().forEach((item) => {
        item.enabled = true;
      });
    }
  };

  const handleToggleCamera = () => {
    const currentOffCameraStatus = !isOffCamera;
    const req: IToggleCameraCallReqDto = {
      isOffCamera: currentOffCameraStatus,
    };
    callSocket.emit(WS_MESSAGE_EVENT.TOGGLE_CAMERA, req);
    setIsOffCamera(currentOffCameraStatus);
    if (!myStream) return;

    if (currentOffCameraStatus) {
      myStream.getVideoTracks().forEach((item) => {
        item.enabled = false;
      });
    } else {
      myStream.getVideoTracks().forEach((item) => {
        item.enabled = true;
      });
    }
  };

  return (
    <Stack
      position="fixed"
      top="0"
      right="0"
      width="100%"
      height="100vh"
      bgcolor="black"
      justifyContent="space-between"
      padding="10px"
      overflow="hidden"
    >
      <InvalidCallDialog isOpen={isInvalidCall} />
      <LeaveCallDialog isOpen={isLeftCall} />

      {!!peerInfos.length && (
        <Box
          display="grid"
          gap="8px"
          overflow="hidden"
          height="calc(100vh - 180px)"
          width="100%"
          flexGrow="1"
          gridTemplateColumns={`repeat(${colCount},1fr)`}
          gridTemplateRows={`repeat(${rowCount},1fr)`}
        >
          {peerInfos.map((item) => (
            <VideoBox key={item.socketId} peerInfo={item} />
          ))}
        </Box>
      )}

      {!peerInfos.length && !isConversationGroup && calledUser && (
        <Stack
          justifyContent="center"
          alignItems="center"
          flexGrow="1"
          width="100%"
          height="calc(100% - 250px)"
          overflow="hidden"
        >
          <Box
            component="img"
            src={calledUser.user.profile.avatar?.url || emptyAvatarUrl}
            flexGrow="1"
            sx={{ objectFit: 'contain' }}
            height="calc(100% - 50px)"
          />
          <Typography color="white" flexShrink="0" mt="10px" fontWeight="600">
            Calling {calledUser.user.profile.name} . . .
          </Typography>
        </Stack>
      )}

      {!peerInfos.length && !calledUser && (
        <Stack
          justifyContent="center"
          alignItems="center"
          height="calc(100% - 250px)"
        >
          <Box
            component="img"
            src="/images/call-bg.jpg"
            sx={{ objectFit: 'contain' }}
            height="calc(100% - 50px)"
          />
        </Stack>
      )}

      <MyVideo
        isMuteMic={isMuteMic}
        isOffCamera={isOffCamera}
        ref={myVideoRef}
        handleLeaveCall={handleLeaveCall}
        handleToggleMic={handleToggleMic}
        handleToggleCamera={handleToggleCamera}
      />
    </Stack>
  );
};
