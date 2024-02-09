import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PermitSearch } from '../enum/permit-search.enum';

@ValidatorConstraint({ name: 'PermitSearchBy', async: false })
export class PermitSearchByConstraint implements ValidatorConstraintInterface {
  validate(searchColumn: PermitSearch | undefined, args: ValidationArguments) {
    const searchString = (
      args.object as {
        searchString?: string;
      }
    ).searchString; // Access the searchString property from the same object

    // If searchColumn is defined, searchString should exists
    if (searchColumn && !searchString) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'searchString is required when searchColumn is defined';
  }
}
