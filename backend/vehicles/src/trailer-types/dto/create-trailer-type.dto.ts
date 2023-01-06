import { PickType } from '@nestjs/swagger';
import { TrailerTypeDto } from './trailer-type.dto';

export class CreateTrailerTypeDto extends PickType(TrailerTypeDto, [
  'typeId',
  'type',
  'description',
  'alias',
] as const) {}
