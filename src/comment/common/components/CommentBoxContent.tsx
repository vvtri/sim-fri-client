import { MoreHoriz } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Center } from '../../../common/components/utils/Center';
import { ReactionCount } from '../../../common/components/utils/ReactionCount';
import { CARD_BOX_SHADOW } from '../../../common/constants/index.constant';
import { useAuth } from '../../../common/hooks/use-auth';
import { useDeleteComment } from '../hooks/use-delete-comment';
import { IComment } from '../models/comment.model';

type CommentBoxContentProps = {
  comment: IComment;
  emphasizedCommentIds?: number[];
  handleEditComment: (...args: any[]) => any;
  afterDeleteComment: (data: IComment) => any;
};

export const CommentBoxContent = ({
  comment,
  emphasizedCommentIds,
  handleEditComment,
  afterDeleteComment,
}: CommentBoxContentProps) => {
  const { user, content, angryCount, likeCount, totalCount, loveCount } =
    comment;
  const { userProfile } = useAuth();
  const [menuState, setMenuState] = useState({
    isShowIcon: false,
    isShowPanel: false,
  });
  const { mutate, isLoading } = useDeleteComment({
    onSuccess(data, variables, context) {
      afterDeleteComment(comment);
    },
    onError(error, variables, context) {
      console.log('error', error);
    },
  });
  const isMyComment = user.id === userProfile?.user.id;
  const contentRef = useRef<HTMLDivElement | null>(null);
  const menuActionRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const emphasizedIdx = emphasizedCommentIds?.findIndex(
    (item) => item === comment.id,
  );

  const handleDeleteComment = () => {
    mutate(comment.id);
  };

  useEffect(() => {
    const handlerDisplayPanel = (e: MouseEvent) => {
      const target = e.target as any;

      if (menuActionRef.current?.contains(target)) {
        return setMenuState((old) => ({
          ...old,
          isShowPanel: !old.isShowPanel,
        }));
      }

      if (!panelRef.current?.contains(target)) {
        return setMenuState((old) => ({
          ...old,
          isShowPanel: false,
          isShowIcon: false,
        }));
      }
    };

    document.addEventListener('click', handlerDisplayPanel);

    return () => document.removeEventListener('click', handlerDisplayPanel);
  }, []);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="6px"
      onMouseEnter={() => {
        setMenuState((old) => ({ ...old, isShowIcon: true }));
      }}
      onMouseLeave={() =>
        setMenuState((old) => ({
          ...old,
          isShowIcon: old.isShowPanel || false,
        }))
      }
    >
      <Stack
        bgcolor={Number(emphasizedIdx) >= 0 ? '#203F65' : 'comment.main'}
        borderRadius="20px"
        paddingY="8px"
        paddingX="14px"
        width="fit-content"
        position="relative"
        ref={contentRef}
        minWidth="0"
      >
        <Link href="/">
          <Typography fontSize="0.8125rem" fontWeight="600">
            {user.profile.name}
          </Typography>
        </Link>

        <Typography fontSize="0.9375rem" fontWeight="400" whiteSpace="pre-wrap">
          {content}
        </Typography>

        <Stack
          position="absolute"
          top="100%"
          left="100%"
          sx={{
            transform:
              contentRef.current!?.clientWidth > 140
                ? 'translate(-100%,-50%)'
                : 'translate(-20%,-100%)',
            cursor: 'pointer',
          }}
        >
          <ReactionCount
            angryCount={angryCount}
            likeCount={likeCount}
            loveCount={loveCount}
            totalCount={totalCount}
          />
        </Stack>
      </Stack>

      {isMyComment && menuState.isShowIcon && (
        <Center
          sx={{
            width: '28px',
            height: '28px',
            flexShrink: '0',
            borderRadius: '50%',
            ':hover': { bgcolor: 'hoverColor.main' },
            cursor: 'pointer',
            transition: '.2s',
          }}
          position="relative"
          ref={menuActionRef}
        >
          <MoreHoriz sx={{ width: '18px', height: '18px' }} />
          {menuState.isShowPanel && (
            <Stack
              position="absolute"
              bgcolor="darkAccent.main"
              sx={{
                boxShadow: CARD_BOX_SHADOW,
                overflowY: 'auto',
                top: '100%',
                left: '100%',
                transition: '.2s',
                visibility: menuState.isShowPanel ? 'visible' : 'hidden',
                opacity: menuState.isShowPanel ? '1' : '0',
                transform: 'translateX(-50%)',
              }}
              width="344px"
              height="fit-content"
              zIndex="1"
              borderRadius="10px"
              p="10px"
              color="primaryText.main"
              ref={panelRef}
            >
              <Stack
                direction="row"
                p="10px"
                sx={{
                  ':hover': { bgcolor: 'hoverColor.main' },
                  cursor: 'pointer',
                }}
                borderRadius="5px"
                spacing="10px"
                onClick={handleEditComment}
              >
                <Typography fontSize="0.9375rem" fontWeight="500">
                  Edit
                </Typography>
              </Stack>

              <Stack
                direction="row"
                p="10px"
                sx={{
                  ':hover': { bgcolor: 'hoverColor.main' },
                  cursor: 'pointer',
                }}
                borderRadius="5px"
                spacing="10px"
                onClick={handleDeleteComment}
              >
                <Typography fontSize="0.9375rem" fontWeight="500">
                  Delete
                </Typography>
              </Stack>
            </Stack>
          )}
        </Center>
      )}
    </Stack>
  );
};
