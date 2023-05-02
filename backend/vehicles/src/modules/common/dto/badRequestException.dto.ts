import { ApiProperty } from '@nestjs/swagger';

export class BadRequestExceptionDto {
  constructor(status: number, message: string[]) {
    this.message = message;
    this.status = status;
  }
  @ApiProperty({
    example: '400',
    description: 'Http Status Code',
  })
  status: number;

  @ApiProperty({
    description: 'Error Message',
    isArray: true,
    type: String,
  })
  message: string[];
}
