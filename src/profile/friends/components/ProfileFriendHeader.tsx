import { Button, Stack, styled, Typography } from '@mui/material';
import Link from 'next/link';
import { SearchInput } from '../../../common/components/utils/SearchInput';
import { useAuth } from '../../../common/hooks/use-auth';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  setViewProfileFriendSearchText,
  viewingProfileUserIdSelector,
  viewProfileSearchTextSelector,
} from '../../../redux/slices/profile.slice';

const CustomButton = styled(Button)(({ theme }) => ({
  ':hover': {
    backgroundColor: theme.palette.comment.main,
  },
  fontSize: '0.9375rem',
  color: 'primary.main',
  borderRadius: '6px',
}));

export const ProfileFriendHeader = () => {
  const dispatch = useAppDispatch();
  const searchText = useAppSelector(viewProfileSearchTextSelector);
  const { userProfile: authData } = useAuth();
  const userId = useAppSelector(viewingProfileUserIdSelector);

  const isMyProfile = authData?.user.id === userId;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography fontWeight="700" fontSize="1.25rem" color="primaryText.main">
        Friends
      </Typography>

      <Stack direction="row" spacing="10px">
        <SearchInput
          value={searchText}
          onChange={(e) =>
            dispatch(setViewProfileFriendSearchText(e.target.value))
          }
        />

        {isMyProfile && (
          <>
            <CustomButton color="primary">
              <Link href="/friends">Friend requests</Link>
            </CustomButton>
            <CustomButton color="primary">
              <Link href="/friends">Find friends</Link>
            </CustomButton>
          </>
        )}
      </Stack>
    </Stack>
  );
};
