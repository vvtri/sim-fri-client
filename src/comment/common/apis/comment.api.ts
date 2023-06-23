export const getListCommentUrl = `/post-service/user/comment`;
export const getListReplyCommentUrl = `/post-service/user/comment/reply`;
export const getParentTreeCommentUrl = (id: number) =>
  `/post-service/user/comment/parent-tree/${id}`;
export const reactCommentUrl = `/post-service/user/comment/react`;
export const createCommentUrl = `/post-service/user/comment`;
export const updateCommentUrl = `/post-service/user/comment`;
export const deleteCommentUrl = (id: number) =>
  `/post-service/user/comment/${id}`;
export const deleteReactCommentUrl = `/post-service/user/comment/react`;
