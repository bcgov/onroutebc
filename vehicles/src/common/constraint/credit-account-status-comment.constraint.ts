import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import {
  CreditAccountStatus,
  CreditAccountStatusValidType,
} from '../enum/credit-account-status-type.enum';

@ValidatorConstraint({
  name: 'CreditAccountStatusCommentConstraint',
  async: false,
})
export class CreditAccountStatusCommentConstraint
  implements ValidatorConstraintInterface
{
  validate(comment: string | undefined, args: ValidationArguments) {
    const creditAccountStatusType = (
      args.object as {
        creditAccountStatusType?: CreditAccountStatusValidType;
      }
    ).creditAccountStatusType; // Access the searchString property from the same object

    // If CreditAccountStatusType.ACCOUNT_CLOSED or CreditAccountStatusType.ACCOUNT_ON_HOLD , comment should exists
    if (
      (creditAccountStatusType === CreditAccountStatus.ACCOUNT_CLOSED ||
        creditAccountStatusType === CreditAccountStatus.ACCOUNT_ON_HOLD) &&
      !comment
    ) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return `Comment is required when activity type is ${CreditAccountStatus.ACCOUNT_CLOSED} or ${CreditAccountStatus.ACCOUNT_ON_HOLD}`;
  }
}
