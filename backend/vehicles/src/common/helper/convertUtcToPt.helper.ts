import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertUtcToPt = (utcDateTime: string, format: string) => {
  return dayjs.utc(utcDateTime).tz('Canada/Pacific').format(format);
};
