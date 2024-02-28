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
    const [
      propertyToCompareAgainst,
      {
        difference: { maxDiff, unit },
        rounding,
      },
    ] = constraints as [string, MaxDifferenceType];
    const fromDateTime = (object as T)[propertyToCompareAgainst] as string;

    const difference = differenceBetween(fromDateTime, toDateTime, unit);

    // Transform the rounding duration to a unit specified by difference
    // to allow direct comparison.
    const roundingDuration = getDuration(rounding).as(unit);
    return difference > 0 && difference <= maxDiff + roundingDuration;
  }

  defaultMessage({ property, constraints }: ValidationArguments) {
    const [
      propertyToCompareAgainst,
      {
        difference: { maxDiff, unit },
      },
    ] = constraints as [string, MaxDifferenceType];
    return (
      `${property} must be after ${propertyToCompareAgainst}.` +
      `Max difference allowed is ${maxDiff} ${unit}.`
    );
  }
}
