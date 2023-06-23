export const getListConversationUrl = '/message-service/user/conversation';
export const getDetailConversationUrl = (id: number) =>
  `/message-service/user/conversation/${id}`;
export const getConversationByUserUrl = (userId: number) =>
  `/message-service/user/conversation/by-user/${userId}`;
export const getListMessageUrl = '/message-service/user/message';
export const sendMessageUrl = '/message-service/user/message';
export const readMessageUrl = (id: number) =>
  `/message-service/user/message/${id}/read`;
export const reactToMessageUrl = '/message-service/user/message/react';
