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
    this.logger.error(
      'HTTP exception handler triggered',
      JSON.stringify(exception),
    );

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>(),
      statusCode = exception.getStatus();
    if (statusCode === HttpStatus.BAD_REQUEST) {
      exceptionDto = exception.getResponse() as ExceptionDto;
    } else {
      exceptionDto = new ExceptionDto(statusCode, exception.message);
    }

    return response.status(statusCode).json(exceptionDto);
  }
}
