import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { IPost } from '../../../post/common/models/post.model';
import { ICommentFile } from './comment-file.model';
import { ICommentReaction } from './comment-reaction.model';

export interface IComment {
  id: number;
  content: string;
  postId: number;
  post: IPost;
  children: IComment[];
  parent: IComment;
  userId: number;
  user: IUser;
  commentFiles: ICommentFile[];
  commentReactions: number;
  childCount: number;
  totalCount: number;
  likeCount: number;
  loveCount: number;
  angryCount: number;
  createdAt: Date;
  parentId: number;
  myReaction: ICommentReaction;
  mpath: string;
}
