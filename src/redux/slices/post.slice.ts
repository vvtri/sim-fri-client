import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudienceType } from 'shared';
import { ISavePostReq } from '../../post/common/interfaces/req/post.req.interface';
import { IPost } from '../../post/common/models/post.model';
import { RootState } from '../store';

export type SavePostState = Omit<ISavePostReq, 'fileIds'> & {
  images: { url: string; id?: number }[];
};

interface PostState {
  createPost: {
    isShow: boolean;
    data: SavePostState;
  };

  updatePost: {
    isShow: boolean;
    id?: number;
    data?: SavePostState;
  };

  viewPost: { isShow: boolean; post?: IPost };
}

export const initialCreatePostData = {
  audienceType: AudienceType.PUBLIC,
  content: '',
  images: [],
};

const initialState: PostState = {
  createPost: {
    isShow: false,
    data: initialCreatePostData,
  },
  updatePost: {
    isShow: false,
  },
  viewPost: { isShow: false },
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setCreatePost: (state, action: PayloadAction<PostState['createPost']>) => {
      state.createPost = action.payload;
    },
    addImageCreatePost: (state, action: PayloadAction<string>) => {
      state.createPost.data.images.push({ url: action.payload });
    },
    removeImageCreatePost: (state, action: PayloadAction<string>) => {
      state.createPost.data.images = state.createPost.data.images.filter(
        (item) => item.url !== action.payload,
      );
    },
    setUpdatePost: (state, action: PayloadAction<PostState['updatePost']>) => {
      state.updatePost = action.payload;
    },
    addImageUpdatePost: (state, action: PayloadAction<string>) => {
      if (!state.updatePost.data) return;
      state.updatePost.data.images.push({ url: action.payload });
    },
    removeImageUpdatePost: (state, action: PayloadAction<string>) => {
      if (!state.updatePost.data) return;
      state.updatePost.data.images = state.updatePost.data.images.filter(
        (item) => item.url !== action.payload,
      );
    },
    setViewPost: (state, action: PayloadAction<PostState['viewPost']>) => {
      state.viewPost = action.payload;
    },
    setViewPostIsShow: (
      state,
      action: PayloadAction<PostState['viewPost']['isShow']>,
    ) => {
      state.viewPost.isShow = action.payload;
    },
    setViewPostData: (
      state,
      action: PayloadAction<PostState['viewPost']['post']>,
    ) => {
      state.viewPost.post = action.payload;
    },
  },
});

export const {
  setCreatePost,
  setUpdatePost,
  setViewPost,
  setViewPostData,
  setViewPostIsShow,
  addImageCreatePost,
  removeImageCreatePost,
  removeImageUpdatePost,
  addImageUpdatePost,
} = postSlice.actions;
export const createPostSelector = (state: RootState) => state.post.createPost;
export const updatePostSelector = (state: RootState) => state.post.updatePost;
export const viewPostSelector = (state: RootState) => state.post.viewPost;

export default postSlice.reducer;
