import { ConversationMemberRole } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { IConversation } from './conversation.model';

export interface IConversationMember {
  id: number;
  role: ConversationMemberRole;
  user: IUser;
  added: IUser;
  conversation: IConversation;
}
