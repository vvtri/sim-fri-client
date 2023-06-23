import { PeopleAlt, PersonAdd } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { headerHeight } from '../../../common/constants/index.constant';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  friendActiveTabSelector,
  setActiveFriendTab,
} from '../../../redux/slices/friend.slice';
import { FriendTabs } from '../../common/enums/friend.enum';
import { FriendLeftPanelHeader } from './FriendLeftPanelHeader';
import { FriendLeftPanelItem } from './FriendLeftPanelItem';

export const FriendLeftPanel = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(friendActiveTabSelector);

  return (
    <Box position="relative" width="360px" flexShrink="0">
      <Box
        color="primaryText.main"
        width="360px"
        bgcolor="darkAccent.main"
        padding="10px"
        position="fixed"
        top={headerHeight}
        left="0"
        bottom="0"
      >
        <FriendLeftPanelHeader />

        <Stack>
          <FriendLeftPanelItem
            content="All friends"
            isActive={FriendTabs.ALL_FRIENDS === activeTab}
            icon={<PeopleAlt sx={{ width: '20px', height: '20px' }} />}
            onClick={() => dispatch(setActiveFriendTab(FriendTabs.ALL_FRIENDS))}
          />
          <FriendLeftPanelItem
            content="Friend requests"
            isActive={FriendTabs.FRIEND_REQUESTS === activeTab}
            icon={<PersonAdd sx={{ width: '20px', height: '20px' }} />}
            onClick={() =>
              dispatch(setActiveFriendTab(FriendTabs.FRIEND_REQUESTS))
            }
          />
          <FriendLeftPanelItem
            content="Suggestions"
            isActive={FriendTabs.FRIEND_SUGGESTIONS === activeTab}
            icon={<PersonAdd sx={{ width: '20px', height: '20px' }} />}
            onClick={() =>
              dispatch(setActiveFriendTab(FriendTabs.FRIEND_SUGGESTIONS))
            }
          />
        </Stack>
      </Box>
    </Box>
  );
};
