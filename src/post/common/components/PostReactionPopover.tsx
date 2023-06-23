import { Box, Collapse, Stack } from '@mui/material';
import { PostReactionType } from 'shared';
import { IMAGE_PATHS } from '../../../common/constants/index.constant';

type PostReactionPopoverProps = {
  isShow: boolean;
  handleReact: (type: any) => any;
};

export const PostReactionPopover = ({
  handleReact,
  isShow,
}: PostReactionPopoverProps) => {
  return (
    <Collapse in={isShow}>
      <Stack
        position="absolute"
        bottom="calc(100% + 10px)"
        left="0"
        direction="row"
        spacing="6px"
        zIndex="10"
        bgcolor="darkAccent.main"
        borderRadius="19px"
        ml='-15px'
        p='2px'
      >
        <Box
          width="39px"
          component="img"
          src={IMAGE_PATHS.LIKE_ICON}
          onClick={() => handleReact(PostReactionType.LIKE)}
        />
        <Box
          width="39px"
          component="img"
          src={IMAGE_PATHS.LOVE_ICON}
          onClick={() => handleReact(PostReactionType.LOVE)}
        />
        <Box
          width="39px"
          component="img"
          src={IMAGE_PATHS.ANGRY_ICON}
          onClick={() => handleReact(PostReactionType.ANGRY)}
        />
      </Stack>
    </Collapse>
  );
};
