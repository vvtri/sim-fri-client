import axiosClient from '../../../common/configs/axios.config';
import { getListNotiUrl, updateReadStatusNotiUrl } from '../apis/noti.api';
import {
  IGetListNotiReq,
  IUpdateReadStatusNotiReq,
} from '../interfaces/req/noti.req.interface';
import {
  IGetListNotiRes,
  IUpdateReadStatusNotiRes,
} from '../interfaces/res/noti.res.interface';

export const getListNoti = async (params: IGetListNotiReq) => {
  return axiosClient.get<any, IGetListNotiRes>(getListNotiUrl, {
    params,
  });
};

export const updateReadStatusNoti = async (data: IUpdateReadStatusNotiReq) => {
  return axiosClient.patch<any, IUpdateReadStatusNotiRes>(
    updateReadStatusNotiUrl,
    data,
  );
};
