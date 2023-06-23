import { MutationOptions, useMutation } from '@tanstack/react-query';
import {
  IResendVerificationPayload,
  IVerifyUserPayload,
} from '../../verification/interfaces/payload.interface';
import {
  resendVerification,
  verifyUser,
} from '../../verification/services/index.services';
import { IAuthTokenRes } from '../interfaces/res/auth-token.res.interface';

export const useResendVerification = (
  opts: Pick<
    MutationOptions<IAuthTokenRes, any, IResendVerificationPayload>,
    'onError' | 'onSuccess'
  >,
) => {
  return useMutation(
    (payload: IResendVerificationPayload) => resendVerification(payload),
    { ...opts },
  );
};

export const useVerifyUser = (
  opts: Pick<
    MutationOptions<IAuthTokenRes, any, IVerifyUserPayload>,
    'onError' | 'onSuccess'
  >,
) => {
  return useMutation((payload: IVerifyUserPayload) => verifyUser(payload), {
    ...opts,
  });
};
