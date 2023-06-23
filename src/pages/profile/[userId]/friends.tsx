import { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProfileLayout from '../../../common/layouts/ProfileLayout';
import { ProfileTabs } from '../../../profile/common/enums/profile.enum';
import { ProfileFriendContainer } from '../../../profile/friends/components/ProfileFriendContainer';
import { setProfileTabValue } from '../../../redux/slices/profile.slice';

export default function Friend() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setProfileTabValue(ProfileTabs.FRIEND));
  }, []);

  return <ProfileFriendContainer />;
}

Friend.getLayout = (page: ReactElement) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};
