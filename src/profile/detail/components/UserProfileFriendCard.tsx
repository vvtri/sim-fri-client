import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { FriendRequestStatus } from 'shared';
import { useAuth } from '../../../common/hooks/use-auth';
import { useCountFriend } from '../../../friend/common/hooks/use-count-friend.hook';
import { useInfiniteFriend } from '../../../friend/common/hooks/use-infinite-friend.hook';
import { getUserInfoFromFriend } from '../../../friend/common/utils/friend.util';
import { useAppSelector } from '../../../redux/hook';
import { viewingProfileUserIdSelector } from '../../../redux/slices/profile.slice';
import { useViewingProfile } from '../../common/hooks/use-viewing-profile';

export const UserProfileFriendCard = () => {
  const { userProfile: authData } = useAuth();
  const userId = useAppSelector(viewingProfileUserIdSelector) as number;
  const { data: userProfile } = useViewingProfile(userId as any);
  const { data, fetchNextPage } = useInfiniteFriend({
    status: FriendRequestStatus.ACCEPTED,
    userId,
  });
  const { data: countFiend } = useCountFriend(userId as any);

  const friends = data?.pages.flatMap((page) => page.items) || [];

  return (
    <Card>
      <CardHeader
        title="Friends"
        titleTypographyProps={{ fontSize: '1.25rem', fontWeight: 700 }}
        subheader={`${countFiend} friends`}
        subheaderTypographyProps={{
          fontSize: '1.0625rem',
          color: '#B0B3B8',
        }}
        action={
          <Link href={`/profile/${userId}/friends`}>
            <Button sx={{ textTransform: 'none', fontSize: '1rem' }}>
              See all friends
            </Button>
          </Link>
        }
      />
      <CardContent>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
          {friends.map((item) => {
            const friend = getUserInfoFromFriend(item, userId as any);
            return (
              <Box width="100%" key={item.id}>
                <Link href={`/profile/${friend.id}`}>
                  <Box
                    position="relative"
                    padding="0 0 100% 0"
                    borderRadius="8px"
                    overflow="hidden"
                  >
                    <Image fill src={friend.avtUrl} alt="" />
                  </Box>
                  <Typography
                    mt="8px"
                    fontWeight="600"
                    fontSize="0.8125rem"
                    color="secondaryText.main"
                  >
                    {friend.profile.name}
                  </Typography>
                </Link>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
