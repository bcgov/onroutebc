import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Nullable } from '../types/common';
import { ApplicationSearch } from '../enum/application-search.enum';

@ValidatorConstraint({ name: 'ApplicationSearch', async: false })
export class ApplicationSearchConstraint
  implements ValidatorConstraintInterface
{
  validate(
    value: ApplicationSearch | boolean | undefined,
    args: ValidationArguments,
  ) {
    const fields = args.object as {
      pendingPermits?: Nullable<boolean>;
      applicationsInQueue?: Nullable<boolean>;
      searchColumn?: Nullable<ApplicationSearch>;
      searchString?: Nullable<string>;
    };
    if (
      fields.pendingPermits != undefined &&
      fields.applicationsInQueue !== undefined
    ) {
      return false;
    } else if (fields.searchColumn && !fields.searchString) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const message: string[] = [];
    const fields = args.object as {
      pendingPermits?: Nullable<boolean>;
      applicationsInQueue?: Nullable<boolean>;
      searchColumn?: Nullable<ApplicationSearch>;
      searchString?: Nullable<string>;
    };
    if (
      fields.pendingPermits != undefined &&
      fields.applicationsInQueue !== undefined
    ) {
      message.push(
        'Both pendingPermits and applicationsInQueue cannot be set at the same time.',
      );
    }
    if (fields.searchColumn && !fields.searchString) {
      message.push('searchString is required when searchColumn is defined.');
    }
    if (message?.length) {
      return message.join(', ');
    }
  }
}
