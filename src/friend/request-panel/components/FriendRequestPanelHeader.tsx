import { Stack, Typography } from '@mui/material';

export const FriendRequestPanelHeader = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      paddingX="10px"
      mb="10px"
    >
      <Typography fontSize="1.25rem" fontWeight="700">
        Friend Requests
      </Typography>
    </Stack>
  );
};
