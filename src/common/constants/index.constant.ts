export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api';

export const LOCAL_STORAGE_AUTH_TOKEN_KEY = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
};

export const DEFAULT_MESSAGE = 'Có lỗi xảy ra';

export const emptyAvatarUrl = '/images/blank-avatar.png';

export const headerHeight = '65px';

export const QUERY_KEYS = {
  INFINITE_POSTS: 'INFINITE_POSTS',
  LIST_CONVERSATION: 'LIST_CONVERSATION',
  CONVERSATION_BY_USER: 'CONVERSATION_BY_USER',
  INFINITE_CONVERSATION: 'INFINITE_CONVERSATION',
  VIEWING_PROFILE: 'VIEWING_PROFILE',
  INFINITE_MESSAGE: 'INFINITE_MESSAGE',
  INFINITE_FRIEND: 'INFINITE_FRIEND',
  INFINITE_FRIEND_SUGGESTION: 'INFINITE_FRIEND_SUGGESTION',
  COUNT_FRIEND: 'COUNT_FRIEND',
  ADD_FRIEND: 'ADD_FRIEND',
  GET_FRIEND: 'GET_FRIEND',
  INFINITE_COMMENT: 'INFINITE_COMMENT',
  PARENT_TREE_COMMENT: 'PARENT_TREE_COMMENT',
  POST_DETAIL: 'POST_DETAIL',
  DETAIL_CONVERSATION: 'DETAIL_CONVERSATION',
  INFINITE_PEOPLE: 'INFINITE_PEOPLE',
  INFINITE_NOTI: 'INFINITE_NOTI',
  IS_FRIEND: 'IS_FRIEND',
};

export const DATE_FORMAT = 'DD MMMM';

export const AUDIO_PATH = {
  RINGTONE: `${process.env.NEXT_PUBLIC_HOST}/audios/new-message-ringtone.mp3`,
};

export const CARD_BOX_SHADOW =
  '0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1)';

export const IMAGE_PATHS = {
  LIKE_ICON: '/images/like-icon.svg',
  LOVE_ICON: '/images/love-icon.svg',
  ANGRY_ICON: '/images/angry-icon.svg',
  FRIEND_ICON: '/images/friend-accepted-icon-removebg-preview.png',
};

export const dotCharacter = '&#183;';

export const fontFamily = 'Helvetica, Noto Color Emoji, Arial, sans-serif';

export const properOverflowClass = 'popper-overflow';
