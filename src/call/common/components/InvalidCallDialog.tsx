import { Error } from '@mui/icons-material';
import { Dialog, Stack, Typography } from '@mui/material';

type InvalidCallDialogProps = {
  isOpen: boolean;
};

export const InvalidCallDialog = ({ isOpen }: InvalidCallDialogProps) => {
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
        color="error.main"
      >
        <Error fontSize="large" />
        <Typography ml="10px" fontSize="1rem">
          Invalid call, please try again
        </Typography>
      </Stack>
    </Dialog>
  );
};
