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
  const today = getCurrentPacificDateTime();
  const currentHour = today.hour();
  // Set the base date to today, but at 9:00 PM PST
  let lastRunDate = today.set('hour', 21).set('minute', 0).set('second', 0);

  // If the current time is after 9:00 PM PST, set it to the next day at 9:00 PM
  if (currentHour > 21) {
    lastRunDate = lastRunDate.add(1, 'day');
  }
  return lastRunDate.utc().toDate(); // Convert to UTC before returning
};
