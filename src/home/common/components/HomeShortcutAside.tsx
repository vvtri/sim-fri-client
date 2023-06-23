import { PeopleAlt } from '@mui/icons-material';
import { Avatar, Box, Stack } from '@mui/material';
import {
  emptyAvatarUrl,
  headerHeight,
} from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { HomeShortcutItem } from './HomeShortcutItem';

export const HomeShortcutAside = () => {
  const { userProfile } = useAuth();

  return (
    <Box
      width="300px"
      height={`calc(100vh - ${headerHeight})`}
      top={headerHeight}
      left="0"
      position="sticky"
      sx={{ overflowY: 'auto' }}
      borderRight="2px solid"
      borderColor="divider"
    >
      <Stack mt="20px">
        <HomeShortcutItem
          link={`/profile/${userProfile?.user.id}`}
          title={userProfile?.name || ''}
          image={
            <Avatar
              src={userProfile?.avatar?.url || emptyAvatarUrl}
              sx={{ width: '36px', height: '36px', ml: '10px' }}
            />
          }
        />
        <HomeShortcutItem
          link="friends"
          title="Friends"
          image={
            <PeopleAlt
              sx={{
                width: '36px',
                height: '36px',
                ml: '10px',
                color: 'primary.main',
              }}
            />
          }
        />
      </Stack>
    </Box>
  );
};
