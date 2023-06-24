import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommonState {
  viewImageUrl?: string;
}

const initialState: CommonState = {};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setViewImageUrl: (
      state,
      action: PayloadAction<CommonState['viewImageUrl']>,
    ) => {
      state.viewImageUrl = action.payload;
    },
  },
});

export const { setViewImageUrl } = commonSlice.actions;
// export const friendActiveTabSelector = (state: RootState) =>
//   state.friend.activeFriendTab;

export default commonSlice.reducer;
