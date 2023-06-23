import { IUser } from '../../../../auth/common/interfaces/res/user.res.interface';
import { IBasePaginationRes } from '../../../../common/interfaces/base.res.interface';

export interface ISearchPeopleRes extends IBasePaginationRes<IUser> {}
