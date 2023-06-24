import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import ProfileLayout from '../../../common/layouts/ProfileLayout';
import { useAppDispatch } from '../../../redux/hook';

export default function About() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    router.push('/404');
  }, []);

  // useEffect(() => {
  //   dispatch(setProfileTabValue(ProfileTabs.ABOUT));
  // }, []);

  return <></>;
}

About.getLayout = (page: ReactElement) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};
