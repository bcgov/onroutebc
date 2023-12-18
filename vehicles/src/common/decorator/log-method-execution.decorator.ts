import { Logger } from '@nestjs/common';

export function LogMethodExecution() {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    /* eslint-disable */
    const logger = new Logger(target.constructor.name);
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      logger.log(`Entering ${propertyKey} method`);
      const result = originalMethod.apply(this, args);
      logger.log(`Exiting ${propertyKey} method`);
      return result;
    };
    /* eslint-enable */

    return descriptor;
  };
}
