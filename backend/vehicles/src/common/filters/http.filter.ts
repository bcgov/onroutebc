import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionDto } from '../../modules/common/dto/exception.dto';
import { BadRequestExceptionDto } from '../../modules/common/dto/badRequestException.dto';
/*Catch all http exceptions */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let exceptionDto: ExceptionDto | BadRequestExceptionDto;
    console.log('HTTP exception handler triggered', JSON.stringify(exception));

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>(),
      statusCode = exception.getStatus();
    if (statusCode === HttpStatus.BAD_REQUEST) {
      const exceptionBody = exception.getResponse() as BadRequestExceptionDto;
      exceptionDto = new BadRequestExceptionDto(
        statusCode,
        exceptionBody.message,
      );
    } else {
      exceptionDto = new ExceptionDto(statusCode, exception.message);
    }

    return response.status(statusCode).json(exceptionDto);
  }
}
