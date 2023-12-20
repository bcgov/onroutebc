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
      this.logMessage(message, level);
    }
  }

  private logMessage(message: LogMessage, level: LogLevel) {
    switch (message.type ?? level) {
      case 'log':
      case 'schema-build':
      case 'migration':
        this.logger.log(message.message);
        break;

      case 'info':
      case 'query':
        this.logInfoOrQuery(message);
        break;

      case 'warn':
      case 'query-slow':
        this.logWarnOrQuerySlow(message);
        break;

      case 'error':
      case 'query-error':
        this.logErrorOrQueryError(message);
        break;
    }
  }

  private logInfoOrQuery(message: LogMessage) {
    if (message.prefix) {
      this.logger.log(`${message.prefix} : ${message.message?.toString()}`);
    } else {
      this.logger.log(message.message);
    }
  }

  private logWarnOrQuerySlow(message: LogMessage) {
    if (message.prefix) {
      this.logger.warn(`${message.prefix} : ${message.message?.toString()}`);
    } else {
      this.logger.warn(message.message);
    }
  }

  private logErrorOrQueryError(message: LogMessage) {
    if (message.prefix === 'query failed') {
      this.logger.error(`${message.prefix} : ${message.message?.toString()}`);
      // Prameter log level set to Debug
      this.logger.debug(message.parameters); // Mask sensitive information before logging if needed
    } else {
      this.logger.error(new CustomError(message.message));
    }
  }
}
