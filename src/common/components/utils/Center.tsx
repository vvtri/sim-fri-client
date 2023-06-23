import { Box, BoxProps } from '@mui/system';
import { forwardRef } from 'react';

type CenterProps = BoxProps;

export const Center = forwardRef<HTMLDivElement | null, CenterProps>(
  ({ children, ...rest }: CenterProps, ref) => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        ref={ref}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

Center.displayName = 'Center'
