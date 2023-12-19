import { Logger } from '@nestjs/common';
import { AbstractLogger, LogLevel, LogMessage } from 'typeorm';

/**
 * To prevent sensitive information being printed onto logs
 */
class CustomError extends Error {
  constructor(message, printStack = false) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super(message);
    if (!printStack) {
      this.stack = '';
    }
  }
}

export class TypeormCustomLogger extends AbstractLogger {
  private readonly logger = new Logger(TypeormCustomLogger.name);
  /**
   * Write log to specific output.
   */
  protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[]) {
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: true,
      appendParameterAsComment: false,
      addColonToPrefix: false,
    });

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          this.logger.log(message.message);
          break;

        case 'info':
        case 'query':
          if (message.prefix) {
            this.logger.log(
              `${message.prefix} : ${message.message?.toString()}`,
            );
          } else {
            this.logger.log(message.message);
          }
          break;
        case 'warn':
        case 'query-slow':
          if (message.prefix) {
            this.logger.warn(
              `${message.prefix} : ${message.message?.toString()}`,
            );
          } else {
            this.logger.warn(message.message);
          }
          break;
        case 'error':
        case 'query-error':
          if (message.prefix === 'query failed') {
            this.logger.error(
              `${message.prefix} : ${message.message?.toString()}`,
            );
            this.logger.error(message.parameters); // Mask sensitive infromation before logging if needed
          } else {
            this.logger.error(new CustomError(message.message));
          }
          break;
      }
    }
  }
}
