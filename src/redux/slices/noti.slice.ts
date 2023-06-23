import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface MessageState {
  listPanel: { isShow: boolean };
}

const initialState: MessageState = {
  listPanel: { isShow: false },
};

const notiSlice = createSlice({
  name: 'noti',
  initialState,
  reducers: {
    setNotiListPanelIsShow: (
      state,
      action: PayloadAction<MessageState['listPanel']['isShow']>,
    ) => {
      state.listPanel.isShow = action.payload;
    },
    toggleNotiListPanelIsShow: (state) => {
      state.listPanel.isShow = !state.listPanel.isShow;
    },
  },
});

export const { setNotiListPanelIsShow, toggleNotiListPanelIsShow } =
  notiSlice.actions;
export const notiListPanelSelector = (state: RootState) => state.noti.listPanel;

export default notiSlice.reducer;
