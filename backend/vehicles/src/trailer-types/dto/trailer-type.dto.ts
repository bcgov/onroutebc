import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';

export class TrailerTypeDto extends BaseDto {
  @ApiProperty({ example: 'BOOSTR', description: 'The Trailer Type Code' })
  typeCode: string;

  @ApiProperty({ example: 'Boosters', description: 'Trailer Type' })
  type: string;

  @ApiProperty({
    example: 'A Booster is similar to a jeep, but it is used behind a load.',
    description: 'Trailer Type Description',
  })
  description: string;
}
