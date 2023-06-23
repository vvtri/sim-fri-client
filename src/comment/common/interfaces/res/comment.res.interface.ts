import { IBasePaginationRes } from '../../../../common/interfaces/base.res.interface';
import { ICommentReaction } from '../../models/comment-reaction.model';
import { IComment } from '../../models/comment.model';

export interface IGetListCommentRes extends IBasePaginationRes<IComment> {}

export interface IGetListReplyCommentRes extends IBasePaginationRes<IComment> {}

export interface IGetParentTreeCommentRes extends IComment {}

export interface IReactCommentRes extends ICommentReaction {}
export interface ICreateCommentRes extends IComment {}

export interface IUpdateCommentRes extends IComment {}
