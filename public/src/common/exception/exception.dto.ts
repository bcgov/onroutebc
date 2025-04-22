import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { BadRequestExceptionDto } from './badRequestException.dto';
import { ValidationExceptionDto } from './validation.exception.dto';

@ApiExtraModels(BadRequestExceptionDto, ValidationExceptionDto)
export class ExceptionDto {
  constructor(
    status: number,
    message: string,
    error?: BadRequestExceptionDto[] | ValidationExceptionDto[],
  ) {
    this.message = message;
    this.status = status;
    this.error = error;
  }
  @ApiProperty({
    example: 'Status',
    description: 'Http Status Code',
  })
  status: number;

  @ApiProperty({
    example: 'Message',
    description: 'Http Error Message',
  })
  message: string;

  @ApiProperty({
    description: 'The optional field with additional error details',
    required: false,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(BadRequestExceptionDto) },
      { $ref: getSchemaPath(ValidationExceptionDto) },
    ],
  })
  error?: BadRequestExceptionDto[] | ValidationExceptionDto[];
}
