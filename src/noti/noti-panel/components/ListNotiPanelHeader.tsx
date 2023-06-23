import { MoreHoriz } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { Center } from '../../../common/components/utils/Center';

export const ListNotiPanelHeader = () => {
  return (
    <Stack color="primaryText.main" mt="15px" px='10px'>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontSize="1.5rem" fontWeight="700">
          Notifications
        </Typography>

        <Center
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            ':hover': { bgcolor: 'hoverColor.main' },
            cursor: 'pointer',
          }}
        >
          <MoreHoriz sx={{ width: '20px', height: '20px' }} />
        </Center>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontSize="1.0625rem" fontWeight="600">
          Earlier
        </Typography>

        <Button color="primary" variant="text">
          See all
        </Button>
      </Stack>
    </Stack>
  );
};
