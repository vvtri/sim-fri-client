import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Please enter your email')
    .email('Please enter an valid email'),
  password: yup.string().required('Please enter your password'),
});

export interface ILoginForm extends yup.InferType<typeof loginSchema> {}
