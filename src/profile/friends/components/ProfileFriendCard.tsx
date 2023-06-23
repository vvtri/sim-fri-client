import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { Button, IconButton, Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { IFriend } from '../../../friend/common/models/friend.model';
import { getUserInfoFromFriend } from '../../../friend/common/utils/friend.util';
import { useAppSelector } from '../../../redux/hook';
import { viewingProfileUserIdSelector } from '../../../redux/slices/profile.slice';

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '0.9375rem',
  color: 'primary.main',
  borderRadius: '6px',
}));

type ProfileFriendCardProps = {
  friend: IFriend;
};

export const ProfileFriendCard = ({ friend }: ProfileFriendCardProps) => {
  const userId = useAppSelector(viewingProfileUserIdSelector) as number;
  const user = getUserInfoFromFriend(friend, userId);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      p="16px"
      border=".5px solid"
      borderColor="comment.main"
    >
      <Stack direction="row" alignItems="center">
        <Link href={`/profile/${user.id}`}>
          <Image
            src={user.avtUrl}
            width={80}
            height={80}
            style={{ borderRadius: '8px' }}
            alt=""
          />
        </Link>

        <Stack alignItems="flex-start" ml="12px">
          <Link href={`/profile/${user.id}`}>
            <Typography fontSize="1.0625rem" fontWeight="600">
              {user.profile.name}
            </Typography>
          </Link>

          {!!friend.mutualFriends.length && (
            <Typography
              fontSize="0.8125rem"
              fontWeight="400"
              sx={{
                ':hover': { textDecoration: 'underline' },
                cursor: 'pointer',
              }}
            >
              {friend.mutualFriends.length} mutuals friend
            </Typography>
          )}
        </Stack>
      </Stack>

      {friend.isFriend ? (
        <IconButton color="secondaryText">
          <MoreHoriz />
        </IconButton>
      ) : (
        <CustomButton variant="contained">
          <Link href={`/profile/${user.id}`}>Add friend</Link>
        </CustomButton>
      )}
    </Stack>
  );
};
