import { ApiProperty } from '@nestjs/swagger';

export class ValidationExceptionDto {
  @ApiProperty({
    example: { companyId: 74 },
    description: 'Additional Info',
  })
  additionalInfo?: object;

  @ApiProperty({
    description: 'Error Code',
    type: String,
  })
  errorCode?: string;

  @ApiProperty({
    description: 'Error Message',
    type: String,
  })
  message: string;
}
