import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { OrderBy } from '../enum/orderBy.enum';

@ValidatorConstraint({ name: 'OrderBy', async: false })
export class OrderByConstraint implements ValidatorConstraintInterface {
  private static readonly ALLOWED_ORDER_BY_VALUES = Object.values(OrderBy);

  validate(orderBy: string | undefined, args: ValidationArguments): boolean {
    return !this.getInvalidOrderByFields(orderBy, args)?.length;
  }

  getInvalidOrderByFields(
    orderBy: string | undefined,
    args: ValidationArguments,
  ): string[] {
    const orderByList = orderBy?.split(',') || [];
    const allowedPermitOrderByValues = Object.values(
      args.constraints?.at(0) as Record<string, unknown>,
    );
    return orderByList.flatMap((orderByVal) => {
      const [field, value] = orderByVal?.split(':') || [];
      const errors: string[] = [];

      if (field && !allowedPermitOrderByValues.includes(field)) {
        errors.push(`${field} is an invalid sort field.`);
      }

      if (
        value &&
        !OrderByConstraint.ALLOWED_ORDER_BY_VALUES.includes(value as OrderBy)
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
    const invalidFields = this.getInvalidOrderByFields(orderBy, args);
    return invalidFields.join(' ');
  }
}
