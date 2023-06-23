import axiosClient from '../../../common/configs/axios.config';
import {
  getConversationByUserUrl,
  getDetailConversationUrl,
  getListConversationUrl,
} from '../apis/message.api';
import {
  IGetConversationByUserReq,
  IGetListConversationReq,
} from '../interfaces/req/conversation.req.interface';
import {
  IGetConversationByUserRes,
  IGetListConversationRes,
} from '../interfaces/res/conversation.res.interface';
import { IConversation } from '../models/conversation.model';

export const getListConversation = async (data: IGetListConversationReq) => {
  return await axiosClient.get<any, IGetListConversationRes>(
    getListConversationUrl,
    { params: data },
  );
};

export const getDetailConversation = async (id: number) => {
  return await axiosClient.get<any, IConversation>(
    getDetailConversationUrl(id),
  );
};

export const getConversationByUser = async (
  userId: number,
  data?: IGetConversationByUserReq,
) => {
  return await axiosClient.get<any, IGetConversationByUserRes>(
    getConversationByUserUrl(userId),
    { params: data },
  );
};
