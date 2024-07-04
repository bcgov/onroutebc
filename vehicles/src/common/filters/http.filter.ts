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
import { ClsServiceManager } from 'nestjs-cls';

/*Catch all http exceptions */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    let exceptionDto: ExceptionDto;

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>(),
      request = ctx.getRequest<Request>(),
      statusCode: HttpStatus = exception.getStatus();

    const cls = ClsServiceManager.getClsService();
    const correlationId = cls.getId();
    if (!response.getHeader('x-correlation-id') && correlationId) {
      response.setHeader('x-correlation-id', correlationId);
    }
    this.logger.error(
      `Response: ${request.method} ${request.url} ${statusCode} - ${
        (exception as Error).message
      }`,
      JSON.stringify(exception),
    );

    if (
      statusCode === HttpStatus.BAD_REQUEST ||
      statusCode === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      exceptionDto = exception.getResponse() as ExceptionDto;
    } else {
      exceptionDto = new ExceptionDto(statusCode, exception.message);
    }

    return response.status(statusCode).json(exceptionDto);
  }
}
