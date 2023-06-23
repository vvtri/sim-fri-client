import { useAppSelector } from '../../redux/hook';
import { authSelector } from '../../redux/slices/auth.slice';
import { emptyAvatarUrl } from '../constants/index.constant';

export const useAuth = () => {
  const { isLoading, userProfile } = useAppSelector(authSelector);
  const avatarUrl = userProfile?.avatar?.url || emptyAvatarUrl;

  return { isLoading, userProfile, avatarUrl };
};
