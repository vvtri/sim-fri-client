import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

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
export const viewImageUrlSelector = (state: RootState) =>
  state.common.viewImageUrl;

export default commonSlice.reducer;
