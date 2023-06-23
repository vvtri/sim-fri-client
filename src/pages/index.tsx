import { Stack } from '@mui/material';
import { deleteAccessToken } from '../common/utils/auth.util';
import { HomeConversationAside } from '../home/common/components/HomeConversationAside';
import { HomePostContainer } from '../home/common/components/HomePostContainer';
import { HomeShortcutAside } from '../home/common/components/HomeShortcutAside';
import { useAppDispatch } from '../redux/hook';
import { setAuth } from '../redux/slices/auth.slice';

export default function Home() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    deleteAccessToken();
    dispatch(setAuth({ userProfile: null, isLoading: false }));
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      bgcolor="homeBg.main"
      minHeight="100vh"
    >
      <HomeShortcutAside />
      <HomePostContainer />
      <HomeConversationAside />
    </Stack>
  );
}
