import { Box, BoxProps } from '@mui/material';
import { IFile } from '../../../file/common/models/file.model';
import { ViewableImage } from './ViewableImage';

type ImageListProps = BoxProps & {
  files: IFile[];
};

export const CustomImageList = ({ files, ...rest }: ImageListProps) => {
  return (
    <Box display="flex" width="100%" gap="10px" flexWrap="wrap" {...rest}>
      {files?.map((item) => (
        <Box
          key={item.id}
          position="relative"
          width="fit-content"
          maxWidth="100%"
        >
          <ViewableImage
            component="img"
            src={item.url}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            width="100%"
          />
        </Box>
      ))}
    </Box>
  );
};
