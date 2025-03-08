import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export const convertUtcToPt = (dateTime: Date | string, format: string) => {
  const formattedDate = dayjs.utc(dateTime).tz('Canada/Pacific').format(format);
  if (format.includes('Z')) {
    const tzOffset = formattedDate.slice(-6);
    const label = tzOffset === '-08:00' ? 'PST' : 'PDT';
    return `${formattedDate.slice(0, -6)} ${label}`;
  }
  return formattedDate;
};

export const getToDateForGarms = () => {
  const today = dayjs().tz('Canada/Pacific');
  const currentHour = today.hour();
  // Set the base date to today, but at 9:00 PM PST
  let lastRunDate = today.set('hour', 21).set('minute', 0).set('second', 0);

  // If the current time is before 9:00 PM PST, set it to the previous day at 9:00 PM
  if (currentHour <= 21) {
    lastRunDate = lastRunDate.subtract(1, 'day');
  }
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
