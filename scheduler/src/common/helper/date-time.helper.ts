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
  // Current datetime in local time (including Daylight Savings if applicable)
  const nowDtLocal = dayjs().tz(LOCAL_TIMEZONE_ID);

  // Scheduled time for processing, which is at 9:00pm local time on the same day
  const scheduledDtLocal = dayjs(
    `${nowDtLocal.format('YYYY-MM-DD')} 21:00:00`,
  ).tz(LOCAL_TIMEZONE_ID);

  // Scheduled time for processing at 9:00pm local time on the previous day
  const scheduledDtOneDayBeforeLocal = dayjs(
    `${dayjs(scheduledDtLocal).subtract(1, 'day').format('YYYY-MM-DD')} 21:00:00`,
  ).tz(LOCAL_TIMEZONE_ID);

  // If current datetime is before the scheduled time for today, use the previous day's scheduled time
  // Otherwise (already past the scheduled time for today), use today's scheduled time
  const lastRunDate = nowDtLocal.isBefore(scheduledDtLocal)
    ? scheduledDtOneDayBeforeLocal
    : scheduledDtLocal;

  return lastRunDate.utc().toDate(); // Convert to UTC before returning
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
