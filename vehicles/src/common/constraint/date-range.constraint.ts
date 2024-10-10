import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { differenceBetween, getDuration } from '../helper/date-time.helper';
import { MaxDifferenceType } from '../interface/duration-difference.interface';
/**
 * The constraint implementation for checking if a datetime is after
 * another datetime and within the allowable difference.
 */
@ValidatorConstraint({ name: 'DateRange', async: false })
export class DateRangeConstraint<T> implements ValidatorConstraintInterface {
  validate(toDateTime: string, args: ValidationArguments) {
    // Some destructuring
    const { constraints, object } = args;
    const [propertyToCompareAgainst, maxDifference] = constraints as [
      string,
      MaxDifferenceType,
    ];
    const fromDateTime = (object as T)[propertyToCompareAgainst] as string;

    const difference = differenceBetween(
      fromDateTime,
      toDateTime,
      maxDifference?.difference?.unit,
    );

    // Transform the rounding duration to a unit specified by difference
    // to allow direct comparison.
    if (maxDifference?.difference) {
      const roundingDuration = getDuration(maxDifference?.rounding).as(
        maxDifference?.difference?.unit,
      );
      return (
        difference > 0 &&
        difference <= maxDifference?.difference?.maxDiff + roundingDuration
      );
    } else {
      return difference > 0;
    }
  }

  defaultMessage({ property, constraints }: ValidationArguments) {
    const [propertyToCompareAgainst, maxDifference] = constraints as [
      string,
      MaxDifferenceType,
    ];
    return (
      `${property} must be after ${propertyToCompareAgainst}.` +
      (maxDifference
        ? `Max difference allowed is ${maxDifference?.difference?.maxDiff} ${maxDifference?.difference?.unit}.`
        : '')
    );
  }
}
