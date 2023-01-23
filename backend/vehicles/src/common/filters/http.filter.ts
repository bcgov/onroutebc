import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionDto } from '../dto/exception.dto';
/*Catch all http exceptions */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('HTTP exception handler triggered', JSON.stringify(exception));

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>(),
      statusCode = exception.getStatus();
    const exceptionDto = new ExceptionDto(statusCode, exception.message);
    return response.status(statusCode).json(exceptionDto);
  }
}
