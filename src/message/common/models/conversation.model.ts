import { IFile } from '../../../file/common/models/file.model';
import { IConversationMember } from './conversation-member.model';
import { IMessage } from './message.model';

export interface IConversation {
  id: number;
  name: string;
  isGroup: boolean;
  messages: IMessage[];
  avatar: IFile;
  conversationMembers: IConversationMember[];
  latestMessage: IMessage;
}
