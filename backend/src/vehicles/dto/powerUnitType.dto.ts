import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class PowerUnitTypeDto extends BaseDto {
  @ApiProperty({
    description: 'The Power Unit Type ID',
  })
  typeId: number;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type' })
  type: string;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type Description' })
  description: string;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type Alias' })
  alias: string;

  @ApiProperty({
    description: 'Created by',
    example: 'user1',
  })
  createdUser: string;
}
