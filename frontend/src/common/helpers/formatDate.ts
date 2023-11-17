import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";

// Need to add these plugins here
dayjs.extend(utc); // for using utc
dayjs.extend(timezone); // for using timezones
dayjs.extend(localizedFormat); // for using localized datetime formats (eg. LLL)
dayjs.extend(advancedFormat); // for using advanced datetime formats

export const DATE_FORMATS = {
  DATEONLY: "YYYY-MM-DD",
  DATETIME: "YYYY-MM-DD HH:mm:ss",
  SHORT: "LL",
  LONG: "MMM. DD, YYYY, hh:mm a z",
  DATEONLY_SHORT_NAME: "MMM D, YYYY",
  DATEONLY_ABBR_MONTH: "MMM. D, YYYY",
  DATETIME_LONG_TZ: "MMM D, YYYY, h:mm A z",
  DATEONLY_SLASH: "MM/DD/YYYY",
  ISO8601: "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
};

/**
 * Get the current local datetime DayJS object
 * @returns DayJS object representing current local datetime
 */
export const now = () => dayjs();

/**
 * Get the current UTC datetime DayJS object
 * @returns DayJS object representing current UTC datetime
 */
export const nowUtc = () => dayjs.utc();

/**
 * Get local datetime string in a specified format for a given DayJS object.
 * @param dayjsObj DayJS object that could be in any timezone
 * @param formatStr datetime format to display the datetime in (default ISO-8601)
 * @returns datetime string representing local datetime in the format specified
 */
export const dayjsToLocalStr = (dayjsObj: Dayjs, formatStr?: string) =>
  dayjs(dayjsObj).local().format(formatStr);

/**
 * Get UTC datetime string in a specified format for a given DayJS object.
 * @param dayjsObj DayJS object that could be in any timezone
 * @param formatStr datetime format to display the datetime in (default ISO-8601)
 * @returns datetime string representing UTC datetime in the format specified
 */
export const dayjsToUtcStr = (dayjsObj: Dayjs, formatStr?: string) =>
  dayjs(dayjsObj).utc().format(formatStr);

/**
 * Get UTC datetime string in a specified format for a given datetime string
 * @param dateTimeStr datetime string that could be in any timezone
 * @param formatStr datetime format to display in (default ISO-8601)
 * @returns datetime string representing UTC datetime in the format specified
 */
export const toUtc = (dateTimeStr: string, formatStr?: string) =>
  dayjs(dateTimeStr).utc().format(formatStr);

/**
 * Get local datetime string in a specified format for a given datetime string
 * @param dateTimeStr datetime string that could be in any timezone
 * @param formatStr datetime format to display in (default ISO-8601)
 * @returns datetime string representing local datetime in the format specified
 */
export const toLocal = (dateTimeStr: string, formatStr?: string) =>
  dayjs(dateTimeStr).local().format(formatStr);

/**
 * Get local DayJS object for a given UTC datetime string
 * @param dateTimeStr UTC datetime string
 * @returns DayJS object representing the local datetime
 */
export const utcToLocalDayjs = (dateTimeStr: string) =>
  dayjs.utc(dateTimeStr).local();

/**
 * Get local DayJS object for a given local datetime string
 * @param dateTimeStr local datetime string
 * @returns DayJS object representing the local datetime
 */
export const toLocalDayjs = (dateTimeStr: string) => dayjs(dateTimeStr);

/**
 * Get UTC DayJS object for any given datetime string
 * @param dateTimeStr UTC datetime string
 * @returns DayJS object representing the UTC datetime
 */
export const toUtcDayjs = (dateTimeStr: string) => dayjs(dateTimeStr).utc();

/**
 * Get datetime string in a specified format for a given timezone.
 * @param datetimeStr datetime string in some timezone
 * @param formatStr datetime format to display in (default ISO-8601)
 * @param ianaId IANA identifier for the specified timezone to interpret datetimeStr in (default represents local timezone)
 * @returns datetime string in a specified format for a specified timezone
 */
export const toTimeZone = (
  datetimeStr: string,
  formatStr?: string,
  ianaId?: string,
) =>
  ianaId
    ? dayjs(datetimeStr).tz(ianaId).format(formatStr)
    : toLocal(datetimeStr, formatStr);
