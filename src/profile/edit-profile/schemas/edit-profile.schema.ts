import { InferType, date, object, string } from 'yup';

export const editProfileSchema = object({
  name: string().required(),
  address: string().required(),
  birthDate: date().required(),
});

export interface IEditProfileForm extends InferType<typeof editProfileSchema> {}
