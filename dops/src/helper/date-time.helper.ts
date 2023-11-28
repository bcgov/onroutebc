import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertUtcToPt = (dateTime: Date | string, format: string) => {
  const formattedDate = dayjs.utc(dateTime).tz('Canada/Pacific').format(format);
  if (format.includes('Z')) {
    const tzOffset = formattedDate.slice(-6);
    const label = tzOffset === '-08:00' ? 'PST' : 'PDT';
    return `${formattedDate.slice(0, -6)} ${label}`;
  }
  return formattedDate;
};

export const dateFormat = (dateTime: string, format: string) => {
  const formattedDate = dayjs(dateTime).format(format);
  return formattedDate;
};
