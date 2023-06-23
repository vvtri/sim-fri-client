import axiosClient from '../../../common/configs/axios.config';
import {
  addFriendUrl,
  countFriendUrl,
  deleteFriendRequestUrl,
  getFriendUrl,
  getListFriendSuggestionUrl,
  getListFriendUrl,
  isFriendUrl,
  replyFriendRequestUrl,
} from '../apis/friend.api';
import {
  IGetListFriendRequestReq,
  IGetListFriendSuggestionReq,
  IReplyFriendRequestReq,
} from '../interfaces/req/friend-request.req.dto';
import {
  IAddFriendRes,
  ICountFriendRequestRes,
  IDeleteFriendRes,
  IGetFriendRequestResDto,
  IGetListFriendRequestRes,
  IGetListFriendSuggestionRes,
  IIsFriendRequestRes,
  IReplyFriendRequestRes,
} from '../interfaces/res/friend-request.res.dto';

export const getListFriend = async (payload: IGetListFriendRequestReq) => {
  return axiosClient.get<any, IGetListFriendRequestRes>(getListFriendUrl, {
    params: payload,
  });
};

export const getListFriendSuggestion = async (
  payload: IGetListFriendSuggestionReq,
) => {
  return axiosClient.get<any, IGetListFriendSuggestionRes>(
    getListFriendSuggestionUrl,
    { params: payload },
  );
};

export const isFriend = async (userId: number) => {
  return axiosClient.get<any, IIsFriendRequestRes>(isFriendUrl(userId));
};

export const getFriend = async (userId: number) => {
  return axiosClient.get<any, IGetFriendRequestResDto>(getFriendUrl(userId));
};

export const countFriend = async (userId: number) => {
  return axiosClient.get<any, ICountFriendRequestRes>(countFriendUrl(userId));
};

export const addFriend = async (userId: number) => {
  return axiosClient.post<any, IAddFriendRes>(addFriendUrl(userId));
};

export const replyFriendRequest = async (payload: IReplyFriendRequestReq) => {
  return axiosClient.post<any, IReplyFriendRequestRes>(
    replyFriendRequestUrl,
    payload,
  );
};

export const deleteFriendRequest = async (userId: number) => {
  return axiosClient.delete<any, IDeleteFriendRes>(
    deleteFriendRequestUrl(userId),
  );
};
