import { IFriend } from '../../../../friend/common/models/friend.model';
import { IUserProfile } from '../../../../profile/common/models/user-profile.model';

export interface IUser {
  id: number;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  profile: IUserProfile;
  friendRequesters: IFriend[];
  friendRequesteds: IFriend[];
  mutualFriends: IUser[];
  friendRequest: IFriend;
}
