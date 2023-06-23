import axiosClient from '../../../common/configs/axios.config';
import {
  getListMessageUrl,
  readMessageUrl,
  sendMessageUrl,
} from '../apis/message.api';
import {
  IGetListMessageReq,
  IReactToMessageReq,
  ISendMessageReq,
} from '../interfaces/req/message.req.interface';
import {
  IGetListMessageRes,
  IReactToMessageRes,
  IReadMessageRes,
  ISendMessageRes,
} from '../interfaces/res/message.res.interface';

export const getListMessage = async (data: IGetListMessageReq) => {
  return axiosClient.get<any, IGetListMessageRes>(getListMessageUrl, {
    params: data,
  });
};

export const sendMessage = async (data: ISendMessageReq) => {
  return axiosClient.post<any, ISendMessageRes>(sendMessageUrl, data);
};

export const readMessage = async (messageId: number) => {
  return axiosClient.patch<any, IReadMessageRes>(readMessageUrl(messageId));
};

export const reactToMessage = async (data: IReactToMessageReq) => {
  return axiosClient.post<any, IReactToMessageRes>(sendMessageUrl, data);
};
