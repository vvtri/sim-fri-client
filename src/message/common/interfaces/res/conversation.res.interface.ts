import { IBasePaginationRes } from '../../../../common/interfaces/base.res.interface';
import { IConversation } from '../../models/conversation.model';

export interface IGetListConversationRes
  extends IBasePaginationRes<IConversation> {}

export interface IGetConversationByUserRes extends IConversation {}
