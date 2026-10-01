import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { TIMEZONE_PACIFIC } from '@app/constants/dops.constant';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

export const convertUtcToPt = (dateTime: Date | string, format: string) => {
  const pacificDateTime = dayjs.utc(dateTime).tz(TIMEZONE_PACIFIC);
  const formattedDate = pacificDateTime.format(format);
  if (format.includes('Z')) {
    const tzOffset = formattedDate.slice(-6);
    let tzLabel = tzOffset === '-08:00' ? 'PST' : 'PDT';

    const threshold = dayjs.tz('2026-11-01', TIMEZONE_PACIFIC).startOf('day');
    if (tzLabel === 'PDT' && pacificDateTime.isSameOrAfter(threshold, 'day')) {
      tzLabel = 'PCT';
    }
    return `${formattedDate.slice(0, -6)} ${tzLabel}`;
  }
  return formattedDate;
};

export const dateFormat = (dateTime: string, format: string) => {
  const formattedDate = dayjs(dateTime).format(format);
  return formattedDate;
};
