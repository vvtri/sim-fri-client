import { MessageType, PostReactionType } from 'shared';
import { IBasePaginationReq } from '../../../../common/interfaces/base.req.interface';

export interface IGetListMessageReq extends IBasePaginationReq {
  conversationId: number;
}

export interface ISendMessageReq {
  type: MessageType;
  conversationId?: number;
  userIds?: number[];
  content?: string;
  fileId?: number;
}

export interface IReactToMessageReq {
  messageId: number;
  reaction: PostReactionType;
}
