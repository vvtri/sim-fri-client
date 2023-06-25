import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useViewingProfile } from '../../profile/common/hooks/use-viewing-profile';
import { UserProfileEditDialog } from '../../profile/detail/components/UserProfileEditDialog';
import { UserProfileHeadSection } from '../../profile/detail/components/UserProfileHeadSection';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import {
  setViewingProfileUserId,
  viewingProfileUserIdSelector,
} from '../../redux/slices/profile.slice';
import { Header } from '../components/Header';
import { AuthGuard } from '../guards/AuthGuard';
import { useAuth } from '../hooks/use-auth';
import { useChatSocketContext } from '../hooks/use-chat-socket';
import { PropsWithChildren } from '../types/util.type';

type ProfileLayoutProps = PropsWithChildren & {};

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const { ChatSocketContext, chatSocketState } = useChatSocketContext();
  const { userProfile: authData } = useAuth();
  const userId = useAppSelector(viewingProfileUserIdSelector);
  const { data: userProfile, isLoading } = useViewingProfile(userId as number);
  const isMyProfile = authData?.user?.id === userProfile?.user?.id;

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (router.query.userId) {
      dispatch(setViewingProfileUserId(Number(router.query.userId)));
    }
  }, [router.query.userId]);

  return (
    <AuthGuard>
      <ChatSocketContext.Provider value={chatSocketState}>
        {isMyProfile && <UserProfileEditDialog />}

        <Box width="100%" bgcolor="black" color="white">
          <Header />
          <Box width="100%">
            {userProfile ? (
              <>
                <Box bgcolor="darkAccent.main">
                  <Box width="100%" maxWidth="940px" margin="auto">
                    <UserProfileHeadSection />
                  </Box>
                </Box>
                <Box width="100%" maxWidth="940px" margin="auto">
                  {children}
                </Box>
              </>
            ) : (
              <Typography>User not found</Typography>
            )}
          </Box>
        </Box>
      </ChatSocketContext.Provider>
    </AuthGuard>
  );
}
