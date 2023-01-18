import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty({ example: '1', description: 'Concurrency Control Number' })
  concurrencyControlNumber: number;

  @ApiProperty({
    description: 'Created by',
    example: 'user1',
  })
  createdUser: string;

  @ApiProperty({
    description: 'Created Date and Time',
  })
  createdDateTime: string;

  @ApiProperty({
    description: 'Updated by',
    example: 'user1',
  })
  updatedUser: string;

  @ApiProperty({
    description: 'Updated Date and Time',
  })
  updatedDateTime: string;
}
