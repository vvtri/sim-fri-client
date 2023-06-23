import { SignalData } from 'simple-peer';

export interface IJoinRoomCallReqDto {
  roomId: string;
}

export interface ISendSignalCallReqDto {
  signal: SignalData;
  toSocket: string;
}

export interface ISendReturnSignalCallReq {
  signal: SignalData;
  toSocket: string;
}

export interface IToggleMicCallReqDto {
  isMuteMic: boolean;
}

export interface IToggleCameraCallReqDto {
  isOffCamera: boolean;
}
