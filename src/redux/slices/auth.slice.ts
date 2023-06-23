import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserProfile } from '../../profile/common/models/user-profile.model';
import { getMyProfile } from '../../profile/common/services/profile.service';
import { RootState } from '../store';

interface AuthState {
  userProfile: IUserProfile | null;
  isLoading: boolean;
  accountControlPanel: {
    isShow: boolean;
  };
}

const initialState: AuthState = {
  userProfile: null,
  isLoading: true,
  accountControlPanel: { isShow: false },
};

const fetchUserThunk = createAsyncThunk('auth/fetchUser', async () => {
  try {
    const user = await getMyProfile();
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      { payload }: PayloadAction<Pick<AuthState, 'userProfile' | 'isLoading'>>,
    ) => {
      state.userProfile = payload.userProfile;
      state.isLoading = payload.isLoading;
    },
    setAuthProfile: (
      state,
      { payload }: PayloadAction<AuthState['userProfile']>,
    ) => {
      state.userProfile = payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAccountControlPanelIsShow: (
      state,
      action: PayloadAction<AuthState['accountControlPanel']['isShow']>,
    ) => {
      state.accountControlPanel.isShow = action.payload;
    },
    toggleAccountControlPanelIsShow: (state) => {
      state.accountControlPanel.isShow = !state.accountControlPanel.isShow;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserThunk.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchUserThunk.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export { fetchUserThunk };
export const {
  setAuth,
  setAuthProfile,
  setLoading,
  setAccountControlPanelIsShow,
  toggleAccountControlPanelIsShow,
} = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export const authUserSelector = (state: RootState) => state.auth.userProfile;
export const authAccountControlPanelSelector = (state: RootState) =>
  state.auth.accountControlPanel;

export default authSlice.reducer;
