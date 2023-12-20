import { Logger } from '@nestjs/common';

export function LogMethodExecution() {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const logger = new Logger(target.constructor.name);
    /* eslint-disable */
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      logger.debug(`Entering ${propertyKey} method`);
      const result = originalMethod.apply(this, args);
      logger.debug(`Exiting ${propertyKey} method`);
      return result;
    };
    /* eslint-enable */

    return descriptor;
  };
}
