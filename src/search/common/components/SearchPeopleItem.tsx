import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { Center } from '../../../common/components/utils/Center';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { FriendType } from '../../../friend/common/enums/friend.enum';
import { useAddFriend } from '../../../friend/common/hooks/use-add-friend.hook';
import { useDeleteFriendRequest } from '../../../friend/common/hooks/use-delete-friend-request.hook';
import { IFriend } from '../../../friend/common/models/friend.model';
import { mapFriendType } from '../../../friend/common/utils/friend.util';
import { useAppDispatch } from '../../../redux/hook';
import { findConversationThunk } from '../../../redux/slices/message.slice';

type SearchPeopleItemProps = {
  user: IUser;
};

export const SearchPeopleItem = ({ user }: SearchPeopleItemProps) => {
  const dispatch = useAppDispatch();
  const { userProfile: authProfile } = useAuth();
  const [friendRequest, setFriendRequest] = useState<IFriend | undefined>(
    user.friendRequest,
  );
  const { mutate: addFriend, isLoading: isAddingFriend } = useAddFriend({
    onSuccess(data, variables, context) {
      setFriendRequest(data);
    },
    onError(error, variables, context) {},
  });
  const { mutate: deleteFriend, isLoading: isDeletingFriend } =
    useDeleteFriendRequest({
      onSuccess(data, variables, context) {
        setFriendRequest(undefined);
      },
      onError(error, variables, context) {},
    });

  const { mutualFriends, profile } = user;
  const avtUrl = profile.avatar?.url || emptyAvatarUrl;

  const friendRequestType = mapFriendType(authProfile!.user.id, friendRequest);

  const handleClickBtn = () => {
    switch (friendRequestType) {
      case FriendType.NOT_FRIEND:
        if (!isAddingFriend) addFriend(user.id);
        break;
      case FriendType.BE_FRIEND:
        dispatch(findConversationThunk(user.id));
        break;
      case FriendType.REQUESTING:
        if (!isDeletingFriend) deleteFriend(user.id);
        break;
      case FriendType.BE_REQUESTED:
        if (!isDeletingFriend) addFriend(user.id);
        break;
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        color="primaryText.main"
        p="20px"
        justifyContent="space-between"
        bgcolor="darkAccent.main"
        borderRadius="10px"
      >
        <Stack direction="row" spacing="10px">
          <Link href={`/profile/${user.id}`}>
            <Avatar src={avtUrl} sx={{ width: '60px', height: '60px' }} />
          </Link>

          <Stack>
            <Link href={`/profile/${user.id}`} style={{ width: 'fit-content' }}>
              <Typography
                fontWeight="600"
                fontSize="1.0625rem"
                width="fit-content"
              >
                {profile.name}
              </Typography>
            </Link>
            <Typography color="secondaryText.main" fontSize="0.9375rem" noWrap>
              {friendRequestType === FriendType.BE_FRIEND && (
                <>Friend &#183; </>
              )}
              {[profile.school, profile.address].filter(Boolean).join(' - ')}
            </Typography>

            {!!mutualFriends.length && (
              <Stack direction="row" alignItems="center" mt="10px">
                <Avatar
                  src={emptyAvatarUrl}
                  sx={{ width: '24px', height: '24px' }}
                />
                <Typography
                  ml="6px"
                  color="secondaryText.main"
                  fontSize="0.9375rem"
                >
                  {mutualFriends.length} mutuals friend
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>

        <Center>
          <Button
            color="secondaryBlue"
            variant="contained"
            onClick={handleClickBtn}
          >
            {friendRequestType === FriendType.BE_FRIEND && 'Message'}
            {[FriendType.NOT_FRIEND, FriendType.BE_REQUESTED].includes(
              friendRequestType,
            ) && 'Add Friend'}
            {friendRequestType === FriendType.REQUESTING && 'Cancel Request'}
          </Button>
        </Center>
      </Stack>
    </Box>
  );
};
