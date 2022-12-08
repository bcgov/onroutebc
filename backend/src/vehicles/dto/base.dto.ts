import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'typeorm';

export class BaseDto {
   @ApiProperty({
    description: 'Created by',
    example: 'user1'
  })
  createdUser: string;

  @ApiProperty({
    description: 'Created Date and Time'
  })
  createdDateTime: Timestamp;

  @ApiProperty({
    description: 'Updated by',
    example: 'user1'
  })
  updatedUser: string;

  @ApiProperty({
    description: 'Updated Date and Time'
  })
  updatedDateTime: Timestamp;
}
