import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SuspendActivity } from '../enum/suspend-activity.enum';

@ValidatorConstraint({ name: 'SuspendComment', async: false })
export class SuspendCommentConstraint implements ValidatorConstraintInterface {
  validate(comment: string | undefined, args: ValidationArguments) {
    const suspendAcitivity = (
      args.object as {
        suspendAcitivity?: SuspendActivity;
      }
    ).suspendAcitivity; // Access the searchString property from the same object

    // If SuspendActivity.SUSPEND_COMPANY, comment should exists
    if (suspendAcitivity === SuspendActivity.SUSPEND_COMPANY && !comment) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return `Comment is required when activity type is ${SuspendActivity.SUSPEND_COMPANY}`;
  }
}
