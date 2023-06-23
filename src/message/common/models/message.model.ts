import { MessageType } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { IFile } from '../../../file/common/models/file.model';
import { IMessageUserInfo } from './message-user-info.model';

export interface IMessage {
  id: number;
  content: string;
  type: MessageType;
  user: IUser;
  conversationId: number;
  file: IFile;
  messageUserInfos: IMessageUserInfo[];
  createdAt: Date;
}
