import { Button, Stack, Typography } from '@mui/material';
import { Center } from '../../../common/components/utils/Center';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  SearchActiveTab,
  searchTextSelector,
  setSearchActiveTab,
} from '../../../redux/slices/search.slice';
import { SearchPeopleItem } from '../../common/components/SearchPeopleItem';
import { useInfinitePeople } from '../../common/hooks/use-infinite-people.hook';

export const SearchAllPeoplePanel = () => {
  const dispatch = useAppDispatch();
  const searchText = useAppSelector(searchTextSelector);

  const { data, isFetching, isFetchingNextPage } = useInfinitePeople({
    searchText,
    limit: 6,
  });

  const people = data?.pages.flatMap((item) => item.items) || [];

  const handleSeeAllFriend = () => {
    dispatch(setSearchActiveTab(SearchActiveTab.PEOPLE));
  };

  return (
    <Stack width="100%" mb="20px" bgcolor="darkAccent.main" py="20px">
      <Typography fontSize="1.25renm" fontWeight="700" px="20px">
        More people
      </Typography>

      {!people.length && !isFetching && (
        <Center my="20px">
          <Typography>No people match</Typography>
        </Center>
      )}

      {people.map((item) => (
        <SearchPeopleItem key={item.id} user={item} />
      ))}

      <Button
        variant="contained"
        color="secondaryButton"
        sx={{ mx: '20px' }}
        onClick={handleSeeAllFriend}
      >
        See all
      </Button>
    </Stack>
  );
};
