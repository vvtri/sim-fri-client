import { array, InferType, object, string } from 'yup';

export const createCommentSchema = object({
  content: string().required().trim(),
  images: array().of(string().trim().required()).optional(),
});

export interface ICreateCommentForm
  extends InferType<typeof createCommentSchema> {}
