import router from 'next/router';
import { ReactElement, useEffect } from 'react';
import { VerifyUserForm } from '../../../auth/verification/components/VerifyUserForm';
import { useAuth } from '../../../common/hooks/use-auth';
import AuthLayout from '../../../common/layouts/AuthLayout';

export default function VerifyUser() {
  const { userProfile: user } = useAuth();

  useEffect(() => {
    if (user) router.push('/');
  }, [user]);

  return <VerifyUserForm />;
}

VerifyUser.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
