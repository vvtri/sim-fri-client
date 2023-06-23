import { FriendRequestStatus } from 'shared';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { FriendType } from '../enums/friend.enum';
import { IFriend } from '../models/friend.model';

export const getUserInfoFromFriend = (data: IFriend, userId: number) => {
  const friend =
    data.requesterId === userId ? data.beRequested : data.requester;

  return { ...friend, avtUrl: friend.profile.avatar?.url || emptyAvatarUrl };
};

export const mapFriendType = (userId: number, friend?: IFriend) => {
  if (!friend) return FriendType.NOT_FRIEND;

  if (friend.status === FriendRequestStatus.ACCEPTED)
    return FriendType.BE_FRIEND;

  if (friend.requesterId === userId) return FriendType.REQUESTING;

  return FriendType.BE_REQUESTED;
};
