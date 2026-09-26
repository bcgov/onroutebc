import {
  BadRequestException,
  HttpStatus,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BadRequestExceptionDto } from '@app/exception/badRequestException.dto';
import { ValidationExceptionDto } from '@app/exception/validation.exception.dto';

export const throwUnprocessableEntityException = (
  message: string,
  errorCode?: string,
  additionalInfo?: object,
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
  });
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
  });
};

export const throwNotAcceptableException = (
  message: string,
  errorCode: string,
) => {
  throw new NotAcceptableException({
    message,
    status: HttpStatus.NOT_ACCEPTABLE,
    error: {
      message,
      errorCode,
    } as ValidationExceptionDto,
  });
};
