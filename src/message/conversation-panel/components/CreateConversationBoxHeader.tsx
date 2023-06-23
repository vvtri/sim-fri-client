import { Close } from '@mui/icons-material';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { MouseEventHandler } from 'react';
import { Center } from '../../../common/components/utils/Center';
import { useAppDispatch } from '../../../redux/hook';
import { removeCreateConversation } from '../../../redux/slices/message.slice';

type CreateConversationBoxHeaderProps = {};

export const CreateConversationBoxHeader =
  ({}: CreateConversationBoxHeaderProps) => {
    const dispatch = useAppDispatch();

    const handleClose: MouseEventHandler<HTMLDivElement> = (e) => {
      dispatch(removeCreateConversation());
    };

    return (
      <Box padding="8px">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontSize="0.9375rem" fontWeight="600">
            New message
          </Typography>

          <Center
            color="secondaryText"
            onClick={handleClose}
            sx={{
              width: '34px',
              height: '34px',
              cursor: 'pointer',
              ':hover': { bgcolor: 'hoverColor.main' },
              borderRadius: '50%',
            }}
          >
            <Close sx={{ width: '26px', height: '26px' }} />
          </Center>
        </Stack>

        <Divider />
      </Box>
    );
  };
