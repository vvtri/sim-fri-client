import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FriendRequestStatus } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { FriendType } from '../enums/friend.enum';
import { useAddFriend } from '../hooks/use-add-friend.hook';
import { useDeleteFriendRequest } from '../hooks/use-delete-friend-request.hook';
import { useReplyFriend } from '../hooks/use-reply-friend.hook';
import { IFriend } from '../models/friend.model';
import { mapFriendType } from '../utils/friend.util';

export type FriendCardProps = {
  friend?: IFriend;
  user: IUser;
};

export const FriendCard = ({ friend: parentFriend, user }: FriendCardProps) => {
  const { userProfile } = useAuth();
  const [friend, setFriend] = useState(parentFriend);
  let mutualFriends: IUser[] =
    user.mutualFriends || friend?.mutualFriends || [];
  const avtUrl = user.profile.avatar?.url || emptyAvatarUrl;
  console.log('friend', friend);
  console.log('user', user);
  const { mutate: addFriend, isLoading: isAddingFriend } = useAddFriend({
    onSuccess(data, variables, context) {
      setFriend(data);
    },
    onError(error, variables, context) {
      console.log('error', error);
    },
  });
  const { mutate: replyFriend, isLoading: isReplyingFriend } = useReplyFriend({
    onSuccess(data, variables, context) {
      setFriend((oldData) => ({
        ...(oldData as IFriend),
        status: FriendRequestStatus.ACCEPTED,
      }));
    },
    onError(error, variables, context) {
      console.log('error', error);
    },
  });
  const { mutate: deleteFriend, isLoading: isDeletingFriend } =
    useDeleteFriendRequest({
      onSuccess(data, variables, context) {
        setFriend(undefined);
      },
      onError(error, variables, context) {
        console.log('error', error);
      },
    });

  const friendType = mapFriendType(userProfile!.user.id, friend);

  const handleAddFriend = () => {
    addFriend(user.id);
  };
  const handleAcceptFriend = () => {
    replyFriend({ action: 'ACCEPTED', friendRequestId: friend!.id });
  };
  const handleDeleteFriend = () => {
    deleteFriend(user.id);
  };

  console.log('friendType', friendType);

  return (
    <Box
      width="100%"
      borderRadius="5px"
      bgcolor="darkAccent.main"
      overflow="hidden"
    >
      <Link
        href={`/profile/${user.id}`}
        style={{
          position: 'relative',
          paddingBottom: '100%',
          display: 'block',
        }}
      >
        <Image src={avtUrl} fill alt="" />
      </Link>

      <Box padding="15px">
        <Link href={`/profile/${user.id}`} style={{ marginBottom: '10px' }}>
          <Typography
            fontWeight="600"
            fontSize="1.0625rem"
            sx={{ '&:hover': { textDecoration: 'underline' } }}
          >
            {user.profile.name}
          </Typography>
        </Link>

        <Stack
          direction="row"
          my="10px"
          alignItems="center"
          spacing="10px"
          height="24px"
        >
          {!!mutualFriends?.length && (
            <>
              <AvatarGroup spacing="medium" max={5}>
                {mutualFriends.map((item) => (
                  <Avatar
                    key={item.id}
                    src={item.profile.avatar?.url || emptyAvatarUrl}
                    sx={{
                      width: '16px',
                      height: '16px',
                      border: 'none !important',
                    }}
                  />
                ))}
              </AvatarGroup>

              <Typography fontSize="0.9375rem" color="secondaryText.main">
                {mutualFriends.length} mutual friends
              </Typography>
            </>
          )}
        </Stack>

        <Stack mt="10px" spacing="6px">
          {friendType === FriendType.NOT_FRIEND && (
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleAddFriend}
              disabled={isAddingFriend}
            >
              Add friend
            </Button>
          )}

          {friendType === FriendType.BE_FRIEND && (
            <Button color="primary" variant="contained" fullWidth>
              <Link href={`/profile/${user.id}`}>View Profile</Link>
            </Button>
          )}

          {friendType === FriendType.REQUESTING && (
            <Button
              color="comment"
              variant="contained"
              fullWidth
              onClick={handleDeleteFriend}
              disabled={isDeletingFriend}
            >
              Cancel request
            </Button>
          )}

          {friendType === FriendType.BE_REQUESTED && (
            <>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={handleAcceptFriend}
                disabled={isReplyingFriend}
              >
                Accept
              </Button>
              <Button
                color="comment"
                variant="contained"
                fullWidth
                sx={{ ':hover': { bgcolor: 'hoverColor.main' } }}
                onClick={handleDeleteFriend}
                disabled={isDeletingFriend}
              >
                Delete
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
