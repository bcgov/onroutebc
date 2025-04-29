import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionDto } from '../exception/exception.dto';
import { TypeORMError } from 'typeorm';
import { ClsServiceManager } from 'nestjs-cls';

/*Catch all but http exceptions */
@Catch()
export class FallbackExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(FallbackExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      request = ctx.getRequest<Request>(),
      response = ctx.getResponse<Response>();
    let message: string, status: HttpStatus;

    if (exception instanceof TypeORMError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = (exception as Error).message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = getErrorMessage(exception);
    }

    const cls = ClsServiceManager.getClsService();
    const correlationId = cls.getId();
    if (!response.getHeader('x-correlation-id') && correlationId) {
      response.setHeader('x-correlation-id', correlationId);
    }

    this.logger.error(
      `Response: ${request.method} ${request.url} ${status} - ${message}`,
      getErrorStack(exception),
    );
    // TODO : Update the below implemenation to send 422 instead of 500.
    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }
    const exceptionDto = new ExceptionDto(status, message);
    return response.status(status).json(exceptionDto);
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getErrorStack(error: unknown) {
  if (error instanceof Error) return error.stack;
}
