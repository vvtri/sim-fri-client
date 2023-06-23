import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('Please enter your email')
    .email('Please enter an valid email'),
  password: yup.string().required('Please enter your password'),
  rePassword: yup
    .string()
    .required('Please retype your password')
    .oneOf([yup.ref('password'), ''], 'Password not match'),
});

export interface IRegisterForm extends yup.InferType<typeof registerSchema> {}
