import { IBasePaginationReq } from '../../../../common/interfaces/base.req.interface';

export interface IGetListNotiReq extends IBasePaginationReq {}

export interface IUpdateReadStatusNotiReq {
  notiId: number;

  isRead: boolean;
}
