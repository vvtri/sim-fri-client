import { Stack, Typography } from '@mui/material';

export const FriendLeftPanelHeader = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      paddingX="10px"
      mb='10px'
    >
      <Typography fontSize='24px' fontWeight='700'>Friends</Typography>
    </Stack>
  );
};
