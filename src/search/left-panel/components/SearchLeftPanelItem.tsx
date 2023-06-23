import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Center } from '../../../common/components/utils/Center';

type SearchLeftPanelItemProps = {
  isActive?: boolean;
  text: string;
  icon: ReactNode;
  onClick?: () => any;
};

export const SearchLeftPanelItem = ({
  isActive,
  icon,
  text,
  onClick,
}: SearchLeftPanelItemProps) => {
  return (
    <Stack
      direction="row"
      width="100%"
      alignItems="center"
      sx={{
        ':hover': { bgcolor: 'hoverColor.main' },
        cursor: 'pointer',
        transition: '.3s',
      }}
      bgcolor={isActive ? 'hoverColor.main' : 'initial'}
      p="10px"
      spacing="10px"
      borderRadius="10px"
      onClick={onClick}
    >
      <Center
        bgcolor={isActive ? 'primary.main' : 'comment.main'}
        color="inherit"
        borderRadius="50%"
        width="40px"
        height="40px"
        sx={{ transition: '.3s' }}
      >
        {icon}
      </Center>

      <Typography fontSize="0.9375rem" fontWeight="600">
        {text}
      </Typography>
    </Stack>
  );
};
