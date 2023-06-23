import { FriendRequestStatus } from 'shared';
import { IBasePaginationReq } from '../../../../common/interfaces/base.req.interface';

export type FriendRequestAction = 'ACCEPTED';

export interface IGetListFriendRequestReq extends IBasePaginationReq {
  searchText?: string;
  userId?: number;
  status?: FriendRequestStatus;
}

export interface IGetListFriendSuggestionReq extends IBasePaginationReq {}

export interface ICountFriendRequestReq {
  userId?: number;
}

export interface IAddFriendReq {}

export interface IReplyFriendRequestReq {
  friendRequestId: number;
  // action: FriendRequestAction

  // don't use reject anymore
  action: 'ACCEPTED';
}

export interface IUnfriendReq {}
