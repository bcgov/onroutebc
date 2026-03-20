import { Logger } from '@nestjs/common';

export function LogMethodExecution(logMethodOptions?: {
  printMemoryStats: boolean;
}) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    let memoryUsage = '';
    /* eslint-disable */
    const logger = new Logger(target.constructor.name);
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (
        logMethodOptions?.printMemoryStats &&
        process.env.PUBLIC_API_LOG_LEVEL === 'debug'
      ) {
        const memoryStats = process.memoryUsage();
        memoryUsage = `, Memory usage: ${JSON.stringify(memoryStats)}`;
      }
      logger.debug(
        `>> Entering ${target.constructor.name}.${propertyKey} method${memoryUsage}`,
      );

      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const end = performance.now();
      const executionTime = end - start;
      if (
        logMethodOptions?.printMemoryStats &&
        process.env.PUBLIC_API_LOG_LEVEL === 'debug'
      ) {
        const memoryStats = process.memoryUsage();
        memoryUsage = `, Memory usage: ${JSON.stringify(memoryStats)}`;
      }
      logger.debug(
        `<< Exiting ${target.constructor.name}.${propertyKey} method, execution time: ${executionTime}ms${memoryUsage}`,
      );
      return result;
    };
    /* eslint-enable */

    return descriptor;
  };
}
