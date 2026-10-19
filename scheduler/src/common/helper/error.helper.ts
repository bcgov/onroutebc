import { inspect } from 'node:util';

export const describeError = (
  error: unknown,
): {
  message: string;
  stack?: string;
} => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: inspect(error),
    stack: undefined,
  };
};
