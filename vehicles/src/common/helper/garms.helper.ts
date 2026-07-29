import { getCurrentPacificDateTime } from './date-time.helper';

/**
 * Returns the last run date in UTC for processing in the Pacific timezone context.
 *
 * This method determines the most recent 9:00 PM PST/PDT time. If the current Pacific
 * time is after 9:00 PM, it adjusts the last run date to 9:00 PM of the subsequent day.
 * The provided date is then converted to UTC before being returned to facilitate
 * consistent processing of date and time data.
 *
 * @returns {Date} The UTC last run date based on Pacific timezone context at 9:00 PM.
 */
export const getToDateForGarms = () => {
  // Current timestamp in the target timezone
  const currentTimeInTargetTimezone = getCurrentPacificDateTime();

  // Today at 9:00 PM in the target timezone
  const todayAt9PmInTargetTimezone = currentTimeInTargetTimezone
    .hour(21)
    .minute(0)
    .second(0)
    .millisecond(0);

  // Tomorrow at 9:00 PM in the target timezone
  const tomorrowAt9PmInTargetTimezone = todayAt9PmInTargetTimezone.add(
    1,
    'day',
  );

  // If the current time is after 9:00 PM PST, set it to the next day at 9:00 PM
  const lastRunTimestampInTargetTimezone = currentTimeInTargetTimezone.isAfter(
    todayAt9PmInTargetTimezone,
  )
    ? tomorrowAt9PmInTargetTimezone
    : todayAt9PmInTargetTimezone;

  return lastRunTimestampInTargetTimezone.utc().toDate();
};
