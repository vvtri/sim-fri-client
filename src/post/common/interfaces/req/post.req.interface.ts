import { AudienceType, PostReactionType } from 'shared';
import { IBasePaginationReq } from '../../../../common/interfaces/base.req.interface';

export interface IGetListPostsReq extends IBasePaginationReq {
  userId?: number;

  excludeMe?: boolean;

  searchText?: string;
}

export interface IGetPostDetailReq {
  commentId?: number;
}

export interface ISavePostReq {
  content: string;
  audienceType: AudienceType;
  fileIds?: number[];
}

export interface IReactPostReq {
  type: PostReactionType;
  postId: number;
}

export interface IDeleteReactPostReq {
  postId: number;
}
