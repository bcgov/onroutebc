import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionDto } from '../dto/exception.dto';

/*Catch all but http exceptions */
@Catch()
export class FallbackExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      //request = ctx.getRequest<Request>(),
      response = ctx.getResponse<Response>();
    const exceptionDto = new ExceptionDto(500, exception.message);
    return response.status(500).json(exceptionDto);
  }
}