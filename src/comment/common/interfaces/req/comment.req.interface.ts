import { CommentReactionType } from 'shared';
import { IBasePaginationReq } from '../../../../common/interfaces/base.req.interface';

export interface IGetListCommentReq extends IBasePaginationReq {
  postId: number;
}

export interface IGetListReplyCommentReq extends IBasePaginationReq {
  parentId: number;
}

export interface ICreateCommentReq {
  content: string;
  fileIds: number[];
  parentId?: number;
  postId?: number;
}

export interface IUpdateCommentReq {
  id: number;
  content: string;
  fileIds: number[];
}

export interface IReactCommentReq {
  commentId: number;
  type: CommentReactionType;
}

export interface IDeleteReactCommentReq {
  commentId: number;
}
