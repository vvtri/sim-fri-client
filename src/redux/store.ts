import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import friendSlice from './slices/friend.slice';
import messageSlice from './slices/message.slice';
import notiSlice from './slices/noti.slice';
import postSlice from './slices/post.slice';
import profileSlice from './slices/profile.slice';
import searchSlice from './slices/search.slice';
import verifyUserReducer from './slices/verify-user.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    verifyUser: verifyUserReducer,
    profile: profileSlice,
    post: postSlice,
    message: messageSlice,
    friend: friendSlice,
    search: searchSlice,
    noti: notiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
