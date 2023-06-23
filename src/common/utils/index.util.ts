import dayjs from 'dayjs';
import { AudienceType } from 'shared';

type GenDisplayDateByTimeDiffOptions = {
  suffix?: string;
};

export const genDisplayDateByTimeDiff = (
  date: Date,
  opts: GenDisplayDateByTimeDiffOptions = {},
) => {
  let result = '';
  const now = dayjs();
  const dateObj = dayjs(date);
  const diffMinutes = now.diff(dateObj, 'minute');

  if (!result && diffMinutes < 60) {
    result = `${diffMinutes}m`;
  }

  // < 1 day
  if (!result && diffMinutes < 1440) {
    result = `${now.diff(dateObj, 'hour')}h`;
  }

  // < 7 day
  if (!result && diffMinutes < 10080) {
    result = `${now.diff(dateObj, 'day')}d`;
  }

  if (!result) {
    result = dateObj.format('DD MMMM');
  }

  if (opts.suffix) result = `${result} ${opts.suffix}`;

  return result;
};

export const getAudienceImageLink = (audienceType: AudienceType) => {
  let audienceTypeImageLink: string;

  switch (audienceType) {
    case AudienceType.PUBLIC:
      audienceTypeImageLink = '/images/audience-type-public.png';
      break;
    case AudienceType.ONLY_ME:
      audienceTypeImageLink = '/images/audience-type-private.png';
      break;
    case AudienceType.FRIEND:
      audienceTypeImageLink = '/images/audience-type-friend.png';
      break;
    default:
      audienceTypeImageLink = '/images/audience-type-public.png';
  }

  return audienceTypeImageLink;
};

export const flattenTree = <T extends Record<string, any>>(
  obj: T,
  key: string,
): T[] => {
  let result: T[] = [];
  if (!obj[key]?.length) return [{ ...obj }];

  for (const item of obj[key]) {
    const tree = flattenTree(item, key);
    result.push(...tree);
  }

  const cloneObj = { ...obj };
  delete cloneObj[key];

  result.push(obj);

  return result;
};
