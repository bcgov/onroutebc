import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrailerTypeDto {
  @AutoMap()
  @ApiProperty({ example: 'Boosters', description: 'Trailer Type' })
  type: string;

  @AutoMap()
  @ApiProperty({
    example: 'A Booster is similar to a jeep, but it is used behind a load.',
    description: 'Trailer Type Description',
  })
  description: string;

  @AutoMap()
  @ApiProperty({ example: '1', description: 'Sort Order' })
  sortOrder: string;
}
