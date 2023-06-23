import { Logout } from '@mui/icons-material';
import { Avatar, Box, Stack, StackProps, Typography } from '@mui/material';
import Link from 'next/link';
import { MutableRefObject, useEffect, useRef } from 'react';
import {
  CARD_BOX_SHADOW,
  headerHeight,
} from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { PropsWithChildren } from '../../../common/types/util.type';
import {
  deleteAccessToken,
  deleteRefreshToken,
} from '../../../common/utils/auth.util';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  authAccountControlPanelSelector,
  setAccountControlPanelIsShow,
  setAuthProfile,
  toggleAccountControlPanelIsShow,
} from '../../../redux/slices/auth.slice';

const AuthControlPanelItem = ({
  children,
  ...rest
}: PropsWithChildren & StackProps) => (
  <Stack
    direction="row"
    p="10px"
    borderRadius="10px"
    sx={{ '&:hover': { bgcolor: 'hoverColor.main' }, cursor: 'pointer' }}
    alignItems="center"
    spacing="10px"
    {...rest}
  >
    {children}
  </Stack>
);

type AuthControlPanelProps = {
  avtIconRef: MutableRefObject<HTMLDivElement | null>;
};

export const AuthControlPanel = ({ avtIconRef }: AuthControlPanelProps) => {
  const dispatch = useAppDispatch();
  const { isShow } = useAppSelector(authAccountControlPanelSelector);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { avatarUrl, userProfile } = useAuth();

  const handleLogout = () => {
    deleteAccessToken();
    deleteRefreshToken();
    dispatch(setAuthProfile(null));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as any;

      if (avtIconRef.current?.contains(target)) {
        return dispatch(toggleAccountControlPanelIsShow());
      }

      if (!panelRef.current?.contains(target)) {
        return dispatch(setAccountControlPanelIsShow(false));
      }
    };
    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  return (
    <Box
      position="fixed"
      zIndex="100"
      sx={{
        top: headerHeight,
        right: '20px',
        backgroundColor: 'darkAccent.main',
        boxShadow: CARD_BOX_SHADOW,
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        overflowY: 'auto',
      }}
      maxWidth="360px"
      maxHeight={`calc(100% - ${headerHeight} - 10px)`}
      width="100%"
      padding="10px"
      color="primaryText.main"
      ref={panelRef}
      display={isShow ? 'block' : 'none'}
    >
      <Link href={`/profile/${userProfile!.user.id}`}>
        <AuthControlPanelItem>
          <Avatar src={avatarUrl} sx={{ width: '35px', height: '35px' }} />
          <Typography fontSize="1rem" fontWeight="600">
            {userProfile?.name}
          </Typography>
        </AuthControlPanelItem>
      </Link>

      <AuthControlPanelItem onClick={handleLogout}>
        <Logout sx={{ width: '30px', height: '30px' }} />

        <Typography fontSize="1rem" fontWeight="600">
          Logout
        </Typography>
      </AuthControlPanelItem>
    </Box>
  );
};
