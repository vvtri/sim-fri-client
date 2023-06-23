import { TextField } from '@mui/material';
import { DateField } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';

type DateFieldProps = {
  name: string;
  label?: string;
  textFieldProps?: Parameters<typeof TextField>[0];
};

export default function RHFDateField({
  name,
  label,
  textFieldProps,
}: DateFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DateField
          label={label}
          value={value}
          format="DD/MM/YYYY"
          onChange={(event) => {
            onChange(event);
          }}
          slotProps={{ textField: textFieldProps }}
          helperText={error?.message}
          FormHelperTextProps={{ sx: { color: 'error.main' } }}
          slots={<TextField {...textFieldProps} />}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? '#d32f2f !important' : 'rgba(0, 0, 0, 0.23)',
              color: error ? 'error.main' : 'rgba(0, 0, 0, 0.6)',
            },
            '& .MuiFormLabel-root': {
              color: error ? 'error.main' : 'rgba(0, 0, 0, 0.6)',
            },
          }}
        />
      )}
    />
  );
}
