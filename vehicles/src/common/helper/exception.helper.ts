import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { ExceptionDto } from '../exception/exception.dto';
import { ValidationExceptionDto } from '../exception/validation.exception.dto';

export const throwUnprocessableEntityException = (
  message: string,
  additionalInfo?: object,
) => {
  throw new UnprocessableEntityException({
    message: 'Unprocessable Entity',
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    error: [
      {
        message: message,
        additionalInfo: additionalInfo,
      },
    ] as ValidationExceptionDto[],
  } as ExceptionDto);
};
