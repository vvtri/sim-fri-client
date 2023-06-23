export const getListFriendUrl = `/friend-service/user/friend-request`;
export const getListFriendSuggestionUrl = `/friend-service/user/friend-request/suggestion`;
export const isFriendUrl = (userId: number) =>
  `/friend-service/user/friend-request/${userId}/is-friend`;
export const getFriendUrl = (userId: number) =>
  `/friend-service/user/friend-request/${userId}`;
export const countFriendUrl = (userId: number) =>
  `/friend-service/user/friend-request/${userId}/count`;
export const addFriendUrl = (userId: number) =>
  `/friend-service/user/friend-request/add/${userId}`;
export const replyFriendRequestUrl = `/friend-service/user/friend-request/reply`;
export const deleteFriendRequestUrl = (userId: number) =>
  `/friend-service/user/friend-request/${userId}`;
