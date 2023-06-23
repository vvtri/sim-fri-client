import {
  Add,
  KeyboardArrowDown,
  Message,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FriendRequestStatus } from 'shared';
import { CARD_BOX_SHADOW } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { useAddFriend } from '../../../friend/common/hooks/use-add-friend.hook';
import { useDeleteFriendRequest } from '../../../friend/common/hooks/use-delete-friend-request.hook';
import {
  genGetFriendQueryKey,
  useGetFriend,
} from '../../../friend/common/hooks/use-get-friend.hook';
import { useReplyFriend } from '../../../friend/common/hooks/use-reply-friend.hook';
import { FriendRequestAction } from '../../../friend/common/interfaces/req/friend-request.req.dto';
import { useGetConversationByUser } from '../../../message/common/hooks/use-get-conversation-by-user';
import { useAppSelector } from '../../../redux/hook';
import { addConversationMessageBox } from '../../../redux/slices/message.slice';
import {
  setEditProfileModal,
  viewingProfileUserIdSelector,
} from '../../../redux/slices/profile.slice';
import { useViewingProfile } from '../../common/hooks/use-viewing-profile';

type UserProfileTitleActionProps = {
  afterMutateFriend: () => any;
};

export const UserProfileTitleAction = ({
  afterMutateFriend,
}: UserProfileTitleActionProps) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userId = useAppSelector(viewingProfileUserIdSelector) as number;
  const { userProfile: authData } = useAuth();
  const { data: currentProfile } = useViewingProfile(userId);
  const { data: friendRequest, isLoading: isLoadingFriend } = useGetFriend(
    currentProfile!.user.id,
  );
  const { data: conversation, isLoading: isLoadingConversation } =
    useGetConversationByUser(
      currentProfile!.user.id,
      authData?.user.id !== currentProfile?.user.id,
    );
  const [isOpenRespondFriend, setIsOpenRespondFriend] = useState(false);
  const [isOpenEditFriend, setIsOpenEditFriend] = useState(false);
  const responseFriendRef = useRef<HTMLButtonElement | null>(null);
  const editFriendRef = useRef<HTMLButtonElement | null>(null);
  const { mutate: addFriend, isLoading: isLoadingAddFriend } = useAddFriend({
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(genGetFriendQueryKey(userId));
      afterMutateFriend();
    },
    onError(error, variables, context) {
      console.log('add friend error', error);
    },
  });
  const { mutate: replyFriend, isLoading: isLoadingReplyFriend } =
    useReplyFriend({
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(genGetFriendQueryKey(userId));
        afterMutateFriend();
      },
      onError(error, variables, context) {},
    });
  const { mutate: deleteFriendRequest, isLoading: isLoadingDeleteFriend } =
    useDeleteFriendRequest({
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(genGetFriendQueryKey(userId));
        afterMutateFriend();
      },
      onError(error, variables, context) {
        console.log('delete friend request error', error);
      },
    });
  const isFriend = friendRequest?.status === FriendRequestStatus.ACCEPTED;
  const isFriendRequestor =
    friendRequest?.status === FriendRequestStatus.PENDING &&
    friendRequest?.requesterId === authData?.user.id;
  const isFriendBeRequested =
    friendRequest?.status === FriendRequestStatus.PENDING &&
    friendRequest?.beRequestedId === authData?.user.id;
  const isNotFriend = !friendRequest;

  const isMyProfile = authData?.user?.id === currentProfile?.user?.id;

  const handleAddFriend = () => {
    addFriend(userId);
  };

  const handleDeleteFriendRequest = () => {
    deleteFriendRequest(userId);
  };

  const handleReplyFriendRequest = (action: FriendRequestAction) => {
    replyFriend({ friendRequestId: friendRequest!.id, action });
  };

  const handleSendMessage = () => {
    if (isLoadingConversation) return;
    if (conversation) {
      dispatch(
        addConversationMessageBox({ isNewConversation: false, conversation }),
      );
    } else {
      dispatch(
        addConversationMessageBox({
          isNewConversation: true,
          userProfile: currentProfile,
        }),
      );
    }
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!responseFriendRef.current?.contains(e.target as any)) {
        setIsOpenRespondFriend(false);
      }
      if (!editFriendRef.current?.contains(e.target as any)) {
        setIsOpenEditFriend(false);
      }
    };
    document.addEventListener('click', handle);

    return () => {
      document.removeEventListener('click', handle);
    };
  }, []);

  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="end"
      spacing="10px"
      marginBottom="16px"
    >
      {isMyProfile && (
        <>
          <Button variant="contained">
            <Stack direction="row" alignItems="center">
              <Add />
              <Typography
                variant="body1"
                textTransform="none"
                fontSize="0.9375rem"
              >
                Add to story
              </Typography>
            </Stack>
          </Button>
          <Button
            variant="contained"
            color="secondaryButton"
            onClick={() => dispatch(setEditProfileModal(true))}
          >
            <Stack direction="row" alignItems="center">
              <Add />
              <Typography
                variant="body1"
                textTransform="none"
                fontSize="0.9375rem"
              >
                Edit profile
              </Typography>
            </Stack>
          </Button>
        </>
      )}

      {!isMyProfile && isFriend && (
        <>
          <Button
            variant="contained"
            color="secondaryButton"
            ref={editFriendRef}
            onClick={() => setIsOpenEditFriend(true)}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              position="relative"
            >
              {isLoadingDeleteFriend ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                <PersonAdd />
              )}
              <Typography textTransform="none" fontSize="0.9375rem">
                Friends
              </Typography>

              <Box
                display={isOpenEditFriend ? 'block' : 'none'}
                position="absolute"
                padding="10px"
                height="fit-content"
                bgcolor="darkAccent.main"
                zIndex="10"
                top="calc(100% + 10px)"
                borderRadius="10px"
                boxShadow={CARD_BOX_SHADOW}
                textAlign="left"
              >
                <Box
                  padding="6px"
                  sx={{ ':hover': { bgcolor: 'hoverColor.main' } }}
                  borderRadius="4px"
                  onClick={() => handleDeleteFriendRequest()}
                >
                  Unfriend
                </Box>
              </Box>
            </Stack>
          </Button>
          <Button variant="contained" onClick={handleSendMessage}>
            <Stack direction="row" alignItems="center" spacing="8px">
              <Message />
              <Typography textTransform="none" fontSize="0.9375rem">
                Message
              </Typography>
            </Stack>
          </Button>
        </>
      )}

      {!isMyProfile && isNotFriend && (
        <>
          <Button variant="contained" onClick={handleAddFriend}>
            <Stack direction="row" alignItems="center" spacing="8px">
              {isLoadingAddFriend ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                <PersonAdd />
              )}
              <Typography
                variant="body1"
                textTransform="none"
                fontSize="0.9375rem"
              >
                Add friend
              </Typography>
            </Stack>
          </Button>
          <Button
            variant="contained"
            color="secondaryButton"
            onClick={handleSendMessage}
          >
            <Stack direction="row" alignItems="center" spacing="8px">
              <Message />
              <Typography
                variant="body1"
                textTransform="none"
                fontSize="0.9375rem"
              >
                Message
              </Typography>
            </Stack>
          </Button>
        </>
      )}

      {!isMyProfile && isFriendRequestor && (
        <>
          <Button variant="contained" onClick={handleDeleteFriendRequest}>
            <Stack direction="row" alignItems="center" position="relative">
              {isLoadingDeleteFriend ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                <PersonRemove />
              )}
              <Typography
                variant="body1"
                textTransform="none"
                fontSize="0.9375rem"
                ml="8px"
              >
                Cancel Request
              </Typography>
            </Stack>
          </Button>
          <Button
            variant="contained"
            color="secondaryButton"
            onClick={handleSendMessage}
          >
            <Stack direction="row" alignItems="center" spacing="8px">
              <Message />
              <Typography
                variant="body1"
                textTransform="none"
                fontSize="0.9375rem"
              >
                Message
              </Typography>
            </Stack>
          </Button>
        </>
      )}

      {!isMyProfile && isFriendBeRequested && (
        <>
          <Button
            variant="contained"
            onClick={() => setIsOpenRespondFriend(true)}
            ref={responseFriendRef}
          >
            <Stack direction="row" alignItems="center" position="relative">
              {isLoadingDeleteFriend ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                <PersonAdd />
              )}
              <Typography
                variant="body1"
                textTransform="none"
                fontSize="0.9375rem"
                ml="8px"
              >
                Respond
              </Typography>

              <Box
                display={isOpenRespondFriend ? 'block' : 'none'}
                position="absolute"
                padding="10px"
                height="fit-content"
                bgcolor="darkAccent.main"
                zIndex="10"
                top="calc(100% + 10px)"
                borderRadius="10px"
                boxShadow={CARD_BOX_SHADOW}
                textAlign="left"
              >
                <Box
                  padding="6px"
                  sx={{ ':hover': { bgcolor: 'hoverColor.main' } }}
                  borderRadius="4px"
                  onClick={() => handleReplyFriendRequest('ACCEPTED')}
                >
                  Confirm
                </Box>
                <Box
                  padding="6px"
                  whiteSpace="nowrap"
                  sx={{ ':hover': { bgcolor: 'hoverColor.main' } }}
                  borderRadius="4px"
                  onClick={handleDeleteFriendRequest}
                >
                  Delete request
                </Box>
              </Box>
            </Stack>
          </Button>
          <Button
            variant="contained"
            color="secondaryButton"
            onClick={handleSendMessage}
          >
            <Stack direction="row" alignItems="center" spacing="8px">
              <Message />
              <Typography
                variant="body1"
                textTransform="none"
                fontSize="0.9375rem"
              >
                Message
              </Typography>
            </Stack>
          </Button>
        </>
      )}

      <Button
        variant="contained"
        color="secondaryButton"
        sx={{ paddingX: '0px' }}
      >
        <KeyboardArrowDown fontSize="medium" />
      </Button>
    </Stack>
  );
};
