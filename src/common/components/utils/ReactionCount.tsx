import { Box, Stack, Typography } from '@mui/material';
import { PostReactionType } from 'shared';
import { IMAGE_PATHS } from '../../constants/index.constant';

type ReactionCountProps = {
  totalCount: number;
  likeCount: number;
  loveCount: number;
  angryCount: number;
  bgcolor?: string;
};

export const ReactionCount = ({
  angryCount,
  likeCount,
  loveCount,
  totalCount,
  bgcolor,
}: ReactionCountProps) => {
  const reactionArr = [
    { type: PostReactionType.ANGRY, value: angryCount },
    { type: PostReactionType.LOVE, value: loveCount },
    { type: PostReactionType.LIKE, value: likeCount },
  ].filter((item) => item.value);
  reactionArr.sort((a, b) => b.value - a.value);

  return (
    <Stack
      direction="row"
      alignItems="center"
      bgcolor={bgcolor ? bgcolor : 'comment.main'}
      borderRadius="18px"
      px="2px"
    >
      <Stack direction="row" spacing="-4px">
        {reactionArr.map((item, idx) => {
          switch (item.type) {
            case PostReactionType.LIKE:
              return (
                <Box
                  key={idx}
                  width="18px"
                  component="img"
                  src={IMAGE_PATHS.LIKE_ICON}
                  zIndex={reactionArr.length - idx}
                />
              );

            case PostReactionType.LOVE:
              return (
                <Box
                  key={idx}
                  width="18px"
                  component="img"
                  src={IMAGE_PATHS.LOVE_ICON}
                  zIndex={reactionArr.length - idx}
                />
              );

            default:
              return (
                <Box
                  key={idx}
                  width="18px"
                  component="img"
                  src={IMAGE_PATHS.ANGRY_ICON}
                  zIndex={reactionArr.length - idx}
                />
              );
          }
        })}
      </Stack>

      {totalCount ? (
        <Typography
          fontSize="0.9375rem"
          sx={{
            ml: '6px',
            ':hover': { textDecoration: 'underline' },
            cursor: 'pointer',
          }}
        >
          {totalCount}
        </Typography>
      ) : (
        <></>
      )}
    </Stack>
  );
};
