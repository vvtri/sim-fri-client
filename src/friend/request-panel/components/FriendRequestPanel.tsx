import { Box, Grid, Stack } from '@mui/material';
import { FriendRequestStatus } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { useAuth } from '../../../common/hooks/use-auth';
import { FriendCard } from '../../common/components/FriendCard';
import { useInfiniteFriend } from '../../common/hooks/use-infinite-friend.hook';
import { getUserInfoFromFriend } from '../../common/utils/friend.util';
import { FriendRequestPanelHeader } from './FriendRequestPanelHeader';

export const FriendRequestPanel = () => {
  const { userProfile } = useAuth();
  const { data, isFetching, fetchNextPage } = useInfiniteFriend({
    status: FriendRequestStatus.PENDING,
    limit: 20,
  });

  const friends = data?.pages.flatMap((item) => item.items) || [];
  const users: IUser[] = [];

  for (const friend of friends) {
    if (friend.requesterId === userProfile?.user.id) {
      users.push(friend.beRequested);
    } else users.push(friend.requester);
  }

  return (
    <Box m="40px" width="100%" color="primaryText.main">
      <FriendRequestPanelHeader />

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
          {`You don't have any friend request`}
        </Stack>
      )}
    </Box>
  );
};
