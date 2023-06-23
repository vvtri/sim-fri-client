import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { EditProfile } from '../../profile/edit-profile/components/EditProfile';
import { useAuth } from '../hooks/use-auth';

type AuthGuardProps = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoading, userProfile: user } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <Box>Is loading user</Box>;
  }

  if (!isLoading && !user) {
    router.push('/auth/login');
    return <></>;
  }

  if (!user?.name) {
    return <EditProfile />;
  }

  return <>{children}</>;
};
