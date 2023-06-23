import { CommentReactionType } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { IComment } from './comment.model';

export interface ICommentReaction {
  id: number;
  type: CommentReactionType;
  commentId: number;
  comment: IComment;
  userId: number;
  user: IUser;
}
