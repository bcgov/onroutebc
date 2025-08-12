import { getCurrentPacificDateTime } from './date-time.helper';

/**
 * Returns the last run date in UTC for processing in the Pacific timezone context.
 *
 * The method calculates the most recent 9:00 PM PST time. If the current Pacific time is before
 * 9:00 PM, it sets the last run date to 9:00 PM of the previous day. The final date is converted
 * to UTC before returning, allowing for consistent processing of date and time data.
 *
 * @returns {Date} The UTC last run date based on Pacific timezone context at 9:00 PM.
 */
export const getToDateForGarms = () => {
  const today = getCurrentPacificDateTime();
  const currentHour = today.hour();
  // Set the base date to today, but at 9:00 PM PST
  let lastRunDate = today.set('hour', 21).set('minute', 0).set('second', 0);

  // If the current time is before 9:00 PM PST, set it to the previous day at 9:00 PM
  if (currentHour <= 21) {
    lastRunDate = lastRunDate.subtract(1, 'day');
  }
  return lastRunDate.utc().toDate(); // Convert to UTC before returning
};
