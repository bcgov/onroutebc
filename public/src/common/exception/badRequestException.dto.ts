import { ApiProperty } from '@nestjs/swagger';

export class BadRequestExceptionDto {
  @ApiProperty({
    example: 'vin',
    description: 'The field name',
  })
  field: string;

  @ApiProperty({
    description: 'Error Message',
    isArray: true,
    type: String,
  })
  message: string[];
}
