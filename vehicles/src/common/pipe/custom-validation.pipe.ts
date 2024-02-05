import {
  BadRequestException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { BadRequestExceptionDto } from '../exception/badRequestException.dto';
import { ExceptionDto } from '../exception/exception.dto';

export function exceptionFactory(errors: ValidationError[]) {
  const badRequestExceptionList: BadRequestExceptionDto[] = [];

  function findLastErrors(error: ValidationError): ValidationError[] {
    let lastErrors: ValidationError[] = [];
    if (error?.children?.length) {
      for (const child of error.children) {
        lastErrors = lastErrors.concat(findLastErrors(child));
      }
    } else {
      lastErrors.push(error);
    }
    return lastErrors;
  }

  errors.forEach((error) => {
    const lastErrors = findLastErrors(error);
    lastErrors.forEach((lastError) => {
      const badRequestExceptionDto = new BadRequestExceptionDto();
      badRequestExceptionDto.field = lastError?.property
        ? error?.property?.concat('.', lastError?.property?.toString())
        : error?.property;
      badRequestExceptionDto.message = Object.values(
        lastError?.constraints || error?.constraints,
      );
      badRequestExceptionList.push(badRequestExceptionDto);
    });
  });

  const exceptionDto = new ExceptionDto(
    HttpStatus.BAD_REQUEST,
    'Bad Request',
    badRequestExceptionList,
  );

  return new BadRequestException(exceptionDto);
}

export const CustomValidationPipe = new ValidationPipe({
  exceptionFactory,
  forbidUnknownValues: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  validationError: { target: false },
});
