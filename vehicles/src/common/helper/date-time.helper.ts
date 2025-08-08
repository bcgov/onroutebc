import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as duration from 'dayjs/plugin/duration';
import * as quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { DurationDifference } from '../interface/duration-difference.interface';
import { Nullable } from '../types/common';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(quarterOfYear);

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

/**
 * Calculates the duration based on a maximum difference and unit.
 *
 * @param {DurationDifference} params An object with `maxDiff`, `unit` parameters.
 *                                    `maxDiff` is the maximum difference and `unit` is the unit of time.
 * @returns {number} The duration in the specified unit.
 */

export const getDuration = ({
  maxDiff = 0,
  unit = 'days',
}: DurationDifference): duration.Duration => {
  return dayjs.duration(maxDiff, unit);
};

/**
 * Returns the start date of the quarter for a given date time.
 *
 * @param dateTime The dateTime as a string
 * @returns The start date of the quarter as a Date object.
 */
export const startOfQuarterOfYear = (dateTime: string): Date => {
  const result = dayjs(dateTime).startOf('quarter').toDate();
  return result;
};

/**
 * Returns the end date of the quarter for a given date time.
 *
 * @param dateTime The dateTime as a string
 * @returns The end date of the quarter as a Date object.
 */
export const endOfQuarterOfYear = (dateTime: string): Date => {
  const result = dayjs(dateTime).endOf('quarter').toDate();
  return result;
};

/**
 * Adds a specified number of days to a given date.
 *
 * @param dateTime The date as a Date object
 * @param daysToAdd The number of days to add to the date
 * @returns The new date with the added days as a Date object.
 */
export const addDaysToDate = (dateTime: string, daysToAdd: number): Date => {
  const result = dayjs.utc(dateTime).add(daysToAdd, 'days').toDate();
  return result;
};

/**
 * Determines if a date falls within the same calendar quarter of a reference date.
 *
 * @param dateToCheck The date to check as a string.
 * @param referenceDate Optional reference date as a string. Defaults to current date if not provided.
 * @returns True if the dateToCheck is within the quarter of the referenceDate; otherwise, false.
 */
export const isWithinCalendarQuarter = (
  dateToCheck: string,
  referenceDate?: Nullable<string>,
): boolean => {
  // Determine the quarter boundaries of the given or current date

  const currentReferenceDate = referenceDate ?? new Date().toISOString();
  const quarterEndDate = convertUtcToPt(
    endOfQuarterOfYear(currentReferenceDate),
    'YYYY-MM-DD',
  );
  const quarterStartDate = convertUtcToPt(
    startOfQuarterOfYear(currentReferenceDate),
    'YYYY-MM-DD',
  );

  // Check if the date to check is outside the quarter boundaries
  return (
    differenceBetween(dateToCheck, quarterEndDate) >= 0 &&
    differenceBetween(dateToCheck, quarterStartDate) <= 0
  );
};

/**
 * Determines if a date falls before the start of the calendar quarter of a reference date.
 *
 * @param dateToCheck The date to check as a string.
 * @param referenceDate Optional reference date as a string. Defaults to current date if not provided.
 * @returns True if the dateToCheck is before the start of the quarter of the referenceDate; otherwise, false.
 */
export const isBeforeCalendarQuarter = (
  dateToCheck: string,
  referenceDate?: Nullable<string>,
): boolean => {
  // Determine the quarter boundaries of the given or current date

  const currentReferenceDate = referenceDate ?? new Date().toISOString();
  const quarterStartDate = convertUtcToPt(
    startOfQuarterOfYear(currentReferenceDate),
    'YYYY-MM-DD',
  );

  // Check if the date to check is outside the quarter boundaries
  return differenceBetween(dateToCheck, quarterStartDate) <= 0;
};

/**
 * Determines if a date falls after the end of the calendar quarter of a reference date.
 *
 * @param dateToCheck The date to check as a string.
 * @param referenceDate Optional reference date as a string. Defaults to current date if not provided.
 * @returns True if the dateToCheck is after the end of the quarter of the referenceDate; otherwise, false.
 */
export const isAfterCalendarQuarter = (
  dateToCheck: string,
  referenceDate?: Nullable<string>,
): boolean => {
  // Determine the quarter boundaries of the given or current date

  const currentReferenceDate = referenceDate ?? new Date().toISOString();
  const quarterEndDate = convertUtcToPt(
    endOfQuarterOfYear(currentReferenceDate),
    'YYYY-MM-DD',
  );

  // Check if the date to check is outside the quarter boundaries
  return differenceBetween(dateToCheck, quarterEndDate) >= 0;
};
