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

export const dayjsToUtcStr = (datetime: Dayjs, formatStr?: string) => 
  dayjs(datetime).utc().format(formatStr);

export const toUtc = (datetime: string, formatStr?: string) =>
  dayjs(datetime).utc().format(formatStr);

export const toLocal = (datetimeStr: string, formatStr: string) =>
  dayjs(datetimeStr).local().format(formatStr);

export const toLocalDayjs = (datetimeStr: string) =>
  dayjs.utc(datetimeStr).local();

export const toTimeZone = (datetimeStr: string, formatStr: "YYYY-MM-DD HH:mm:ss" | "YYYY-MM-DD", ianaId?: string) =>
  ianaId ? dayjs(datetimeStr).tz(ianaId).format(formatStr) : toLocal(datetimeStr, formatStr);

export interface PartialDayJsObject {
  $D: number,
  $H: number,
  $L: string,
  $M: number,
  $W: number,
  $d: any,
  $m: number,
  $ms: number,
  $s: number, 
  $u: any,
  $x: any,
  $y: number,
}

export const formatFromObject = (
  datetime: PartialDayJsObject,
  type: "date" | "datetime",
  timezone: "utc" | "local",
) => {
  const year = datetime.$y;
  const month = datetime.$M;
  const day = datetime.$D;
  const dayjsObj = timezone === "utc" ? dayjs.utc() : dayjs();
  
  if (type === "datetime") {
    const hour = datetime.$H;
    const minute = datetime.$m;
    const second = datetime.$s;
    
    return dayjsObj
      .set("year", year)
      .set("month", month)
      .set("date", day)
      .set("hour", hour)
      .set("minute", minute)
      .set("second", second)
      .format("YYYY-MM-DD HH:mm:ss");
  } 
  
  // date only
  return dayjsObj
    .set("year", year)
    .set("month", month)
    .set("date", day)
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .format("YYYY-MM-DD");
};
