import { Dayjs } from "dayjs";

/**
 * A type that replaces all direct entries with Dayjs types to string types.
 *
 * eg. T = { a: Dayjs, b: number }
 *
 * then ReplaceDayjsWithString = { a: string, b: number }
 *
 * eg. T = { a?: Dayjs, b: number },
 *
 * then ReplaceDayjsWithString = { a?: string, b: number }
 */
export type ReplaceDayjsWithString<T> = {
  [K in keyof T]: T[K] extends Dayjs
    ? string
    : T[K] extends Dayjs | undefined
    ? string | undefined
    : T[K];
};

/**
 * A type that replaces all direct entries with string types to Dayjs types,
 * as long as the entry key matches union of keys in Fields
 *
 * eg. T = { a: string, b: string, c: string }, Fields = "a" | "b"
 *
 * then DateStringToDayjs = { a: Dayjs, b: Dayjs, c: string }
 *
 * eg. T = { a?: string, b: number }, Fields = "a"
 *
 * then DateStringToDayjs = { a?: Dayjs, b: number }
 */
export type DateStringToDayjs<T, Fields> = {
  [K in keyof T]: K extends Fields 
    ? T[K] extends string ? Dayjs : T[K] extends string | undefined
      ? Dayjs | undefined : T[K]
    : T[K];
};
