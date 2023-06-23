import { PostReactionType } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { IPost } from './post.model';

export interface IPostReaction {
  id: number;
  type: PostReactionType;
  userId: number;
  user: IUser;
  postId: number;
  post: IPost;
}
