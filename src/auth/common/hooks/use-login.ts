import { MutationOptions, useMutation } from '@tanstack/react-query';
import { ILoginPayload } from '../../login/interfaces/payload.interface';
import { login } from '../../login/services/index.services';
import { IAuthTokenRes } from '../interfaces/res/auth-token.res.interface';

export const useLogin = (
  opts: Pick<
    MutationOptions<IAuthTokenRes, any, ILoginPayload>,
    'onError' | 'onSuccess'
  >,
) => {
  return useMutation({
    mutationFn: (data: ILoginPayload) => login(data),
    ...opts,
  });
};
