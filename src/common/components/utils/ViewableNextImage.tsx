import Image, { ImageProps } from 'next/image';
import { useAppDispatch } from '../../../redux/hook';
import { setViewImageUrl } from '../../../redux/slices/common.slice';

type ViewableNextImageProps = ImageProps & {};

export const ViewableNextImage = ({
  style,
  ...rest
}: ViewableNextImageProps) => {
  const dispatch = useAppDispatch();

  const handleClickImage = () => {
    const src = rest.src;
    if (typeof src == 'string') {
      dispatch(setViewImageUrl(src));
    }
  };

  return (
    <Image
      {...rest}
      style={{ cursor: 'pointer', ...style }}
      onClick={handleClickImage}
    />
  );
};
