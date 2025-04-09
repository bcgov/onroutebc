import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';

const correlationIdFormat = winston.format((info) => {
  const cls = ClsServiceManager.getClsService();
  const correlationId = cls.getId();
  if (correlationId) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    info.message = `[${correlationId}] ${info.message}`;
  }
  return info;
})();

const globalLoggerFormat: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS',
  }),
  winston.format.ms(),
);

const localLoggerFormat: winston.Logform.Format = winston.format.combine(
  winston.format.colorize(),
  winston.format.align(),
  winston.format.splat(),
  correlationIdFormat,
  utilities.format.nestLike('Vehicles', { colors: true, prettyPrint: true }),
);

const errorStack: winston.Logform.Format = winston.format.combine(
  winston.format.errors({ stack: true }),
);

export const customLogger: LoggerService = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.VEHICLES_API_LOG_LEVEL || 'silly',
      format: winston.format.combine(
        globalLoggerFormat,
        localLoggerFormat,
        errorStack,
      ),
    }),
  ],
  exitOnError: false,
});
