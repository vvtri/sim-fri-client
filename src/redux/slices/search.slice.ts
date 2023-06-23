import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export enum SearchActiveTab {
  ALL = 'ALL',
  POST = 'POST',
  PEOPLE = 'PEOPLE',
}

interface SearchState {
  activeTab: SearchActiveTab;
  searchText: string;
}

const initialState: SearchState = {
  activeTab: SearchActiveTab.ALL,
  searchText: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchActiveTab: (
      state,
      { payload }: PayloadAction<SearchState['activeTab']>,
    ) => {
      state.activeTab = payload;
    },
    setSearchText: (
      state,
      { payload }: PayloadAction<SearchState['searchText']>,
    ) => {
      state.searchText = payload;
    },
  },
});

export const { setSearchActiveTab, setSearchText } = searchSlice.actions;

export const searchActiveTabSelector = (state: RootState) =>
  state.search.activeTab;
export const searchTextSelector = (state: RootState) => state.search.searchText;

export default searchSlice.reducer;
