import { MessageReadInfoStatus } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { IMessage } from './message.model';

export interface IMessageUserInfo {
  id: number;
  status: MessageReadInfoStatus;
  user: IUser;
  message: IMessage;
  createdAt: Date;
}
