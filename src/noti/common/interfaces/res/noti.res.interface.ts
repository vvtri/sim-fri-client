import { IBasePaginationRes } from '../../../../common/interfaces/base.res.interface';
import { INoti } from '../../models/noti.model';

export interface IGetListNotiRes extends IBasePaginationRes<INoti> {}

export interface IUpdateReadStatusNotiRes extends INoti {}
