import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SuspendActivity } from '../enum/suspend-activity.enum';

@ValidatorConstraint({ name: 'SuspendComment', async: false })
export class SuspendCommentConstraint implements ValidatorConstraintInterface {
  validate(comment: string | undefined, args: ValidationArguments) {
    const suspendActivity = (
      args.object as {
        suspendActivity?: SuspendActivity;
      }
    ).suspendActivity; // Access the searchString property from the same object

    // If SuspendActivity.SUSPEND_COMPANY, comment should exists
    if (suspendActivity === SuspendActivity.SUSPEND_COMPANY && !comment) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return `Comment is required when activity type is ${SuspendActivity.SUSPEND_COMPANY}`;
  }
}
