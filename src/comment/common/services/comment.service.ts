import axiosClient from '../../../common/configs/axios.config';
import {
  createCommentUrl,
  deleteCommentUrl,
  deleteReactCommentUrl,
  getListCommentUrl,
  getListReplyCommentUrl,
  getParentTreeCommentUrl,
  reactCommentUrl,
  updateCommentUrl,
} from '../apis/comment.api';
import {
  ICreateCommentReq,
  IDeleteReactCommentReq,
  IGetListCommentReq,
  IGetListReplyCommentReq,
  IReactCommentReq,
  IUpdateCommentReq,
} from '../interfaces/req/comment.req.interface';
import {
  ICreateCommentRes,
  IGetListCommentRes,
  IGetListReplyCommentRes,
  IGetParentTreeCommentRes,
  IReactCommentRes,
  IUpdateCommentRes,
} from '../interfaces/res/comment.res.interface';

export const getListComment = (params: IGetListCommentReq) => {
  return axiosClient.get<any, IGetListCommentRes>(getListCommentUrl, {
    params,
  });
};

export const getListReplyComment = (params: IGetListReplyCommentReq) => {
  return axiosClient.get<any, IGetListReplyCommentRes>(getListReplyCommentUrl, {
    params,
  });
};

export const getParentTreeComment = (commentId: number) => {
  return axiosClient.get<any, IGetParentTreeCommentRes>(
    getParentTreeCommentUrl(commentId),
  );
};

export const createComment = (data: ICreateCommentReq) => {
  return axiosClient.post<any, ICreateCommentRes>(createCommentUrl, data);
};

export const reactComment = (data: IReactCommentReq) => {
  return axiosClient.post<any, IReactCommentRes>(reactCommentUrl, data);
};

export const updateComment = (data: IUpdateCommentReq) => {
  return axiosClient.patch<any, IUpdateCommentRes>(updateCommentUrl, data);
};

export const deleteComment = (commentId: number) => {
  return axiosClient.delete<any, void>(deleteCommentUrl(commentId));
};

export const deleteReactComment = (data: IDeleteReactCommentReq) => {
  return axiosClient.delete<any, void>(deleteReactCommentUrl, { data });
};
