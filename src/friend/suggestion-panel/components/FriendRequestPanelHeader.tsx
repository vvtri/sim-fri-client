import { Stack, Typography } from '@mui/material';

export const FriendSuggestionPanelHeader = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb="10px"
    >
      <Typography fontSize="1.25rem" fontWeight="700">
        People you may know
      </Typography>
    </Stack>
  );
};
