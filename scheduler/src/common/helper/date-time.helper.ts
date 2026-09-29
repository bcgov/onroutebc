import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { TIMEZONE_PACIFIC } from '@common/constants/api.constant';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
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

export const getToDateForGarms = () => {
  // Current timestamp in the target timezone
  const currentTimeInTargetTimezone = dayjs().tz(TIMEZONE_PACIFIC);

  // Today at 9:00 PM in the target timezone
  const todayAt9PmInTargetTimezone = currentTimeInTargetTimezone
    .hour(21)
    .minute(0)
    .second(0)
    .millisecond(0);

  // Yesterday at 9:00 PM in the target timezone
  const yesterdayAt9PmInTargetTimezone = todayAt9PmInTargetTimezone.subtract(
    1,
    'day',
  );

  // If it's before 9:00 PM today, use yesterday's 9:00 PM.
  // Otherwise, use today's 9:00 PM.
  const lastRunTimestampInTargetTimezone = currentTimeInTargetTimezone.isBefore(
    todayAt9PmInTargetTimezone,
  )
    ? yesterdayAt9PmInTargetTimezone
    : todayAt9PmInTargetTimezone;

  return lastRunTimestampInTargetTimezone.utc().toDate();
};

export const dateFormat = (dateTime: string, format: string) => {
  const formattedDate = dayjs(dateTime).format(format);
  return formattedDate;
};

/**
 * Calculates the difference between two date times.
 *
 * @param fromDateTime The from dateTime as a string
 * @param toDateTime The to dateTime as a string
 * @param unit The unit to return the difference value in. Default is days.
 * @returns A number with the following meaning:
 *          - Zero: from and to are equal.
 *          - Negative: to is before from.
 *          - Positive: to is after from.
 */
export const differenceBetween = (
  fromDateTime: string,
  toDateTime: string,
  unit: duration.DurationUnitType = 'days',
): number => {
  return dayjs
    .duration(dayjs.utc(toDateTime).diff(dayjs.utc(fromDateTime)))
    .as(unit);
};
