import { IUser } from '../../../../auth/common/interfaces/res/user.res.interface';
import { IBasePaginationRes } from '../../../../common/interfaces/base.res.interface';
import { IFriend } from '../../models/friend.model';

export interface IGetListFriendRequestRes extends IBasePaginationRes<IFriend> {}

export interface IGetListFriendSuggestionRes
  extends IBasePaginationRes<IUser> {}

export type IIsFriendRequestRes = boolean;
export type IGetFriendRequestResDto = IFriend;
export type ICountFriendRequestRes = number;

export interface IAddFriendRes extends IFriend {}

export interface IReplyFriendRequestRes {}

export interface IDeleteFriendRes {}
