import { FriendRequestStatus } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';

export interface IFriend {
  id: number;
  status: FriendRequestStatus;
  requesterId: number;
  requester: IUser;
  beRequestedId: number;
  beRequested: IUser;
  mutualFriends: IUser[];
  isFriend?: boolean;
}
