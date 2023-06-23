import { Stack } from '@mui/system';
import { ReactElement } from 'react';
import { headerHeight } from '../../common/constants/index.constant';
import FriendLayout from '../../common/layouts/FriendLayout';
import { AllFriendPanel } from '../../friend/all-panel/components/AllFriendPanel';
import { FriendTabs } from '../../friend/common/enums/friend.enum';
import { FriendLeftPanel } from '../../friend/left-panel/components/FriendLeftPanel';
import { FriendRequestPanel } from '../../friend/request-panel/components/FriendRequestPanel';
import { FriendSuggestionPanel } from '../../friend/suggestion-panel/components/FriendSuggestionPanel';
import { useAppSelector } from '../../redux/hook';
import { friendActiveTabSelector } from '../../redux/slices/friend.slice';

export default function Friend() {
  const activeTab = useAppSelector(friendActiveTabSelector);

  let comp: JSX.Element;

  switch (activeTab) {
    case FriendTabs.ALL_FRIENDS:
      comp = <AllFriendPanel />;
      break;
    case FriendTabs.FRIEND_REQUESTS:
      comp = <FriendRequestPanel />;
      break;
    case FriendTabs.FRIEND_SUGGESTIONS:
      comp = <FriendSuggestionPanel />;
      break;
  }

  return (
    <Stack direction="row" minHeight={`calc(100vh - ${headerHeight})`}>
      <FriendLeftPanel />
      {comp}
    </Stack>
  );
}

Friend.getLayout = (page: ReactElement) => {
  return <FriendLayout>{page}</FriendLayout>;
};
