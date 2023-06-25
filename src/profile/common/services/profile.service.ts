import axiosClient from '../../../common/configs/axios.config';
import { getUserProfileUrl, updateProfileUrl } from '../apis/index.api';
import { IUpdateUserProfileReq } from '../interfaces/req/user-profile.req.interface';
import {
  IGetUserProfileRes,
  IUpdateUserProfileRes,
} from '../interfaces/res/user-profile.res.interface';

export const getMyProfile = async () => {
  return axiosClient.get<any, IGetUserProfileRes>(getUserProfileUrl);
};

export const getUserProfile = async (id: number) => {
  return axiosClient.get<any, IGetUserProfileRes>(`${getUserProfileUrl}/${id}`);
};

export const updateProfile = async (data: IUpdateUserProfileReq) => {
  return axiosClient.patch<any, IUpdateUserProfileRes>(updateProfileUrl, data);
};
