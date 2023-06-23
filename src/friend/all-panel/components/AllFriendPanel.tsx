import { Box, Grid, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { FriendRequestStatus } from 'shared';
import { useAuth } from '../../../common/hooks/use-auth';
import { FriendCard } from '../../common/components/FriendCard';
import { useInfiniteFriend } from '../../common/hooks/use-infinite-friend.hook';
import { getUserInfoFromFriend } from '../../common/utils/friend.util';
import { AllFriendPanelHeader } from './AllFriendPanelHeader';

export const AllFriendPanel = () => {
  const queryClient = useQueryClient();
  const { userProfile } = useAuth();

  const queryParams = {
    status: FriendRequestStatus.ACCEPTED,
    limit: 20,
  };
  const { data, isFetching, fetchNextPage } = useInfiniteFriend(queryParams);

  const friends = data?.pages.flatMap((item) => item.items) || [];

  return (
    <Box m="40px" width="100%" color="primaryText.main">
      <AllFriendPanelHeader />

      <Grid container spacing="10px" width="100%">
        {friends.map((item) => (
          <Grid item xs={12 / 5} key={item.id}>
            <FriendCard
              friend={item}
              user={getUserInfoFromFriend(item, userProfile!.user.id)}
            />
          </Grid>
        ))}
      </Grid>

      {!friends.length && (
        <Stack
          fontSize="1rem"
          color="primaryText.main"
          width="100%"
          height="400px"
          fontWeight="600"
          alignItems="center"
          justifyContent="center"
        >
          {`You don't have any friend`}
        </Stack>
      )}
    </Box>
  );
};
