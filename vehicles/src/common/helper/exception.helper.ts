import {
  BadRequestException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ExceptionDto } from '../exception/exception.dto';
import { ValidationExceptionDto } from '../exception/validation.exception.dto';
import { BadRequestExceptionDto } from '../exception/badRequestException.dto';

export const throwUnprocessableEntityException = (
  message: string,
  additionalInfo?: object,
  errorCode?: string,
) => {
  throw new UnprocessableEntityException({
    message: 'Unprocessable Entity',
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    error: [
      {
        message: message,
        additionalInfo: additionalInfo,
        errorCode: errorCode,
      },
    ] as ValidationExceptionDto[],
  } as ExceptionDto);
};

export const throwBadRequestException = (field: string, message: string[]) => {
  throw new BadRequestException({
    message: 'Bad Request',
    status: HttpStatus.BAD_REQUEST,
    error: [
      {
        field: field,
        message: message,
      },
    ] as BadRequestExceptionDto[],
  } as ExceptionDto);
};
