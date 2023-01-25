import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @AutoMap()
  @ApiProperty({ example: '1', description: 'Concurrency Control Number' })
  concurrencyControlNumber: number;

  @AutoMap()
  @ApiProperty({
    description: 'Created by',
    example: 'user1',
  })
  createdUser: string;

  @AutoMap()
  @ApiProperty({
    description: 'Created Date and Time',
  })
  createdDateTime: string;

  @AutoMap()
  @ApiProperty({
    description: 'Updated by',
    example: 'user1',
  })
  updatedUser: string;

  @AutoMap()
  @ApiProperty({
    description: 'Updated Date and Time',
  })
  updatedDateTime: string;
}
