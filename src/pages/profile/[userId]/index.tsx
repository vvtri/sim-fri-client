import { Stack } from '@mui/system';
import { useQueryClient } from '@tanstack/react-query';
import { ReactElement, useEffect } from 'react';
import { PostReactionType } from 'shared';
import {
  ICreateCommentRes,
  IReactCommentRes,
} from '../../../comment/common/interfaces/res/comment.res.interface';
import { ICommentReaction } from '../../../comment/common/models/comment-reaction.model';
import { IComment } from '../../../comment/common/models/comment.model';
import { useAuth } from '../../../common/hooks/use-auth';
import ProfileLayout from '../../../common/layouts/ProfileLayout';
import { ViewPostDialog } from '../../../post/common/components/ViewDetailDialog';
import { useInfinitePost } from '../../../post/common/hooks/use-infinite-post';
import { IDeleteReactPostReq } from '../../../post/common/interfaces/req/post.req.interface';
import {
  ICreatePostRes,
  IReactPostRes,
} from '../../../post/common/interfaces/res/post.res.interface';
import { IPostReaction } from '../../../post/common/models/post-reaction.model';
import { CreatePostBox } from '../../../post/create/components/CreatePostBox';
import CreatePostDialog from '../../../post/create/components/CreatePostDialog';
import UpdatePostDialog from '../../../post/create/components/UpdatePostDialog';
import { ProfileTabs } from '../../../profile/common/enums/profile.enum';
import { useViewingProfile } from '../../../profile/common/hooks/use-viewing-profile';
import { ProfileListPost } from '../../../profile/detail/components/ProfileListPosts';
import { UserProfileFriendCard } from '../../../profile/detail/components/UserProfileFriendCard';
import { UserProfileIntroCard } from '../../../profile/detail/components/UserProfileIntroCard';
import { UserProfilePhotoCard } from '../../../profile/detail/components/UserProfilePhotoCard';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  setViewPostData,
  viewPostSelector,
} from '../../../redux/slices/post.slice';
import {
  setProfileTabValue,
  viewingProfileUserIdSelector,
} from '../../../redux/slices/profile.slice';

type ProfileProps = {};

export default function Profile({}: ProfileProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { userProfile: authData } = useAuth();
  const userId = useAppSelector(viewingProfileUserIdSelector);
  const { data: userProfile } = useViewingProfile(userId as number);
  const isMyProfile = authData?.user?.id === userProfile?.user?.id;
  const { isShow, post } = useAppSelector(viewPostSelector);
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    afterDeleteReactPost: afterDeleteReactPostInfinitePost,
    afterReactPost: afterReactPostInfinitePost,
    afterCreateComment: afterCreateCommentInfinitePost,
    afterReactComment: afterReactCommentInfinitePost,
    afterCreatePost: afterCreatePostInfinitePost,
    afterDeleteReactComment: afterDeleteReactCommentInfinitePost,
    afterDeletePost,
    afterUpdatePost,
    afterDeleteComment,
    afterUpdateComment,
  } = useInfinitePost({ userId });

  const posts = data?.pages.flatMap((item) => item.items) || [];

  const afterReactPost = (data: IReactPostRes, myReaction: IPostReaction) => {
    afterReactPostInfinitePost(data, myReaction);
    if (!isShow || post?.id !== data.postId) return;
    dispatch(setViewPostData({ ...post, myReaction: data }));
  };

  const afterDeleteReactPost = (
    req: IDeleteReactPostReq,
    reactType: PostReactionType,
  ) => {
    afterDeleteReactPostInfinitePost(req, reactType);

    if (!isShow || post?.id !== req.postId) return;
    dispatch(setViewPostData({ ...post, myReaction: null as any }));
  };

  const afterReactComment = (
    data: IReactCommentRes,
    comment: IComment,
    myReaction: ICommentReaction,
  ) => {
    afterReactCommentInfinitePost(data, comment, myReaction);
  };

  const afterCreatePost = (data: ICreatePostRes) => {
    afterCreatePostInfinitePost(data);
  };

  const afterCreateComment = (data: ICreateCommentRes) => {
    afterCreateCommentInfinitePost(data);
  };

  const afterDeleteReactComment = (
    oldReaction: ICommentReaction,
    comment: IComment,
  ) => {
    afterDeleteReactCommentInfinitePost(oldReaction, comment);
  };

  useEffect(() => {
    dispatch(setProfileTabValue(ProfileTabs.POST));
  }, []);

  return (
    <>
      {isMyProfile && <CreatePostDialog afterCreate={afterCreatePost} />}
      {isMyProfile && <UpdatePostDialog afterUpdatePost={afterUpdatePost} />}

      <Stack direction="row" spacing="14px" mt="14px" paddingBottom="40px">
        <Stack direction="column" width="30%" spacing="14px" flexShrink="0">
          <UserProfileIntroCard />
          <UserProfilePhotoCard />
          <UserProfileFriendCard />
        </Stack>

        <ViewPostDialog
          afterReactComment={afterReactComment}
          afterReactPost={afterReactPost}
          afterCreateComment={afterCreateComment}
          afterDeleteReactPost={afterDeleteReactPost}
          afterDeleteReactComment={afterDeleteReactComment}
          afterDeletePost={afterDeletePost}
          afterDeleteComment={afterDeleteComment}
          afterUpdateComment={afterUpdateComment}
        />
        <Stack width="70%" spacing="18px">
          {isMyProfile && <CreatePostBox />}

          <ProfileListPost
            posts={posts}
            fetchNextPage={fetchNextPage}
            isFetching={isFetching || isFetchingNextPage}
            afterDeleteReactPost={afterDeleteReactPost}
            afterReactPost={afterReactPost}
            afterReactComment={afterReactComment}
            afterCreateComment={afterCreateComment}
            afterDeleteReactComment={afterDeleteReactComment}
            afterDeletePost={afterDeletePost}
            afterUpdatePost={afterUpdatePost}
            afterDeleteComment={afterDeleteComment}
            afterUpdateComment={afterUpdateComment}
          />
        </Stack>
      </Stack>
    </>
  );
}

Profile.getLayout = (page: ReactElement) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};
