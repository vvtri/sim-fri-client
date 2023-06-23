import { Stack, Typography } from '@mui/material';
import Link from 'next/link';

type HomeShortcutItemProps = {
  link: string;
  title: string;
  image: JSX.Element;
};

export const HomeShortcutItem = ({
  title,
  link,
  image,
}: HomeShortcutItemProps) => {
  return (
    <Link href={link}>
      <Stack
        direction="row"
        alignItems="center"
        mx="8px"
        color="primaryText.main"
        sx={{ '&:hover': { bgcolor: 'hoverColor.main' } }}
        spacing="10px"
        borderRadius="10px"
        py='6px'
      >
        {image}
        <Typography fontSize="0.9375rem" fontWeight="600">
          {title}
        </Typography>
      </Stack>
    </Link>
  );
};
