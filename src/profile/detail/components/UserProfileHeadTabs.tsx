import { BoxProps, Stack, styled } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  profileTabValueSelector,
  viewingProfileUserIdSelector,
} from '../../../redux/slices/profile.slice';
import { ProfileTabs } from '../../common/enums/profile.enum';

const CustomTab = styled(Box)<BoxProps>(({ theme }) => ({
  fontSize: '0.9375rem',
  fontWeight: '600',
  height: '60px',
  padding: '0 16px 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: '.3s',
  borderRadius: '10px',
  position: 'relative',
}));

export const UserProfileHeadTabs = () => {
  const tabValue = useAppSelector(profileTabValueSelector);
  const dispatch = useAppDispatch();
  const userId = useAppSelector(viewingProfileUserIdSelector) as number;

  return (
    <Box>
      <Stack direction="row">
        <Link href={`/profile/${userId}`}>
          <CustomTab
            color={
              tabValue === ProfileTabs.POST
                ? 'primary.main'
                : 'secondaryText.main'
            }
            sx={{
              '&:hover': {
                backgroundColor:
                  tabValue === ProfileTabs.POST ? 'unset' : 'hoverColor.main',
              },
            }}
          >
            Posts
            <Box
              position="absolute"
              bottom="0"
              left="0"
              width="100%"
              bgcolor="primary.main"
              height={tabValue === ProfileTabs.POST ? '3px' : '0'}
            />
          </CustomTab>
        </Link>

        <Link href={`/profile/${userId}/about`}>
          <CustomTab
            color={
              tabValue === ProfileTabs.ABOUT
                ? 'primary.main'
                : 'secondaryText.main'
            }
            sx={{
              '&:hover': {
                backgroundColor:
                  tabValue === ProfileTabs.ABOUT ? 'unset' : 'hoverColor.main',
              },
            }}
          >
            About
            <Box
              position="absolute"
              bottom="0"
              left="0"
              width="100%"
              bgcolor="primary.main"
              height={tabValue === ProfileTabs.ABOUT ? '3px' : '0'}
            />
          </CustomTab>
        </Link>

        <Link href={`/profile/${userId}/friends`}>
          <CustomTab
            color={
              tabValue === ProfileTabs.FRIEND
                ? 'primary.main'
                : 'secondaryText.main'
            }
            sx={{
              '&:hover': {
                backgroundColor:
                  tabValue === ProfileTabs.FRIEND ? 'unset' : 'hoverColor.main',
              },
            }}
          >
            Friends
            <Box
              position="absolute"
              bottom="0"
              left="0"
              width="100%"
              bgcolor="primary.main"
              height={tabValue === ProfileTabs.FRIEND ? '3px' : '0'}
            />
          </CustomTab>
        </Link>

        <Link href={`/profile/${userId}/photos`}>
          <CustomTab
            color={
              tabValue === ProfileTabs.PHOTO
                ? 'primary.main'
                : 'secondaryText.main'
            }
            sx={{
              '&:hover': {
                backgroundColor:
                  tabValue === ProfileTabs.PHOTO ? 'unset' : 'hoverColor.main',
              },
            }}
          >
            Photos
            <Box
              position="absolute"
              bottom="0"
              left="0"
              width="100%"
              bgcolor="primary.main"
              height={tabValue === ProfileTabs.PHOTO ? '3px' : '0'}
            />
          </CustomTab>
        </Link>

        <Link href={`/profile/${userId}/videos`}>
          <CustomTab
            color={
              tabValue === ProfileTabs.VIDEO
                ? 'primary.main'
                : 'secondaryText.main'
            }
            sx={{
              '&:hover': {
                backgroundColor:
                  tabValue === ProfileTabs.VIDEO ? 'unset' : 'hoverColor.main',
              },
            }}
          >
            Videos
            <Box
              position="absolute"
              bottom="0"
              left="0"
              width="100%"
              bgcolor="primary.main"
              height={tabValue === ProfileTabs.VIDEO ? '3px' : '0'}
            />
          </CustomTab>
        </Link>
      </Stack>
    </Box>
  );
};
