import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../common/hooks/use-auth';
import {
  setEditProfileModal,
  viewingProfileUserIdSelector,
} from '../../../redux/slices/profile.slice';
import { useViewingProfile } from '../../common/hooks/use-viewing-profile';

type UserProfileIntroCardProps = {};

export const UserProfileIntroCard = ({}: UserProfileIntroCardProps) => {
  const dispatch = useDispatch();
  const { userProfile: authData } = useAuth();
  const userId = useSelector(viewingProfileUserIdSelector);
  const { data: userProfile } = useViewingProfile(userId as number);
  const isMyProfile = authData?.user?.id === userProfile?.user?.id;

  const handleClickEditProfile = () => {
    dispatch(setEditProfileModal(true));
  };

  return (
    <Card>
      <CardHeader
        title="Intro"
        titleTypographyProps={{ fontSize: '1.25rem', fontWeight: 700 }}
      />
      <CardContent>
        <Stack spacing="18px" fontSize="0.9375rem" color="#E4E6EB">
          {userProfile?.workplace ? (
            <Stack direction="row" spacing="6px">
              <WorkIcon />

              <Typography>Works at</Typography>
              <Typography sx={{ textDecoration: 'underline' }} color="white">
                {userProfile?.workplace}
              </Typography>
            </Stack>
          ) : isMyProfile ? (
            <Button
              variant="contained"
              color="secondaryButton"
              fullWidth
              sx={{ textTransform: 'none' }}
              onClick={handleClickEditProfile}
            >
              Add workplace
            </Button>
          ) : (
            <Stack direction="row" spacing="6px">
              <WorkIcon />

              <Typography>No workplace to show</Typography>
            </Stack>
          )}

          {userProfile?.address ? (
            <Stack direction="row" spacing="6px">
              <HomeIcon />
              <Stack
                alignItems="center"
                direction="row"
                textTransform="capitalize"
                spacing="6px"
              >
                <Typography>Lives in</Typography>
                <Typography sx={{ textDecoration: 'underline' }} color="white">
                  {userProfile?.address}
                </Typography>
              </Stack>
            </Stack>
          ) : isMyProfile ? (
            <Button
              variant="contained"
              color="secondaryButton"
              fullWidth
              sx={{ textTransform: 'none' }}
              onClick={handleClickEditProfile}
            >
              Add address
            </Button>
          ) : (
            <Stack direction="row" spacing="6px">
              <HomeIcon />
              <Stack
                alignItems="center"
                direction="row"
                textTransform="capitalize"
                spacing="6px"
              >
                <Typography>No address to show</Typography>
              </Stack>
            </Stack>
          )}

          {userProfile?.hometown ? (
            <Stack direction="row" spacing="6px">
              <PlaceIcon />
              <Stack
                alignItems="center"
                direction="row"
                textTransform="capitalize"
                spacing="6px"
              >
                <Typography>From</Typography>
                <Typography sx={{ textDecoration: 'underline' }} color="white">
                  {userProfile?.hometown}
                </Typography>
              </Stack>
            </Stack>
          ) : isMyProfile ? (
            <Button
              variant="contained"
              color="secondaryButton"
              fullWidth
              sx={{ textTransform: 'none' }}
              onClick={handleClickEditProfile}
            >
              Add hometown
            </Button>
          ) : (
            <Stack direction="row" spacing="6px">
              <PlaceIcon />
              <Stack
                alignItems="center"
                direction="row"
                textTransform="capitalize"
                spacing="6px"
              >
                <Typography>No hometown to show</Typography>
              </Stack>
            </Stack>
          )}

          {userProfile?.school ? (
            <Stack direction="row" spacing="6px">
              <SchoolIcon />
              <Stack
                alignItems="center"
                direction="row"
                textTransform="capitalize"
                spacing="6px"
              >
                <Typography>Studied at</Typography>
                <Typography sx={{ textDecoration: 'underline' }} color="white">
                  {userProfile?.school}
                </Typography>
              </Stack>
            </Stack>
          ) : isMyProfile ? (
            <Button
              variant="contained"
              color="secondaryButton"
              fullWidth
              sx={{ textTransform: 'none' }}
              onClick={handleClickEditProfile}
            >
              Add school
            </Button>
          ) : (
            <Stack direction="row" spacing="6px">
              <SchoolIcon />
              <Stack
                alignItems="center"
                direction="row"
                textTransform="capitalize"
                spacing="6px"
              >
                <Typography>No school to show</Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};