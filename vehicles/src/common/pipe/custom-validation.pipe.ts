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

  function findChildErrors(error: ValidationError): ValidationError[] {
    let childErrors: ValidationError[] = [];
    if (error?.children?.length) {
      for (const child of error.children) {
        childErrors = childErrors.concat(findChildErrors(child));
      }
    } else {
      childErrors.push(error);
    }
    return childErrors;
  }

  errors.forEach((error) => {
    const childErrors = findChildErrors(error);
    childErrors.forEach((childError) => {
      const badRequestExceptionDto = new BadRequestExceptionDto();
      badRequestExceptionDto.field = childError?.property
        ? error?.property?.concat('.', childError?.property?.toString())
        : error?.property;
      badRequestExceptionDto.message = Object.values(
        childError?.constraints || error?.constraints,
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
