import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../common/constants/index.constant';
import { getUserProfile } from '../services/profile.service';

export const useViewingProfile = (id: number) => {
  return {
    ...useQuery({
      queryKey: [QUERY_KEYS.VIEWING_PROFILE, id],
      queryFn: () => getUserProfile(id),
      enabled: !!id,
    }),
  };
};
