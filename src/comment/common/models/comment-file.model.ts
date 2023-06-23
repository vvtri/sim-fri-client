import { IFile } from '../../../file/common/models/file.model';
import { IComment } from './comment.model';

export interface ICommentFile {
  id: number;
  fileId: number;
  file: IFile;
  commentId: number;
  comment: IComment;
}
