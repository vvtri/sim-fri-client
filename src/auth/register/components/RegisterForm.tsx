import { DevTool } from '@hookform/devtools';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import FormProvider from '../../../common/components/hook-forms/FormProvider';
import { RHFPassword } from '../../../common/components/hook-forms/RHFPassword';
import { DEFAULT_MESSAGE } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { IApiError } from '../../../common/interfaces/api-error.interface';
import { AuthStatusCode } from '../../../common/status-code/auth.status-code';
import { useAppDispatch } from '../../../redux/hook';
import {
  setVerifyUserEmail,
  setVerifyUserStep,
} from '../../../redux/slices/verify-user.slice';
import { useRegister } from '../../common/hooks/use-register';
import { IRegisterForm, registerSchema } from '../schemas/register.schema';

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userProfile: user } = useAuth();

  const methods = useForm<IRegisterForm>({
    resolver: yupResolver(registerSchema),
  });
  const { register, control, formState, handleSubmit, setError, getValues } =
    methods;
  const { errors } = formState;

  const { mutate, isLoading } = useRegister({
    onSuccess(data, variables, context) {
      dispatch(setVerifyUserEmail(getValues().email));
      dispatch(setVerifyUserStep('CODE'));
      router.push('/auth/verification');
    },
    onError(error, variables, context) {
      let msg = DEFAULT_MESSAGE;
      if (axios.isAxiosError(error)) {
        const res = error.response?.data as IApiError;
        switch (res.statusCode) {
          case AuthStatusCode.USER_EXISTED:
            msg = 'Email đã tồn tại';
            break;
        }
      }
      setError('root', { message: msg });
    },
  });

  return (
    <Box
      bgcolor="white"
      padding={{ md: '20px 15px 20px' }}
      width="100%"
      maxWidth="400px"
    >
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <Stack direction="column" width="100%" spacing="12px">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4" fontWeight="bold">
              Đăng ký
            </Typography>
          </Box>
          <FormControl>
            <TextField
              variant="outlined"
              color="primary"
              label="Email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message as any}
              {...register('email')}
            />
          </FormControl>
          <RHFPassword label="Mật khẩu" name="password" />
          <RHFPassword
            name="rePassword"
            label="Nhập lại mật khẩu"
            variant="outlined"
            color="primary"
            fullWidth
          />
          <Box>
            <LoadingButton
              color="primary"
              variant="contained"
              fullWidth
              sx={{ fontSize: '16px' }}
              type="submit"
              loading={isLoading}
            >
              Đăng ký
            </LoadingButton>
          </Box>
          {errors.root?.message && (
            <FormHelperText error>{errors.root?.message}</FormHelperText>
          )}
          <Stack
            mt="12px"
            alignItems="center"
            justifyContent="space-between"
            direction="row"
            paddingX={{ md: '20px' }}
          >
            <Link href="/auth/reset-password">
              <Typography
                paragraph
                fontSize="14px"
                fontWeight={500}
                color="primary.main"
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                Quên mật khẩu
              </Typography>
            </Link>

            <Link href="/auth/verification/resend">
              <Typography
                paragraph
                fontSize="14px"
                fontWeight={500}
                color="primary.main"
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                Gửi lại mã xác thực
              </Typography>
            </Link>
          </Stack>
          <Box
            margin="20px 0"
            bgcolor="#dadde1"
            height="1px"
            width="100%"
          ></Box>
          <Stack justifyContent="center">
            <Box
              component="button"
              margin="auto"
              bgcolor="secondary.main"
              borderRadius="6px"
              padding="0 16px"
              height={{ md: '48px' }}
              sx={{ '&:hover': { bgcolor: 'secondary.dark' } }}
              lineHeight="48px"
              fontWeight="bold"
            >
              <Link href="/auth/login">
                <Box color="white" fontSize="17px">
                  Đăng nhập
                </Box>
              </Link>
            </Box>
          </Stack>
        </Stack>
      </FormProvider>

      <DevTool control={control} />
    </Box>
  );
};
