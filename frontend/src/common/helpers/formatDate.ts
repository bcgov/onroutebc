import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (
  formatter: Intl.DateTimeFormat,
  inputDateStr: any
) => {
  if (!inputDateStr) return null;
  let inputDate;
  if (typeof inputDateStr === "string") {
    inputDate = new Date(inputDateStr);
  } else if (typeof inputDateStr === "object") {
    const year = inputDateStr.$y;
    const month = inputDateStr.$M;
    const day = inputDateStr.$D;
    const hour = inputDateStr.$H;
    const minute = inputDateStr.$m;
    const second = inputDateStr.$s;
    inputDate = new Date(year, month, day, hour, minute, second);
  } else {
    throw new Error("Invalid date format");
  }
  const formattedDateStr = formatter.format(inputDate);
  return formattedDateStr;
};

export const now = () => dayjs();
export const nowUtc = () => dayjs.utc();

export const dayjsToLocalStr = (dayjsObj: Dayjs, formatStr?: string) => 
  dayjs(dayjsObj).local().format(formatStr);

export const dayjsToUtcStr = (dayjsObj: Dayjs, formatStr?: string) => 
  dayjs(dayjsObj).utc().format(formatStr);

export const toUtc = (dateTimeStr: string, formatStr?: string) =>
  dayjs(dateTimeStr).utc().format(formatStr);

export const toLocal = (dateTimeStr: string, formatStr: string) =>
  dayjs(dateTimeStr).local().format(formatStr);

export const toLocalDayjs = (dateTimeStr: string) =>
  dayjs.utc(dateTimeStr).local();

export const toUtcDayjs = (dateTimeStr: string) =>
  dayjs(dateTimeStr).utc();

export const toTimeZone = (datetimeStr: string, formatStr: "YYYY-MM-DD HH:mm:ss" | "YYYY-MM-DD", ianaId?: string) =>
  ianaId ? dayjs(datetimeStr).tz(ianaId).format(formatStr) : toLocal(datetimeStr, formatStr);
