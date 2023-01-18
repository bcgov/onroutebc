import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { TrailerTypeDto } from './trailer-type.dto';

export class UpdateTrailerTypeDto extends TrailerTypeDto {
  @AutoMap()
  @ApiProperty({ example: '1', description: 'Sort Order' })
  sortOrder: string;
}
