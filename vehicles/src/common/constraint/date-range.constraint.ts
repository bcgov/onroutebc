import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DurationUnitType } from 'dayjs/plugin/duration';
import { differenceBetween } from '../helper/date-time.helper';

/**
 * The type to define values for a max allowable difference between two datetimes.
 */
export type MaxDifferenceType = {
  /**
   * The unit of comparison.
   */
  unit: DurationUnitType;
  /**
   * The maximum allowable difference.
   */
  maxDiff: number;
  /**
   * Boolean flag to allow approximate comparisons.
   * This means, the calculated difference will be rounded to nearest
   * integer.
   * 
   * Defaults to false.
   */
  isApproximate?: boolean;
};

/**
 * The constraint implementation for checking if a datetime is after
 * another datetime and within the allowable difference.
 */
@ValidatorConstraint({ name: 'DateRange', async: false })
export class DateRangeConstraint<T> implements ValidatorConstraintInterface {
  validate(toDateTime: string, args: ValidationArguments) {
    // Some destructuring
    const { constraints, object } = args;
    const [propertyToCompareAgainst, { maxDiff, unit, isApproximate }] =
      constraints as [string, MaxDifferenceType];
    const fromDateTime = (object as T)[propertyToCompareAgainst] as string;

    const difference = differenceBetween(fromDateTime, toDateTime, unit);
    if (isApproximate) {
      return difference > 0 && Math.round(difference) <= maxDiff;
    }
    return difference > 0 && difference <= maxDiff;
  }

  defaultMessage({ property, constraints }: ValidationArguments) {
    const [propertyToCompareAgainst, { maxDiff, unit }] = constraints as [
      string,
      MaxDifferenceType,
    ];
    return (
      `${property} must be after ${propertyToCompareAgainst}.` +
      `Max difference allowed is ${maxDiff} ${unit}.`
    );
  }
}
