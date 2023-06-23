import { PeopleAlt } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { MouseEventHandler } from 'react';

type FriendLeftPanelItemProps = {
  isActive?: boolean;
  content: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  icon: JSX.Element
};

export const FriendLeftPanelItem = ({
  isActive,
  content,
  onClick,
  icon
}: FriendLeftPanelItemProps) => {
  return (
    <Stack
      direction="row"
      padding="10px"
      spacing="10px"
      onClick={onClick}
      borderRadius="10px"
      bgcolor={isActive ? 'hoverColor.main' : 'unset'}
      sx={{
        '&:hover': { bgcolor: 'hoverColor.main' },
        cursor: 'pointer',
        transition: '.3s',
      }}
      alignItems="center"
    >
      <Stack
        borderRadius="50%"
        width="36px"
        height="36px"
        alignItems="center"
        justifyContent="center"
        bgcolor={isActive ? 'primary.main' : 'comment.main'}
        sx={{ transition: '.3s' }}
      >
        {
          icon
        }
       
      </Stack>
      <Typography fontSize="1.0625rem" fontWeight="500">
        {content}
      </Typography>
    </Stack>
  );
};
