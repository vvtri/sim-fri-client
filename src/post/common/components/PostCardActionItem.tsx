import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type PostCardActionItemProps = {
  icon: ReactNode;
  content: string;
  onClick: () => any;
};

export const PostCardActionItem = ({
  content,
  icon,
  onClick,
}: PostCardActionItemProps) => {
  return (
    <Stack
      direction="row"
      p="10px"
      sx={{ ':hover': { bgcolor: 'hoverColor.main' }, cursor: 'pointer' }}
      borderRadius="5px"
      spacing="10px"
      onClick={onClick}
    >
      <Box sx={{ width: '20px', height: '20px' }}>{icon}</Box>
      <Typography fontSize="0.9375rem" fontWeight="500">
        {content}
      </Typography>
    </Stack>
  );
};
