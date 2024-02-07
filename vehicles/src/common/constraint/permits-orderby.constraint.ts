import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PermitOrderBy } from '../enum/permit-orderBy.enum';
import { OrderBy } from '../enum/orderBy.enum';

@ValidatorConstraint({ name: 'PermitsOrderBy', async: false })
export class PermitsOrderByConstraint implements ValidatorConstraintInterface {
  private static readonly ALLOWED_PERMIT_ORDER_BY_VALUES =
    Object.values(PermitOrderBy);
  private static readonly ALLOWED_ORDER_BY_VALUES = Object.values(OrderBy);

  validate(orderBy: string | undefined): boolean {
    return !this.getInvalidOrderByFields(orderBy)?.length;
  }

  getInvalidOrderByFields(orderBy: string | undefined): string[] {
    const orderByList = orderBy?.split(',') || [];
    return orderByList.flatMap((orderByVal) => {
      const [field, value] = orderByVal?.split(':') || [];
      const errors: string[] = [];

      if (
        field &&
        !PermitsOrderByConstraint.ALLOWED_PERMIT_ORDER_BY_VALUES.includes(
          field as PermitOrderBy,
        )
      ) {
        errors.push(`${field} is an invalid sort field.`);
      }

      if (
        value &&
        !PermitsOrderByConstraint.ALLOWED_ORDER_BY_VALUES.includes(
          value as OrderBy,
        )
      ) {
        errors.push(
          `${value} is an invalid sort order direction for field ${field}.`,
        );
      }

      return errors;
    });
  }

  defaultMessage(args: ValidationArguments): string {
    const orderBy = (args.object as { orderBy?: string }).orderBy;
    const invalidFields = this.getInvalidOrderByFields(orderBy);
    return invalidFields.join(' ');
  }
}
