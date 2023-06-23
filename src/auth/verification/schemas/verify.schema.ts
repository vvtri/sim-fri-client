import * as yup from 'yup';

export const resendVerificationSchema = yup.object({
  email: yup
    .string()
    .required('Please enter your email')
    .email('Please enter an valid email'),
});

export interface IResendVerificationForm
  extends yup.InferType<typeof resendVerificationSchema> {}

export const verifyUserSchema = yup.object({
  code: yup.string().required('Please enter verification code'),
});

export interface IVerifyUserSchemaForm
  extends yup.InferType<typeof verifyUserSchema> {}
