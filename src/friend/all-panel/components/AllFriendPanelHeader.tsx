import { Stack, Typography } from '@mui/material';

export const AllFriendPanelHeader = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb="10px"
    >
      <Typography fontSize="1.25rem" fontWeight="700">
        All friends
      </Typography>
    </Stack>
  );
};
