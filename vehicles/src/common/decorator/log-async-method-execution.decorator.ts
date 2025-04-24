import { Logger } from '@nestjs/common';

export function LogAsyncMethodExecution(logMethodOptions?: {
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
    descriptor.value = async function (...args: any[]) {
      if (logMethodOptions?.printMemoryStats) {
        const memoryStats = process.memoryUsage();
        memoryUsage = `, Memory usage: ${JSON.stringify(memoryStats)}`;
      }
      console.log(
        `>> Entering ${target.constructor.name}.${propertyKey} method${memoryUsage}`,
      );

      const start = performance.now();
      const result = await originalMethod.apply(this, args);
      const end = performance.now();
      const executionTime = end - start;
      if (logMethodOptions?.printMemoryStats) {
        const memoryStats = process.memoryUsage();
        memoryUsage = `, Memory usage: ${JSON.stringify(memoryStats)}`;
      }
      console.log(
        `<< Exiting ${target.constructor.name}.${propertyKey} method, execution time: ${executionTime}ms${memoryUsage}`,
      );
      return result;
    };
    /* eslint-enable */

    return descriptor;
  };
}
