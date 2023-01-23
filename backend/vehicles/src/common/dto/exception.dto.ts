import { ApiProperty } from '@nestjs/swagger';

export class ExceptionDto {
  constructor(status: number, message: string) {
    this.message = message;
    this.status = status;
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
}