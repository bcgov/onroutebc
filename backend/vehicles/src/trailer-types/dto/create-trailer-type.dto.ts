import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateTrailerTypeDto } from './update-trailer-type.dto';

export class CreateTrailerTypeDto extends UpdateTrailerTypeDto {
  @AutoMap()
  @ApiProperty({ example: 'BOOSTR', description: 'The Trailer Type Code' })
  typeCode: string;
}
