import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileTabs } from '../../profile/common/enums/profile.enum';
import { RootState } from '../store';

interface ProfileState {
  tabValue: ProfileTabs;
  editProfile: {
    isShowModal: boolean;
    avatarUrl: string;
  };
  viewingUserId?: number;
  viewProfile: {
    friend: {
      searchText: string;
    };
  };
}

const initialState: ProfileState = {
  tabValue: ProfileTabs.POST,
  editProfile: { isShowModal: false, avatarUrl: '' },
  viewProfile: { friend: { searchText: '' } },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileTabValue: (
      state,
      action: PayloadAction<ProfileState['tabValue']>,
    ) => {
      state.tabValue = action.payload;
    },
    setEditProfile: (
      state,
      action: PayloadAction<Partial<ProfileState['editProfile']>>,
    ) => {
      state.editProfile = { ...state.editProfile, ...action.payload };
    },
    setEditProfileModal: (
      state,
      action: PayloadAction<ProfileState['editProfile']['isShowModal']>,
    ) => {
      state.editProfile.isShowModal = action.payload;
    },
    setEditProfileAvatarUrl: (
      state,
      action: PayloadAction<ProfileState['editProfile']['avatarUrl']>,
    ) => {
      state.editProfile.avatarUrl = action.payload;
    },
    setViewingProfileUserId: (
      state,
      action: PayloadAction<ProfileState['viewingUserId']>,
    ) => {
      state.viewingUserId = action.payload;
    },
    setViewProfileFriendSearchText: (
      state,
      action: PayloadAction<
        ProfileState['viewProfile']['friend']['searchText']
      >,
    ) => {
      state.viewProfile.friend.searchText = action.payload;
    },
  },
});

export const {
  setProfileTabValue,
  setEditProfileModal,
  setEditProfileAvatarUrl,
  setEditProfile,
  setViewingProfileUserId,
  setViewProfileFriendSearchText,
} = profileSlice.actions;
export const profileTabValueSelector = (state: RootState) =>
  state.profile.tabValue;
export const editProfileSelector = (state: RootState) =>
  state.profile.editProfile;
export const viewingProfileUserIdSelector = (state: RootState) =>
  state.profile.viewingUserId;
export const viewProfileSearchTextSelector = (state: RootState) =>
  state.profile.viewProfile.friend.searchText;

export default profileSlice.reducer;
