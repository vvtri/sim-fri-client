import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../../common/hooks/use-debounce';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  addCreateConversation,
  conversationListPanelSelector,
  setConversationListPanel,
  setConversationListPanelIsShow,
} from '../../../redux/slices/message.slice';

export const ListConversationPanelHeader = () => {
  const dispatch = useAppDispatch();
  const listPanelData = useAppSelector(conversationListPanelSelector);
  const [searchTextState, setSearchText] = useState('');
  const debouncedSearchTerm = useDebounce(searchTextState, 300);

  const handleAddCreateConversation = () => {
    dispatch(addCreateConversation());
    dispatch(setConversationListPanelIsShow(false));
  };

  useEffect(() => {
    dispatch(
      setConversationListPanel({
        ...listPanelData,
        searchText: debouncedSearchTerm,
      }),
    );
  }, [debouncedSearchTerm]);

  return (
    <Stack spacing="10px" mb="10px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize="1.5rem" fontWeight="700">
          Chats
        </Typography>

        <Stack>
          <Tooltip title="New Message">
            <IconButton
              sx={{
                '&:hover': { backgroundColor: 'hoverColor.main' },
              }}
              onClick={handleAddCreateConversation}
            >
              <CreateIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <FormControl fullWidth sx={{ m: 1 }}>
        <OutlinedInput
          value={searchTextState}
          onChange={(e) => setSearchText(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          }
          placeholder="Search message"
          sx={{
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white !important',
            },
          }}
        />
      </FormControl>
    </Stack>
  );
};
