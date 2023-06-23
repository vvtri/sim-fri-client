import { Box, Stack, Typography } from '@mui/material';
import { PostReactionType } from 'shared';
import { IMAGE_PATHS } from '../../../common/constants/index.constant';

type ReactionButtonProps = {
  reaction: PostReactionType;
  onClick?: () => any;
};

export const ReactionButton = ({ reaction, onClick }: ReactionButtonProps) => {
  let iconPath: string = '';
  let reactionText: string = '';
  let color: string = '';

  switch (reaction) {
    case PostReactionType.LIKE:
      reactionText = 'Like';
      iconPath = IMAGE_PATHS.LIKE_ICON;
      color = 'rgb(32, 120, 244)';
      break;
    case PostReactionType.LOVE:
      reactionText = 'Love';
      iconPath = IMAGE_PATHS.LOVE_ICON;
      color = 'rgb(243, 62, 88)';
      break;
    case PostReactionType.ANGRY:
      reactionText = 'Angry';
      iconPath = IMAGE_PATHS.ANGRY_ICON;
      color = 'rgb(233, 113, 15)';
      break;
  }

  return (
    <Stack direction="row" spacing="4px" alignItems="center" onClick={onClick}>
      <Box width="18px" component="img" src={iconPath} />
      <Typography fontWeight="inherit" color={color}>
        {reactionText}
      </Typography>
    </Stack>
  );
};
