import { IBasePaginationRes } from '../../../../common/interfaces/base.res.interface';
import { IPostReaction } from '../../models/post-reaction.model';
import { IPost } from '../../models/post.model';

export interface IGetListPostsRes extends IBasePaginationRes<IPost> {}
export interface IGetPostDetailRes extends IPost {}
export interface ICreatePostRes extends IPost {}
export interface IUpdatePostRes extends IPost {}
export interface IReactPostRes extends IPostReaction {}
