import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation } from '../../message/common/models/conversation.model';
import {
  getConversationByUser,
  getDetailConversation,
} from '../../message/common/services/conversation.service';
import { IUserProfile } from '../../profile/common/models/user-profile.model';
import { RootState } from '../store';

type OpenConversation = {
  conversation?: IConversation;
  userProfile?: IUserProfile;
  isNewConversation: boolean;
  isCreateConversation?: boolean;
};

interface MessageState {
  listPanel: {
    isShow: boolean;
    searchText: string;
  };
  messageBox: {
    openConversations: OpenConversation[];
  };
}

const initialState: MessageState = {
  listPanel: { isShow: false, searchText: '' },
  messageBox: { openConversations: [] },
};

const addConversationThunk = createAsyncThunk(
  'message/addConversationThunk',
  async ({
    conversationId,
    userId,
    shouldCloseCreate,
    shouldCloseNew,
  }: {
    conversationId: number;
    userId?: number;
    shouldCloseCreate?: boolean;
    shouldCloseNew?: boolean;
  }) => {
    try {
      const conversation = await getDetailConversation(conversationId);
      return { conversation, userId, shouldCloseCreate, shouldCloseNew };
    } catch (error) {
      console.log(error);
      return null;
    }
  },
);

const findConversationThunk = createAsyncThunk(
  'message/findConversationThunk',
  async (userId: number) => {
    try {
      const conversation = await getConversationByUser(userId);
      return { userId, conversation };
    } catch (error) {
      console.log(error);
      return null;
    }
  },
);

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setConversationListPanel: (
      state,
      action: PayloadAction<MessageState['listPanel']>,
    ) => {
      state.listPanel = action.payload;
    },
    setConversationListPanelIsShow: (
      state,
      action: PayloadAction<MessageState['listPanel']['isShow']>,
    ) => {
      state.listPanel.isShow = action.payload;
    },
    toggleConversationListPanelIsShow: (state) => {
      state.listPanel.isShow = !state.listPanel.isShow;
    },
    setConversationMessageBox: (
      state,
      action: PayloadAction<MessageState['messageBox']>,
    ) => {
      state.messageBox = action.payload;
    },
    addConversationMessageBox: (
      state,
      {
        payload,
      }: PayloadAction<MessageState['messageBox']['openConversations'][0]>,
    ) => {
      const openConversations = state.messageBox.openConversations.filter(
        (item) => {
          if (item.isCreateConversation) return true;
          if (item.isNewConversation !== payload.isNewConversation) return true;

          if (payload.isNewConversation) {
            if (item.userProfile?.id === payload.userProfile?.id) return false;
            else return true;
          } else {
            if (item.conversation?.id === payload.conversation?.id)
              return false;
            else return true;
          }
        },
      );

      openConversations.unshift(payload);
      state.messageBox.openConversations = openConversations;
    },
    removeConversationMessageBox: (
      state,
      {
        payload,
      }: PayloadAction<{
        isNewConversation: boolean;
        userProfileId?: number;
        conversationId?: number;
      }>,
    ) => {
      state.messageBox.openConversations =
        state.messageBox.openConversations.filter((item) => {
          if (item.isCreateConversation) return true;
          if (item.isNewConversation !== payload.isNewConversation) return true;

          if (payload.isNewConversation) {
            if (item.userProfile?.id === payload.userProfileId) return false;
            else return true;
          } else {
            if (item.conversation?.id === payload.conversationId) return false;
            else return true;
          }
        });
    },
    addCreateConversation: (state) => {
      state.messageBox.openConversations =
        state.messageBox.openConversations.filter(
          (item) => !item.isCreateConversation,
        );

      state.messageBox.openConversations.unshift({
        isCreateConversation: true,
        isNewConversation: false,
      });
    },
    removeCreateConversation: (state) => {
      state.messageBox.openConversations =
        state.messageBox.openConversations.filter(
          (item) => !item.isCreateConversation,
        );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addConversationThunk.fulfilled, (state, action) => {
      if (!action.payload) return;

      const { conversation, userId, shouldCloseCreate, shouldCloseNew } =
        action.payload;

      let openConversations: OpenConversation[] = [];
      if (conversation.isGroup) {
        openConversations = state.messageBox.openConversations.filter(
          (item) => {
            if (item.isCreateConversation) return !shouldCloseCreate;

            if (item.conversation?.id === conversation.id) return false;
            return true;
          },
        );
      } else {
        openConversations = state.messageBox.openConversations.filter(
          (item) => {
            if (item.isCreateConversation) return !shouldCloseCreate;
            if (item.isNewConversation) return !shouldCloseNew;

            if (item.userProfile?.user.id === userId) return false;
            else return true;
          },
        );
      }

      openConversations.unshift({ isNewConversation: false, conversation });
      state.messageBox.openConversations = openConversations;
    });
    builder.addCase(findConversationThunk.fulfilled, (state, action) => {
      if (!action.payload) return;

      const { conversation, userId } = action.payload;

      if (!conversation) return;

      state.messageBox.openConversations =
        state.messageBox.openConversations.filter((item) => {
          if (item.isCreateConversation) return true;

          if (item.isNewConversation && item.userProfile?.user.id === userId)
            return false;

          return item.conversation?.id !== conversation.id;
        });

      state.messageBox.openConversations.unshift({
        conversation,
        isNewConversation: false,
      });
    });
  },
});

export { addConversationThunk, findConversationThunk };

export const {
  setConversationListPanel,
  setConversationListPanelIsShow,
  toggleConversationListPanelIsShow,
  setConversationMessageBox,
  addConversationMessageBox,
  removeConversationMessageBox,
  addCreateConversation,
  removeCreateConversation,
} = messageSlice.actions;
export const conversationListPanelSelector = (state: RootState) =>
  state.message.listPanel;
export const conversationMessageBoxSelector = (state: RootState) =>
  state.message.messageBox;

export default messageSlice.reducer;
