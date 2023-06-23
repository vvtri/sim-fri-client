import { Avatar, Stack, Typography } from '@mui/material';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { emptyAvatarUrl } from '../../../common/constants/index.constant';

type CreateConversationBoxPeopleItemProps = {
  people: IUser;
  handleAddMember: (people: IUser) => any;
};

export const CreateConversationBoPeopleItem = ({
  handleAddMember,
  people,
}: CreateConversationBoxPeopleItemProps) => {
  const avtUrl = people.profile.avatar?.url || emptyAvatarUrl;

  return (
    <Stack
      direction="row"
      width="100%"
      px="10px"
      py="6px"
      spacing="16px"
      sx={{ ':hover': { bgcolor: 'hoverColor.main' }, cursor: 'pointer' }}
      borderRadius="10px"
      onClick={() => handleAddMember(people)}
    >
      <Avatar
        src={avtUrl}
        sx={{ flexShrink: 0, width: '36px', height: '36px' }}
      />

      <Stack flexGrow="1" minWidth="0">
        <Typography color="primaryText.main" fontSize="0.9375rem">
          {people.profile.name}
        </Typography>
        <Typography color="secondaryText.main" fontSize="0.75rem"></Typography>
      </Stack>
    </Stack>
  );
};
