import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IUpdateUserProfileReq } from '../interfaces/req/user-profile.req.interface';
import { IUpdateUserProfileRes } from '../interfaces/res/user-profile.res.interface';
import { updateProfile } from '../services/profile.service';

export function useUpdateProfile(
  opts: Pick<
    MutationOptions<IUpdateUserProfileRes, any, IUpdateUserProfileReq>,
    'onError' | 'onSuccess'
  >,
) {
  return useMutation({
    mutationFn: (data: IUpdateUserProfileReq) => updateProfile(data),
    ...opts,
  });
}
