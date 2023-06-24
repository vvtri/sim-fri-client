import { UserProfileRelationshipStatus } from 'shared';
import { InferType, date, mixed, number, object, string } from 'yup';

export const editProfileSchema = object({
  name: string().required(),
  avatarId: number().nullable().optional(),
  address: string().nullable().optional(),
  birthDate: date().nullable().optional(),
  workplace: string().nullable().optional(),
  school: string().nullable().optional(),
  hometown: string().nullable().optional(),
  relationshipStatus: mixed<UserProfileRelationshipStatus>()
    .oneOf(
      Object.values(
        UserProfileRelationshipStatus,
      ) as UserProfileRelationshipStatus[],
    )
    .nullable()
    .optional(),
});

export interface IEditProfileForm extends InferType<typeof editProfileSchema> {}
