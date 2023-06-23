import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FriendTabs } from '../../friend/common/enums/friend.enum';
import { RootState } from '../store';

interface FriendState {
  activeFriendTab: FriendTabs;
}

const initialState: FriendState = {
  activeFriendTab: FriendTabs.ALL_FRIENDS,
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setActiveFriendTab: (
      state,
      action: PayloadAction<FriendState['activeFriendTab']>,
    ) => {
      state.activeFriendTab = action.payload;
    },
  },
});

export const { setActiveFriendTab } = friendSlice.actions;
export const friendActiveTabSelector = (state: RootState) =>
  state.friend.activeFriendTab;

export default friendSlice.reducer;
