import { Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../../redux/hook';
import { searchTextSelector } from '../../../redux/slices/search.slice';
import { SearchPeopleItem } from '../../common/components/SearchPeopleItem';
import { useInfinitePeople } from '../../common/hooks/use-infinite-people.hook';

type SearchPeopleContainerProps = {};

export const SearchPeopleContainer = ({}: SearchPeopleContainerProps) => {
  const searchText = useAppSelector(searchTextSelector);
  const postContainerRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetching, isFetchingNextPage, fetchNextPage } =
    useInfinitePeople({
      searchText,
      limit: 20,
    });
  const isFetchingRef = useRef(isFetching || isFetchingNextPage);

  const people = data?.pages.flatMap((item) => item.items) || [];

  useEffect(() => {
    const handler = (e: any) => {
      const elem = postContainerRef.current;
      if (!elem || isFetchingRef.current) return;

      const shouldLoadMore =
        window.scrollY + window.innerHeight + 500 >=
        elem.offsetTop + elem.scrollHeight;

      if (shouldLoadMore) fetchNextPage();
    };

    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    isFetchingRef.current = isFetching || isFetchingNextPage;
  }, [isFetching, isFetchingNextPage]);

  return (
    <Stack width="100%" ref={postContainerRef} spacing="20px">
      {!people.length && !isFetching && (
        <Typography>No people match</Typography>
      )}
      {people.map((item) => (
        <SearchPeopleItem key={item.id} user={item} />
      ))}
    </Stack>
  );
};
