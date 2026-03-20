import { DurationUnitType } from 'dayjs/plugin/duration';

/**
 * The type to specify a max allowable to difference between two datetimes.
 */
export interface DurationDifference {
  /**
   * The unit of comparison.
   */
  unit: DurationUnitType;
  /**
   * The maximum allowable difference.
   */
  maxDiff: number;
}

/**
 * The type to define values for a max allowable difference between two datetimes.
 */
export interface MaxDifferenceType {
  /**
   * The max allowable difference between two datetimes.
   */
  difference: DurationDifference;
  /**
   * The allowable rounding difference between two datetimes.
   * Optional. If not given, the value given in `difference` field
   * will be the hard limit.
   */
  rounding?: DurationDifference;
}
