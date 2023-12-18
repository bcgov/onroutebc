import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';

const globalLoggerFormat: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS',
  }),
  winston.format.ms(),
);

const localLoggerFormat: winston.Logform.Format = winston.format.combine(
  winston.format.colorize(),
  winston.format.align(),
  utilities.format.nestLike('Vehicles', { colors: true, prettyPrint: true }),
);

const errorStack: winston.Logform.Format = winston.format.combine(
  winston.format.errors({ stack: true }),
);

export const customLogger: LoggerService = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        globalLoggerFormat,
        localLoggerFormat,
        errorStack,
      ),
    }),
  ],
  exitOnError: false,
});
