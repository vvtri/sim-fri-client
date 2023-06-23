import { Box, Grid, Stack } from '@mui/material';
import { FriendCard } from '../../common/components/FriendCard';
import { useInfiniteFriendSuggestion } from '../../common/hooks/use-infinite-friend-suggestion.hook';
import { FriendSuggestionPanelHeader } from './FriendRequestPanelHeader';

export const FriendSuggestionPanel = () => {
  const { data, isFetching, fetchNextPage } = useInfiniteFriendSuggestion(20);

  const users = data?.pages.flatMap((item) => item.items) || [];

  return (
    <Box m="40px" width="100%" color="primaryText.main">
      <FriendSuggestionPanelHeader />

      <Grid container spacing="10px" width="100%">
        {users.map((item) => (
          <Grid item xs={12 / 5} key={item.id}>
            <FriendCard user={item} />
          </Grid>
        ))}
      </Grid>

      {!users.length && (
        <Stack
          fontSize="1rem"
          color="primaryText.main"
          width="100%"
          height="400px"
          alignItems="center"
          justifyContent="center"
        >
          {`You don't have any friend suggestion`}
        </Stack>
      )}
    </Box>
  );
};
