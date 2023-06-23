import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef } from 'react';
import { FriendRequestStatus } from 'shared';
import { useAuth } from '../../../common/hooks/use-auth';
import { useDebounce } from '../../../common/hooks/use-debounce';
import { useInfiniteFriend } from '../../../friend/common/hooks/use-infinite-friend.hook';
import { useAppSelector } from '../../../redux/hook';
import {
  viewProfileSearchTextSelector,
  viewingProfileUserIdSelector,
} from '../../../redux/slices/profile.slice';
import { ProfileFriendCard } from './ProfileFriendCard';
import { ProfileFriendHeader } from './ProfileFriendHeader';

export const ProfileFriendContainer = () => {
  const { userProfile } = useAuth();
  const userId = useAppSelector(viewingProfileUserIdSelector) as number;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchText = useAppSelector(viewProfileSearchTextSelector);
  const debouncedSearchText = useDebounce(searchText);
  const { data, isFetching, fetchNextPage, isFetchingNextPage } =
    useInfiniteFriend({
      userId,
      limit: 20,
      searchText: debouncedSearchText,
      status: FriendRequestStatus.ACCEPTED,
    });
  const isFetchingRef = useRef(isFetching || isFetchingNextPage);

  const friends = data?.pages.flatMap((page) => page.items) || [];
  const isMyProfile = userProfile?.user.id === userId;

  useEffect(() => {
    const handler = () => {
      const elem = containerRef.current;
      if (!elem || isFetchingRef.current) return;

      const isNearEnd =
        window.scrollY + window.innerHeight + 500 >=
        elem.offsetTop + elem.scrollHeight;

      if (isNearEnd) fetchNextPage();
    };

    window.addEventListener('scroll', handler);

    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, []);

  useEffect(() => {
    isFetchingRef.current = isFetching || isFetchingNextPage;
  }, [isFetching, isFetchingNextPage]);

  return (
    <Box
      borderRadius="10px"
      width="100%"
      bgcolor="darkAccent.main"
      p="20px"
      mt="14px"
      color="primaryText.main"
    >
      <ProfileFriendHeader />

      <Box
        display="grid"
        gap="10px"
        gridTemplateColumns="repeat(2,1fr)"
        mt="20px"
      >
        {friends.map((item) => (
          <ProfileFriendCard key={item.id} friend={item} />
        ))}
      </Box>

      {!friends.length && (
        <Stack mt="20px" py="50px" alignItems="center" justifyContent="center">
          <Typography>
            {' '}
            {isMyProfile ? 'You' : 'This user'} {`don't have any friend`}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};
