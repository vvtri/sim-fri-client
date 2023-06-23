import { Search } from '@mui/icons-material';
import { TextField, TextFieldProps } from '@mui/material';

type SearchInputProps = TextFieldProps;

export const SearchInput = ({ InputProps, sx, ...rest }: SearchInputProps) => {
  return (
    <TextField
      size="small"
      InputProps={{
        sx: { borderRadius: '30px', color: 'primaryText.main' },
        startAdornment: <Search />,
        ...InputProps,
      }}
      placeholder="Search"
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: 'comment.main',
          '& fieldset': { border: 'none' },
          '&:hover fieldset': { border: 'none' },
          '&.Mui-focused fieldset': { border: 'green' },
        },
        ...sx,
      }}
      {...rest}
    />
  );
};
