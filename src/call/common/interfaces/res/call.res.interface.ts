import { SignalData } from 'simple-peer';
import { IUser } from '../../../../auth/common/interfaces/res/user.res.interface';
import { ICallJoinerInfo } from '../../models/call-joiner-info.model';

export interface IJoinedRoomCallResDto extends Array<ICallJoinerInfo> {}

export interface INewUserJoinCallRes {
  signal: SignalData;
  newUserData: ICallJoinerInfo;
}

export interface IReceiveReturnSignalCallRes {
  signal: SignalData;
  fromData: ICallJoinerInfo;
}

export interface IUserLeftRoomCallRes {
  socketId: string;
  user: IUser;
}

export interface IToggleMicCallRes {
  joinerInfo: ICallJoinerInfo;
  isOpen: boolean;
}

export interface IToggleCameraCallRes {
  joinerInfo: ICallJoinerInfo;
  isOpen: boolean;
}
