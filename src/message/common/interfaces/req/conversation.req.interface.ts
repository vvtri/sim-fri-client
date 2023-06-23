import { IBasePaginationReq } from '../../../../common/interfaces/base.req.interface';

export interface IGetListConversationReq extends IBasePaginationReq {
  searchText?: string;

  isGroup?: boolean;
}

export interface IGetConversationByUserReq {}
