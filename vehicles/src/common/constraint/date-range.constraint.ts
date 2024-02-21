import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

@ValidatorConstraint({ name: 'DateRange', async: false })
export class DateRangeConstraint implements ValidatorConstraintInterface {
  validate(value: string | undefined, args: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { constraints, object, property, targetName } = args;
    dayjs.extend(utc);
    dayjs.utc(toDateTime).isAfter(dayjs.utc(fromDateTime));
    console.log('-----------------------------');
    console.log('comment::', value);
    console.log('args::', args);
    console.log('-----------------------------');
    return false;
  }

  defaultMessage() {
    return `Comment is required `;
  }
}
