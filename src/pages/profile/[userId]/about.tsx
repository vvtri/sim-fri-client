import { ReactElement, useEffect } from 'react';
import ProfileLayout from '../../../common/layouts/ProfileLayout';
import { ProfileTabs } from '../../../profile/common/enums/profile.enum';
import { useAppDispatch } from '../../../redux/hook';
import { setProfileTabValue } from '../../../redux/slices/profile.slice';

export default function About() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setProfileTabValue(ProfileTabs.ABOUT));
  }, []);

  return <div>About</div>;
}

About.getLayout = (page: ReactElement) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};
