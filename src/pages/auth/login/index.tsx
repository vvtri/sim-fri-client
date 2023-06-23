import router from 'next/router';
import { ReactElement, useEffect } from 'react';
import { LoginForm } from '../../../auth/login/components/LoginForm';
import { useAuth } from '../../../common/hooks/use-auth';
import AuthLayout from '../../../common/layouts/AuthLayout';

export default function Login() {
  const { userProfile: user } = useAuth();

  useEffect(() => {
    if (user) router.push('/');
  }, [user]);

  return <LoginForm />;
}

Login.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
