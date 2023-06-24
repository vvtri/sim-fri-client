import { Tooltip, TooltipProps } from '@mui/material';
import dayjs from 'dayjs';
import { properOverflowClass } from '../../../common/constants/index.constant';

type MessageBoxMessageLineTimeTooltipProps = {
  date: Date;
  children: TooltipProps['children'];
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>;
};

export const MessageBoxMessageLineTimeTooltip = ({
  date,
  tooltipProps,
  children,
}: MessageBoxMessageLineTimeTooltipProps) => {
  return (
    <Tooltip
      title={`${dayjs(date).format('DD/MM/YYYY HH:mm')}`}
      PopperProps={{
        popperOptions: {
          modifiers: [{ name: 'preventOverflow', enabled: true }],
        },
        className: properOverflowClass,
      }}
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
};
