import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { CircularProgress, IconButton, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import Image from 'next/image';
import { ChangeEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { useAppSelector } from '../../../redux/hook';
import {
  setEditProfile,
  setProfileTabValue,
  viewingProfileUserIdSelector,
} from '../../../redux/slices/profile.slice';
import { useViewingProfile } from '../../common/hooks/use-viewing-profile';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { FriendRequestStatus } from 'shared';
import { useCountFriend } from '../../../friend/common/hooks/use-count-friend.hook';
import { useInfiniteFriend } from '../../../friend/common/hooks/use-infinite-friend.hook';
import { getUserInfoFromFriend } from '../../../friend/common/utils/friend.util';
import { ProfileTabs } from '../../common/enums/profile.enum';
import { UserProfileTitleAction } from './UserProfileTitleAction';

export const UserProfileTitle = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const userId = useAppSelector(viewingProfileUserIdSelector);
  const { userProfile: authData } = useAuth();
  const { data: userProfile, refetch } = useViewingProfile(userId as number);
  const {
    data: friendCount,
    isLoading: isLoadingCountFriend,
    refetch: refetchCountFiend,
  } = useCountFriend(userProfile!.user.id);
  const {
    data: friendRequestData,
    isLoading: isLoadingFriends,
    refetch: refetchInfiniteFriend,
  } = useInfiniteFriend({
    limit: 3,
    status: FriendRequestStatus.ACCEPTED,
    userId: userProfile?.user.id,
  });

  const userProfileAvtUrl = userProfile?.avatar?.url || emptyAvatarUrl;
  const friendRequests =
    friendRequestData?.pages.flatMap((item) => item.items) || [];
  const isMyProfile = authData?.user.id === userProfile?.user.id;

  const handleUploadAvatar: ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const newImage = e.target.files?.[0];
    if (newImage) {
      dispatch(
        setEditProfile({
          isShowModal: true,
          avatarUrl: URL.createObjectURL(newImage),
        }),
      );
    }
  };

  const handleClickFriend = () => {
    dispatch(setProfileTabValue(ProfileTabs.FRIEND));
  };

  const afterMutateFriend = () => {
    refetch();
    refetchCountFiend();
    refetchInfiniteFriend();
  };

  return (
    <Stack marginTop="-30px">
      <Stack direction="row" padding="16px" justifyContent="space-between">
        <Stack direction="row">
          <Box mr="16px" position="relative">
            <Image
              src={userProfileAvtUrl}
              width={168}
              height={168}
              alt=""
              style={{ borderRadius: '50%', overflow: 'hidden' }}
            />

            <input
              hidden
              type="file"
              accept="image/*"
              id="test"
              onChange={handleUploadAvatar}
            />
            {isMyProfile && (
              <label htmlFor="test">
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: '25px',
                    right: '25px',
                    transform: 'translate(50%, 50%)',
                    bgcolor: '#3A3B3C',
                    '&:hover': { bgcolor: '#3A3B3C' },
                  }}
                >
                  <CameraAltIcon style={{ color: 'white' }} />
                </IconButton>
              </label>
            )}
          </Box>
          <Stack margin="32px 0 16px" justifyContent="flex-end">
            <Box>
              <Typography fontSize="2rem" fontWeight="700" color="white">
                {userProfile?.name}
              </Typography>
            </Box>
            <Box onClick={handleClickFriend} sx={{ cursor: 'pointer' }}>
              {isLoadingCountFriend ? (
                <CircularProgress />
              ) : (
                <Link href={`/profile/${userProfile?.user.id}/friends`}>
                  <Typography
                    variant="subtitle1"
                    color="secondaryText.main"
                    sx={{ '&:hover': { textDecorationLine: 'underline' } }}
                  >
                    {friendCount} friends
                  </Typography>
                </Link>
              )}
            </Box>
            <Stack direction="row" spacing="-4px">
              {friendRequests.map((item) => {
                const friendData = getUserInfoFromFriend(
                  item,
                  userProfile!.user.id,
                );

                return (
                  <Box borderRadius="50%" overflow="hidden" key={friendData.id}>
                    <Link href={`/profile/${friendData.id}`}>
                      <Image
                        src={friendData.avtUrl}
                        width={32}
                        height={32}
                        alt=""
                      />
                    </Link>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        </Stack>

        <UserProfileTitleAction afterMutateFriend={afterMutateFriend} />
      </Stack>
    </Stack>
  );
};
