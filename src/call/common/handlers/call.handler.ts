import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { WS_MESSAGE_EVENT } from 'shared';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';
import { addSnackBar } from '../../../common/utils/snackbar.util';
import { PeerInfo, PeerRef } from '../components/CallScreen';
import {
  ISendReturnSignalCallReq,
  ISendSignalCallReqDto,
} from '../interfaces/req/call.req.interface';
import {
  IJoinedRoomCallResDto,
  INewUserJoinCallRes,
  IReceiveReturnSignalCallRes,
  IToggleCameraCallRes,
  IToggleMicCallRes,
  IUserLeftRoomCallRes,
} from '../interfaces/res/call.res.interface';

export const joinedRoomHandler = ({
  callSocket,
  peersRef,
  setPeerInfos,
  stream,
}: JoinedRoomHandlerParams) => {
  return (joiners: IJoinedRoomCallResDto) => {
    console.log('WS_MESSAGE_EVENT.JOINED_ROOM', new Date().toISOString());

    const peers: PeerInfo[] = [];
    joiners.forEach((joiner) => {
      if (joiner.socketId === callSocket.id) return;

      const peer = new Peer({ initiator: true, stream, trickle: false });
      peer.on('signal', (signal) => {
        const reqData: ISendSignalCallReqDto = {
          signal,
          toSocket: joiner.socketId,
        };
        callSocket.emit(WS_MESSAGE_EVENT.SEND_SIGNAL, reqData);
      });
      peers.push({ peer, ...joiner });
      peersRef.current.push({ peer, socketId: joiner.socketId });
    });

    setPeerInfos(peers);
  };
};

export const newUserJoinedHandler = ({
  callSocket,
  peersRef,
  setPeerInfos,
  stream,
}: NewUserJoinedHandlerParams) => {
  return (resData: INewUserJoinCallRes) => {
    console.log('WS_MESSAGE_EVENT.NEW_USER_JOINED', new Date().toISOString());

    const { signal, newUserData } = resData;
    const peer = new Peer({ initiator: false, stream, trickle: false });

    peer.on('signal', (ourSignal) => {
      const reqData: ISendReturnSignalCallReq = {
        signal: ourSignal,
        toSocket: newUserData.socketId,
      };
      callSocket.emit(WS_MESSAGE_EVENT.SEND_RETURN_SIGNAL, reqData);
    });
    const cbAfterRender = () => peer.signal(signal);

    setPeerInfos((oldData) => [
      ...oldData,
      { peer, cbAfterRender, ...newUserData },
    ]);
    peersRef.current.push({ peer, socketId: newUserData.socketId });
  };
};

export const receiveReturnSignalHandler = ({
  peersRef,
}: ReceiveReturnSignalHandlerParams) => {
  return (reqData: IReceiveReturnSignalCallRes) => {
    console.log(
      'WS_MESSAGE_EVENT.RECEIVE_RETURN_SIGNAL',
      new Date().toISOString(),
    );

    const { fromData, signal } = reqData;
    const peer = peersRef.current.find(
      (item) => item.socketId === fromData.socketId,
    );

    peer!.peer.signal(signal);
  };
};

export const userLeftRoomHandler = ({
  peersRef,
  setPeerInfos,
}: UserLeftRoomHandlerParams) => {
  return ({ socketId, user }: IUserLeftRoomCallRes) => {
    console.log('WS_MESSAGE_EVENT.USER_LEFT_ROOM', new Date().toISOString());
    setPeerInfos((oldData) => [
      ...oldData.filter((item) => item.socketId !== socketId),
    ]);
    peersRef.current = peersRef.current.filter(
      (item) => item.socketId !== socketId,
    );

    addSnackBar({
      variant: 'info',
      message: `${user.profile.name} left the call`,
      persist: true,
    });
  };
};

export const toggleMicHandler = ({ setPeerInfos }: ToggleMicHandlerParams) => {
  return ({ joinerInfo }: IToggleMicCallRes) => {
    setPeerInfos((oldData) => {
      const idx = oldData.findIndex(
        (item) => item.socketId === joinerInfo.socketId,
      );
      if (idx < 0) return oldData;

      oldData[idx] = { ...oldData[idx], ...joinerInfo };
      return [...oldData];
    });
  };
};

export const toggleCameraHandler = ({
  setPeerInfos,
}: ToggleCameraHandlerParams) => {
  return ({ joinerInfo }: IToggleCameraCallRes) => {
    setPeerInfos((oldData) => {
      const idx = oldData.findIndex(
        (item) => item.socketId === joinerInfo.socketId,
      );

      if (idx < 0) return oldData;

      oldData[idx] = { ...oldData[idx], ...joinerInfo };
      return [...oldData];
    });
  };
};

type JoinedRoomHandlerParams = {
  stream: MediaStream;
  callSocket: Socket;
  peersRef: MutableRefObject<PeerRef[]>;
  setPeerInfos: Dispatch<SetStateAction<PeerInfo[]>>;
};

type NewUserJoinedHandlerParams = {
  stream: MediaStream;
  callSocket: Socket;
  peersRef: MutableRefObject<PeerRef[]>;
  setPeerInfos: Dispatch<SetStateAction<PeerInfo[]>>;
};

type ReceiveReturnSignalHandlerParams = {
  peersRef: MutableRefObject<PeerRef[]>;
};

type UserLeftRoomHandlerParams = {
  peersRef: MutableRefObject<PeerRef[]>;
  setPeerInfos: Dispatch<SetStateAction<PeerInfo[]>>;
};

type ToggleMicHandlerParams = {
  setPeerInfos: Dispatch<SetStateAction<PeerInfo[]>>;
};

type ToggleCameraHandlerParams = {
  setPeerInfos: Dispatch<SetStateAction<PeerInfo[]>>;
};
