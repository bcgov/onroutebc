/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          dayjs.extend(utc);
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[
            relatedPropertyName
          ] as string;
          return dayjs.utc(relatedValue).isAfter(dayjs.utc(value));
        },
      },
    });
  };
}
