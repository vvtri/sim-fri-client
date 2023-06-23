import { Close } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { IUser } from '../../../auth/common/interfaces/res/user.res.interface';
import { Center } from '../../../common/components/utils/Center';

type CreateConversationBoxMemberItemProps = {
  member: IUser;
  handleRemove: (member: IUser) => any;
};

export const CreateConversationBoxMemberItem = ({
  member,
  handleRemove,
}: CreateConversationBoxMemberItemProps) => {
  return (
    <Center
      bgcolor="secondaryBlue.main"
      color="primary.main"
      p="6px 2px 6px 6px"
      borderRadius="8px"
      height="fit-content"
    >
      <Typography fontSize="0.8125rem" mr="4px">
        {member.profile.name}
      </Typography>
      <Center
        height="28px"
        width="28px"
        borderRadius="50%"
        sx={{
          ':hover': { bgcolor: '#3c4d63' },
          cursor: 'pointer',
        }}
        onClick={() => handleRemove(member)}
      >
        <Close sx={{ width: '15px', height: '15px' }} />
      </Center>
    </Center>
  );
};
