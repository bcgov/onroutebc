import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

// Need to add these plugins here
dayjs.extend(utc); // for using utc
dayjs.extend(timezone); // for using timezones
dayjs.extend(localizedFormat); // for using localized datetime formats (eg. LLL)
dayjs.extend(advancedFormat); // for using advanced datetime formats
dayjs.extend(quarterOfYear); // for calculating dates based on quarters of a year

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
} as const;

export type DateFormat = typeof DATE_FORMATS[keyof typeof DATE_FORMATS];

export const TIMEZONE_IDS = {
  PACIFIC: "America/Vancouver",
} as const;

export type TimezoneId = typeof TIMEZONE_IDS[keyof typeof TIMEZONE_IDS];

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
 * Get the browser timezone id.
 * @returns String representing timezone id of the browser, or undefined if it doesn't exist
 */
export const getBrowserTimeZoneId = () => {
  return typeof Intl !== "undefined" && Intl.DateTimeFormat
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : undefined;
};

/**
 * Format datetime string (if PCT is applicable).
 * @param dateTimeStr Formatted datetime string (of any timezone)
 * @param timezoneId Timezone id of dateTimeStr
 * @returns Formatted datetime string that includes PCT when applicable
 */
const formatDateTimeStrForPCT = (dateTimeStr: string, timezoneId: TimezoneId) => {
  if (dateTimeStr.includes("PCT")) return dateTimeStr;
  if (!dateTimeStr.includes("PDT") && !dateTimeStr.includes("MST")) return dateTimeStr;

  const effectivePCTStartDateTime = dayjs.tz("2026-11-01", TIMEZONE_IDS.PACIFIC).startOf("day");
  const browserTimezoneId = getBrowserTimeZoneId();
  const pacificDateTime = convertToTimezone(
    convertToTimezone(dateTimeStr, timezoneId),
    TIMEZONE_IDS.PACIFIC,
  );

  if (
    browserTimezoneId === TIMEZONE_IDS.PACIFIC
      && !pacificDateTime.isBefore(effectivePCTStartDateTime)
  ) {
    return dateTimeStr.replace("PDT", "PCT").replace("MST", "PCT");
  }

  return dateTimeStr;
};

/**
 * Get Pacific datetime string in a specified format for any given DayJS object.
 * @param datetime DayJS object (in any given timezone)
 * @param format Datetime format for display (default ISO-8601)
 * @returns Datetime string representing Pacific datetime in the format specified
 */
export const dayjsToPacificDateTimeStr = (datetime: Dayjs, format?: DateFormat) => {
  const formattedDateTimeStr = convertToTimezone(
    datetime,
    TIMEZONE_IDS.PACIFIC,
  ).format(format);

  return formatDateTimeStrForPCT(formattedDateTimeStr, TIMEZONE_IDS.PACIFIC);
};

/**
 * Get UTC datetime string in a specified format for a given DayJS object.
 * @param datetime DayJS object (in any given timezone)
 * @param format Datetime format for display (default ISO-8601)
 * @returns Datetime string representing UTC datetime in the format specified
 */
export const dayjsToUtcDateTimeStr = (datetime: Dayjs, format?: DateFormat) =>
  dayjs(datetime).utc().format(format);

/**
 * Get UTC datetime string in a specified format for a given datetime string
 * @param datetime Datetime string that could be in any timezone
 * @param format Datetime format for display (default ISO-8601)
 * @returns Datetime string representing UTC datetime in the format specified
 */
export const toUtc = (datetime: string, format?: DateFormat) =>
  dayjs(datetime).utc().format(format);

/**
 * Get the Pacific datetime string in a specified format for a given datetime string.
 * @param dateTimeStr Datetime string that could be in any timezone
 * @param formatStr Datetime format for display (default ISO-8601)
 * @param isDateTimeStrPacific Whether or not the provided datetime string is already Pacific
 * @returns Pacific datetime string in the specified format
 */
export const toPacificDateTimeStr = (
  dateTimeStr: string,
  format?: DateFormat,
  isDateTimeStrPacific?: boolean,
) =>
  isDateTimeStrPacific
    ? dayjsToPacificDateTimeStr(toPacificDayjs(dateTimeStr), format)
    : dayjsToPacificDateTimeStr(
        convertToTimezone(dayjs(dateTimeStr), TIMEZONE_IDS.PACIFIC),
        format,
      );

/**
 * Get Pacific DayJS object for a given UTC datetime string
 * @param dateTimeStr UTC datetime string
 * @returns DayJS object representing the Pacific datetime
 */
export const utcToPacificDayjs = (dateTimeStr: string) =>
  convertToTimezone(getUtcDatetime(dateTimeStr), TIMEZONE_IDS.PACIFIC);

/**
 * Get Pacific DayJS object for a given Pacific datetime string
 * @param dateTimeStr Pacific datetime string
 * @returns DayJS object representing the Pacific datetime
 */
export const toPacificDayjs = (pacificDateTimeStr: string) =>
  convertToTimezone(pacificDateTimeStr, TIMEZONE_IDS.PACIFIC);

/**
 * Convert a datetime to a specified timezone.
 * @param datetime Datetime to be converted
 * @param timezoneId Id of the timezone to convert to (eg. "America/Vancouver")
 * @returns Dayjs object in the specified timezone
 */
export const convertToTimezone = (
  datetime: string | Dayjs | Date,
  timezoneId: string,
) => {
  return dayjs.tz(datetime, timezoneId);
};

/**
 * Get UTC datetime.
 * @returns Dayjs object representing datetime in UTC
 */
export const getUtcDatetime = (datetime?: Dayjs | Date | string) => {
  return dayjs.utc(datetime);
};

/**
 * Gets the number of days between two datetimes (should both be in the same timezone).
 * @param laterDt Dayjs object representing the later datetime
 * @param earlierDt Dayjs object representing the earlier datetime
 * @returns Number of days between the two datetimes.
 */
export const getDateDiffInDays = (laterDt: Dayjs, earlierDt: Dayjs) => {
  return laterDt.diff(earlierDt, "day");
};

/**
 * Get the start of any datetime (ie. the date + time of 00:00:00 am).
 * @param date Any Dayjs object or date string representation
 * @returns Dayjs object representing the start of the datetime (with time 00:00:00 am)
 */
export const getStartOfDate = (date: Dayjs | string) => {
  return dayjs(date).hour(0).minute(0).second(0).millisecond(0);
};

/**
 * Get the end of any datetime (ie. the date + time of 23:59:59 pm).
 * @param date Any Dayjs object or date string representation
 * @returns Dayjs object representing the end of the datetime (with time 23:59:59 pm)
 */
export const getEndOfDate = (date: Dayjs | string) => {
  return dayjs(date).hour(23).minute(59).second(59).millisecond(999);
};

/**
 * Get the start of the quarter for any given datetime (ie. the date + time of 00:00:00 am).
 * @param date Any Dayjs object or date string representation
 * @returns Dayjs object representing the start of the quarter for the datetime (with time 00:00:00 am)
 */
export const getStartOfQuarter = (date: Dayjs | string) => {
  return dayjs(date)
    .startOf("quarter")
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
};

/**
 * Get the end of the quarter for any given datetime (ie. the date + time of 23:59:59 pm).
 * @param date Any Dayjs object or date string representation
 * @returns Dayjs object representing the end of the quarter for the datetime (with time 23:59:59 pm)
 */
export const getEndOfQuarter = (date: Dayjs | string) => {
  return dayjs(date)
    .endOf("quarter")
    .hour(23)
    .minute(59)
    .second(59)
    .millisecond(999);
};

/**
 * Get the quarter number for a given date.
 * @param date Any Dayjs object or date string representation
 * @returns Number representing the quarter that the date is in
 */
export const getQuarterForDate = (date: Dayjs | string) => {
  return dayjs(date).quarter();
};

/**
 * Get the end of the year for any given datetime (ie. the date + time of 23:59:59 pm).
 * @param date Any Dayjs object or date string representation
 * @returns Dayjs object representing the end of the year for the datetime (with time 23:59:59 pm)
 */
export const getEndOfYear = (date: Dayjs | string) => {
  return dayjs(date)
    .endOf("year")
    .hour(23)
    .minute(59)
    .second(59)
    .millisecond(999);
};
