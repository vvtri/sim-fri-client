import { IBasePaginationReq } from '../../../../common/interfaces/base.req.interface';

export interface ISearchPeopleReq extends IBasePaginationReq {
  searchText?: string;

  excludedIds?: number[];
}
