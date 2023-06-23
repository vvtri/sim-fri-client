import { IConversation } from '../../models/conversation.model';

export interface ICreateConversationSocketRes {
  conversation: IConversation;
  creatorId: number;
}
