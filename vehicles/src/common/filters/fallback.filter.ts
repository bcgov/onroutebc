import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionDto } from '../exception/exception.dto';

/*Catch all but http exceptions */
@Catch()
export class FallbackExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(FallbackExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      //request = ctx.getRequest<Request>(),
      response = ctx.getResponse<Response>();
    this.logger.error(getErrorMessage(exception), getErrorStack(exception));
    const exceptionDto = new ExceptionDto(500, getErrorMessage(exception));
    return response.status(500).json(exceptionDto);
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getErrorStack(error: unknown) {
  if (error instanceof Error) return error.stack;
}
