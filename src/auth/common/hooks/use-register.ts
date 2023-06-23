import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IRegisterUserPayload } from '../../register/interfaces/payload.interface';
import { register } from '../../register/services/index.services';
import { IAuthTokenRes } from '../interfaces/res/auth-token.res.interface';

export const useRegister = (
  opts: Pick<
    MutationOptions<IAuthTokenRes, any, IRegisterUserPayload>,
    'onError' | 'onSuccess'
  >,
) => {
  return useMutation((payload: IRegisterUserPayload) => register(payload), {
    ...opts,
  });
};
