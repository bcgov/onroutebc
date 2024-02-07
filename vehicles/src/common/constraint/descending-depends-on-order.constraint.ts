import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'DescendingDependsOnOrderBy', async: false })
export class DescendingDependsOnOrderByConstraint
  implements ValidatorConstraintInterface
{
  validate(descending: boolean | undefined, args: ValidationArguments) {
    const orderBy = (
      args.object as {
        orderBy?: string;
      }
    ).orderBy; // Access the orderBy property from the same object

    // If orderBy is not defined, descending should not have a value
    if (!orderBy && descending !== undefined) {
      return false;
    }

    // If orderBy is defined, descending can have a value (true or false)
    return true;
  }

  defaultMessage() {
    return 'descending can only be provided when orderBy is also provided';
  }
}
