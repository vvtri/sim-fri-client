import { IBasePaginationRes } from '../../../../common/interfaces/base.res.interface';
import { IMessageUserInfo } from '../../models/message-user-info.model';
import { IMessage } from '../../models/message.model';

export interface ISendMessageRes extends IMessage {}

export interface IGetListMessageRes extends IBasePaginationRes<IMessage> {}

export interface IReadMessageRes extends IMessageUserInfo {}
export interface IReactToMessageRes extends IMessageUserInfo {}
