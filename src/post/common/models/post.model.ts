import { AudienceType } from 'shared';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { IComment } from '../../../comment/common/models/comment.model';
import { IFile } from '../../../file/common/models/file.model';
import { IPostReaction } from './post-reaction.model';

export interface IPost {
  id: number;
  content: string;
  audienceType: AudienceType;
  user: IUser;
  files: IFile[];
  createdAt: Date;
  updatedAt: Date;
  firstComment: IComment;
  comments: IComment[];
  totalCount: number;
  likeCount: number;
  loveCount: number;
  angryCount: number;
  totalCommentCount: number;
  myReaction: IPostReaction;
  totalDirectCommentCount: number;
}
