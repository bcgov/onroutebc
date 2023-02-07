import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionDto } from '../../modules/common/dto/exception.dto';

/*Catch all but http exceptions */
@Catch()
export class FallbackExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      //request = ctx.getRequest<Request>(),
      response = ctx.getResponse<Response>();
    const exceptionDto = new ExceptionDto(500, getErrorMessage(exception));
    return response.status(500).json(exceptionDto);
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
