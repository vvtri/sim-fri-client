import { AudienceType } from 'shared';
import { InferType, mixed, object, string } from 'yup';

export const savePostSchema = object({
  content: string().required().trim(),
  audienceType: mixed<AudienceType>()
    .oneOf(Object.values(AudienceType))
    .required(),
});

export interface ISavePostForm extends InferType<typeof savePostSchema> {}
