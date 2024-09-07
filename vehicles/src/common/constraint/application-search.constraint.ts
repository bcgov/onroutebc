import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApplicationSearch } from '../enum/application-search.enum';

@ValidatorConstraint({ name: 'ApplicationSearchBy', async: false })
export class ApplicationSearchByConstraint
  implements ValidatorConstraintInterface
{
  validate(
    searchColumn: ApplicationSearch | undefined,
    args: ValidationArguments,
  ) {
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
