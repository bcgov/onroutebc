import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export const LOCAL_TIMEZONE_ID = 'Canada/Pacific';

export const convertUtcToPt = (dateTime: Date | string, format: string) => {
  const formattedDate = dayjs
    .utc(dateTime)
    .tz(LOCAL_TIMEZONE_ID)
    .format(format);
  if (format.includes('Z')) {
    const tzOffset = formattedDate.slice(-6);
    const label = tzOffset === '-08:00' ? 'PST' : 'PDT';
    return `${formattedDate.slice(0, -6)} ${label}`;
  }
  return formattedDate;
};

export const getToDateForGarms = () => {
  // Current timestamp in the target timezone
  const currentTimeInTargetTimezone = dayjs().tz(LOCAL_TIMEZONE_ID);

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
