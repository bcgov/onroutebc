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

/*Catch all http exceptions */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    let exceptionDto: ExceptionDto;

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>(),
      request = ctx.getRequest<Request>(),
      statusCode = exception.getStatus();

    this.logger.error(
      (exception as Error).message,
      JSON.stringify(exception),
      `${request.method} ${request.url} ${statusCode}`,
    );

    if (statusCode === HttpStatus.BAD_REQUEST) {
      exceptionDto = exception.getResponse() as ExceptionDto;
    } else {
      exceptionDto = new ExceptionDto(statusCode, exception.message);
    }

    return response.status(statusCode).json(exceptionDto);
  }
}
