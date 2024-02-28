import { ValidationOptions, registerDecorator } from 'class-validator';
import { DateRangeConstraint } from '../constraint/date-range.constraint';
import { MaxDifferenceType } from '../interface/duration-difference.interface';

/**
 * Decorator that validates if a date time property is after
 * another property.
 *
 * @param propertyToCompareAgainst The name of the property to compare against
 * @param validationOptions Validation options, if any.
 * @returns A function that validates the input to the class.
 */
export function IsDateTimeAfter<T>(
  propertyToCompareAgainst: string,
  additionalConstraints?: MaxDifferenceType,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsDateTimeAfter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyToCompareAgainst, additionalConstraints],
      options: validationOptions,
      async: false,
      validator: DateRangeConstraint<T>,
    });
  };
}
