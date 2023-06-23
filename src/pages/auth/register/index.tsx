import router from 'next/router';
import { ReactElement, useEffect } from 'react';
import { RegisterForm } from '../../../auth/register/components/RegisterForm';
import { useAuth } from '../../../common/hooks/use-auth';
import AuthLayout from '../../../common/layouts/AuthLayout';

export default function Register() {
  const { userProfile: user } = useAuth();

  useEffect(() => {
    if (user) router.push('/');
  }, [user]);

  return <RegisterForm />;
}

Register.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
