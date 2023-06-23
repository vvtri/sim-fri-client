import { Box, Typography } from '@mui/material';
import { MutableRefObject, UIEventHandler, useEffect, useRef } from 'react';
import { Center } from '../../../common/components/utils/Center';
import {
  CARD_BOX_SHADOW,
  headerHeight,
} from '../../../common/constants/index.constant';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  notiListPanelSelector,
  setNotiListPanelIsShow,
  toggleNotiListPanelIsShow,
} from '../../../redux/slices/noti.slice';
import { INoti } from '../../common/models/noti.model';
import { ListNotiPanelHeader } from './ListNotiPanelHeader';
import { ListNotiPanelItem } from './ListNotiPanelItem';

type ListNotiPanelProps = {
  notiIconRef: MutableRefObject<HTMLDivElement | null>;
  noties: INoti[];
  fetchMoreConversation: () => any;
  afterMutateReadNoti: (res: INoti) => any;
};

export const ListNotiPanel = ({
  notiIconRef,
  fetchMoreConversation,
  afterMutateReadNoti,
  noties,
}: ListNotiPanelProps) => {
  const dispatch = useAppDispatch();
  const { isShow } = useAppSelector(notiListPanelSelector);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handlerFetchNoties: UIEventHandler<HTMLDivElement> = (e) => {
    const elem = e.target as HTMLDivElement;

    const diff = elem.scrollTop + elem.offsetHeight + 300 - elem.scrollHeight;

    if (diff > 0) fetchMoreConversation();
  };

  useEffect(() => {
    const handlerTogglePanel = (e: MouseEvent) => {
      const target = e.target as any;

      if (notiIconRef.current?.contains(target)) {
        return dispatch(toggleNotiListPanelIsShow());
      }

      if (!panelRef.current?.contains(target)) {
        return dispatch(setNotiListPanelIsShow(false));
      }
    };

    document.addEventListener('click', handlerTogglePanel);

    return () => {
      document.removeEventListener('click', handlerTogglePanel);
    };
  }, []);

  return (
    <Box
      position="fixed"
      zIndex="100"
      sx={{
        top: headerHeight,
        right: '20px',
        backgroundColor: 'darkAccent.main',
        boxShadow: CARD_BOX_SHADOW,
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        overflowY: 'auto',
      }}
      maxWidth="360px"
      width="100%"
      maxHeight={`calc(100% - ${headerHeight} - 10px)`}
      px="10px"
      pb="10px"
      color="primaryText.main"
      ref={panelRef}
      display={isShow ? 'block' : 'none'}
      onScroll={handlerFetchNoties}
    >
      <ListNotiPanelHeader />

      {!noties.length && (
        <Center py="15px">
          <Typography>You don't have any notification</Typography>
        </Center>
      )}

      {noties.map((item) => (
        <ListNotiPanelItem
          key={item.id}
          noti={item}
          afterMutateReadNoti={afterMutateReadNoti}
        />
      ))}
    </Box>
  );
};
