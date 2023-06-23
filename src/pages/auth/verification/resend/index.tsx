import router from 'next/router';
import { ReactElement, useEffect } from 'react';
import { ResendVerificationForm } from '../../../../auth/verification/components/ResendVerificationForm';
import { useAuth } from '../../../../common/hooks/use-auth';
import AuthLayout from '../../../../common/layouts/AuthLayout';

export default function ResendVerification() {
  const { userProfile: user } = useAuth();

  useEffect(() => {
    if (user) router.push('/');
  }, [user]);

  return <ResendVerificationForm />;
}

ResendVerification.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
