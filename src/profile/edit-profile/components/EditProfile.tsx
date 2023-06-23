import { DevTool } from '@hookform/devtools';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import FormProvider from '../../../common/components/hook-forms/FormProvider';
import RHFDateField from '../../../common/components/hook-forms/RHFDateField';
import AuthLayout from '../../../common/layouts/AuthLayout';
import { addSnackBar } from '../../../common/utils/snackbar.util';
import { useAppDispatch } from '../../../redux/hook';
import { setAuth } from '../../../redux/slices/auth.slice';
import { useUpdateProfile } from '../../common/hooks/use-update-profile';
import { getMyProfile } from '../../common/services/profile.service';
import {
  IEditProfileForm,
  editProfileSchema,
} from '../schemas/edit-profile.schema';

export const EditProfile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const methods = useForm<IEditProfileForm>({
    resolver: yupResolver(editProfileSchema),
  });
  const { register, control, formState, handleSubmit, setError, getValues } =
    methods;
  const { errors } = formState;

  const { mutate, isLoading } = useUpdateProfile({
    async onSuccess(data, variables, context) {
      const profile = await getMyProfile();
      dispatch(setAuth({ isLoading: false, userProfile: profile }));
    },
    onError(error, variables, context) {
      addSnackBar({ variant: 'error', message: 'Update profile failed' });
    },
  });

  const handleUpdateProfile: Parameters<typeof handleSubmit>[0] = async (
    value,
  ) => {
    mutate(value);
  };

  return (
    <AuthLayout>
      <Box
        bgcolor="white"
        padding={{ md: '20px 15px 20px' }}
        width="100%"
        maxWidth="400px"
      >
        <FormProvider
          onSubmit={handleSubmit(handleUpdateProfile)}
          methods={methods}
        >
          <Stack direction="column" width="100%" spacing="12px">
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h4" fontWeight="bold">
                Update profile
              </Typography>
            </Box>

            <TextField
              variant="outlined"
              label="Name"
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message as any}
              sx={{ ml: '8px' }}
              {...register('name')}
            />

            <TextField
              variant="outlined"
              label="Address"
              fullWidth
              error={Boolean(errors.address)}
              helperText={errors.address?.message as any}
              sx={{ ml: '8px' }}
              {...register('address')}
            />

            <RHFDateField name="birthDate" label="Birth date" />

            <LoadingButton
              color="primary"
              variant="contained"
              fullWidth
              sx={{ fontSize: '16px' }}
              type="submit"
              loading={isLoading}
            >
              Save
            </LoadingButton>
          </Stack>
        </FormProvider>

        <DevTool control={control} />
      </Box>
    </AuthLayout>
  );
};
