import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth.slice';
import commonSlice from './slices/common.slice';
import friendSlice from './slices/friend.slice';
import messageSlice from './slices/message.slice';
import notiSlice from './slices/noti.slice';
import postSlice from './slices/post.slice';
import profileSlice from './slices/profile.slice';
import searchSlice from './slices/search.slice';
import verifyUserReducer from './slices/verify-user.slice';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['common'],
  version: 1,
};

const commonPersistConfig = {
  key: 'common',
  storage,
  blacklist: ['viewImageUrl'],
  version: 1,
};

const rootReducer = combineReducers({
  common: persistReducer(commonPersistConfig, commonSlice),
  auth: authReducer,
  verifyUser: verifyUserReducer,
  profile: profileSlice,
  post: postSlice,
  message: messageSlice,
  friend: friendSlice,
  search: searchSlice,
  noti: notiSlice,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export default persistedReducer;
