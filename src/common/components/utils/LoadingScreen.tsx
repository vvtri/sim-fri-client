import { CircularProgress } from '@mui/material';
import { Center } from './Center';

export const LoadingScreen = () => {
  return (
    <Center
      position="fixed"
      width="100%"
      height="100%"
      left="0"
      top="0"
      zIndex="1500"
    >
      <CircularProgress sx={{ width: '30%', height: '30%' }} />
    </Center>
  );
};
