import { Box, BoxProps } from '@mui/material';
import { useAppDispatch } from '../../../redux/hook';
import { setViewImageUrl } from '../../../redux/slices/common.slice';

type ViewableImageProps = BoxProps<'img'> & {};

export const ViewableImage = ({ sx, ...rest }: ViewableImageProps) => {
  const dispatch = useAppDispatch();

  const handleClickImage = () => {
    const src = rest.src;
    if (typeof src == 'string') {
      dispatch(setViewImageUrl(src));
    }
  };

  return (
    <Box
      {...rest}
      sx={{ cursor: 'pointer', ...sx }}
      onClick={handleClickImage}
    />
  );
};
