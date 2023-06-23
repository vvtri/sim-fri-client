import { Feed, Newspaper, People } from '@mui/icons-material';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { headerHeight } from '../../../common/constants/index.constant';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  SearchActiveTab,
  searchActiveTabSelector,
  setSearchActiveTab,
} from '../../../redux/slices/search.slice';
import { SearchLeftPanelItem } from './SearchLeftPanelItem';

export const SearchLeftPanel = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(searchActiveTabSelector);

  return (
    <Box position="relative" width="360px" flexShrink="0">
      <Stack
        px="10px"
        bgcolor="darkAccent.main"
        position="fixed"
        top={headerHeight}
        left="0"
        bottom="0"
        color="primaryText.main"
        width="360px"
      >
        <Typography fontSize="1.5rem" fontWeight="700" py="10px" ml="10px">
          Search results
        </Typography>

        <Divider />

        <Typography
          fontSize="1.0625rem"
          mt="15px"
          mb="4px"
          ml="10px"
          fontWeight="600"
        >
          Filters
        </Typography>

        <SearchLeftPanelItem
          icon={<Newspaper />}
          text="All"
          isActive={activeTab === SearchActiveTab.ALL}
          onClick={() => dispatch(setSearchActiveTab(SearchActiveTab.ALL))}
        />
        <SearchLeftPanelItem
          text="Posts"
          icon={<Feed />}
          isActive={activeTab === SearchActiveTab.POST}
          onClick={() => dispatch(setSearchActiveTab(SearchActiveTab.POST))}
        />
        <SearchLeftPanelItem
          text="People"
          icon={<People />}
          isActive={activeTab === SearchActiveTab.PEOPLE}
          onClick={() => dispatch(setSearchActiveTab(SearchActiveTab.PEOPLE))}
        />
      </Stack>
    </Box>
  );
};
