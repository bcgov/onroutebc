import { LogLevel } from 'typeorm';

export const getTypeormLogLevel = (logLevelString: string): LogLevel[] => {
  const logLevels = logLevelString ? logLevelString.split(',') : ['error'];

  const logLevelValues = logLevels.map((logLevel) => {
    const logLevelValue = logLevel as LogLevel;
    if (!isValidLogLevel(logLevelValue)) {
      return 'error'; //bypass incorrect value in vault
      //throw new Error(`Unknown log level: ${logLevel}`);
    }
    return logLevelValue;
  });

  return logLevelValues;
};

const isValidLogLevel = (logLevel: LogLevel): boolean => {
  return [
    'query',
    'schema',
    'error',
    'warn',
    'info',
    'log',
    'migration',
  ].includes(logLevel);
};
