import { Info } from '@mui/icons-material';
import { Dialog, Stack, Typography } from '@mui/material';

type InvalidCallDialogProps = {
  isOpen: boolean;
};

export const LeaveCallDialog = ({ isOpen }: InvalidCallDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        sx: {
          backgroundColor: 'darkAccent.main',
          color: 'white',
          width: '80%',
          height: '80%',
        },
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        direction="row"
        color="primary.main"
      >
        <Info fontSize="large" />
        <Typography ml="10px" fontSize="1rem">
          You leaved this call
        </Typography>
      </Stack>
    </Dialog>
  );
};
