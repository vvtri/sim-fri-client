import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';

export interface ICallJoinerInfo {
  user: IUser;
  socketId: string;
  isMuteMic: boolean;
  isOffCamera: boolean;
}
