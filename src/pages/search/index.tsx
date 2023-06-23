import { Box, Stack } from '@mui/material';
import { NextPageContext } from 'next';
import { ReactNode, useEffect } from 'react';
import { headerHeight } from '../../common/constants/index.constant';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import {
  SearchActiveTab,
  searchActiveTabSelector,
  setSearchText,
} from '../../redux/slices/search.slice';
import { SearchAllContainer } from '../../search/all-panel/components/SearchAlllContainer';
import { SearchLeftPanel } from '../../search/left-panel/components/SearchLeftPanel';
import { SearchPeopleContainer } from '../../search/people-panel/components/SearchPeopleContainer';
import { SearchPostContainer } from '../../search/post-panel/components/SearchPostContainer';

type SearchProps = {
  q: string;
};

export default function Search({ q }: SearchProps) {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(searchActiveTabSelector);
  let comp: ReactNode;

  useEffect(() => {
    dispatch(setSearchText(q));
  }, [q]);

  switch (activeTab) {
    case SearchActiveTab.ALL:
      comp = <SearchAllContainer />;
      break;

    case SearchActiveTab.PEOPLE:
      comp = <SearchPeopleContainer />;
      break;

    case SearchActiveTab.POST:
      comp = <SearchPostContainer />;
      break;
  }

  return (
    <Stack direction="row" minHeight={`calc(100vh - ${headerHeight})`}>
      <SearchLeftPanel />

      <Box width="100%" display="flex" justifyContent="center">
        <Box width="680px" m="30px" borderRadius="10px" p="20px">
          {comp}
        </Box>
      </Box>
    </Stack>
  );
}

Search.getInitialProps = async (ctx: NextPageContext) => {
  const { q } = ctx.query;

  return { q };
};
