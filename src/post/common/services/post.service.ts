import axiosClient from '../../../common/configs/axios.config';
import {
  createPostUrl,
  deletePostUrl,
  deleteReactPostUrl,
  getListPostUrl,
  getPostDetailUrl,
  reactPostUrl,
  updatePostUrl,
} from '../apis/post.api';
import {
  IDeleteReactPostReq,
  IGetListPostsReq,
  IGetPostDetailReq,
  IReactPostReq,
  ISavePostReq,
} from '../interfaces/req/post.req.interface';
import {
  ICreatePostRes,
  IGetListPostsRes,
  IGetPostDetailRes,
  IReactPostRes,
  IUpdatePostRes,
} from '../interfaces/res/post.res.interface';

export const getListPosts = async (data: IGetListPostsReq) => {
  return axiosClient.get<any, IGetListPostsRes>(getListPostUrl, {
    params: data,
  });
};

export const getPostDetail = async (id: number, params?: IGetPostDetailReq) => {
  return axiosClient.get<any, IGetPostDetailRes>(getPostDetailUrl(id), {
    params,
  });
};

export const createPost = async (data: ISavePostReq) => {
  return axiosClient.post<any, ICreatePostRes>(createPostUrl, data);
};

export const updatePost = async (id: number, data: ISavePostReq) => {
  return axiosClient.patch<any, IUpdatePostRes>(updatePostUrl(id), data);
};

export const deletePost = async (id: number) => {
  return axiosClient.delete<any, void>(deletePostUrl(id));
};

export const reactPost = async (data: IReactPostReq) => {
  return axiosClient.post<any, IReactPostRes>(reactPostUrl, data);
};

export const deleteReactPost = async (data: IDeleteReactPostReq) => {
  return axiosClient.delete<any, void>(deleteReactPostUrl, { data });
};
