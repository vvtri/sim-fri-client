import {
  CommentReactionType,
  NotiSenderType,
  NotiType,
  PostReactionType,
} from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';

export interface INoti {
  id: number;
  type: NotiType;
  link: string;
  readAt: Date;
  senderType: NotiSenderType;
  userId: number;
  user: IUser;
  senderUserId: number;
  senderUser: IUser;
  content: string;
  updatedAt: Date;
  reactionType: PostReactionType | CommentReactionType;
}
